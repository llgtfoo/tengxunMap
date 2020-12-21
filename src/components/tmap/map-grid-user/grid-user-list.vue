<template>
  <div class="grid-user-list">
    <div class="search-input">
      <el-input  v-model="query.userName"
                 @clear="clearInputHandle"
                 size="small"
                 @keyup.enter.native="renderUserList" clearable placeholder="请输入网格员名称查询">
        <el-button @click="renderUserList" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="tabs">
      <div class="tab-item" :class="{active: currentTab==='all'}" @click="handleTabClick('all')"><p>全部</p></div>
      <div class="tab-item" :class="{active: currentTab==='online'}" @click="handleTabClick('online')"><p>在线</p></div>
      <div class="tab-item" :class="{active: currentTab==='offline'}" @click="handleTabClick('offline')"><p>离线</p></div>
    </div>
    <div v-loading="loading" class="user-list">
      <div class="user-item" v-for="item in userList" :key="item.userId" @click="clickRow(item)">
        <span class="item name" :title="item.userLabel">
          <svg-icon v-if="item.userType==='leader'" icon-class="griduser-leader"></svg-icon>
          <svg-icon v-else icon-class="griduser-member"></svg-icon>
          {{item.userLabel}}
        </span>
        <span class="item telephone">
          <span>{{item.userPhone}} </span>
          <el-tooltip v-if="item.userPhone" class="item" effect="dark" content="开始视频通话" placement="top">
            <svg-icon @click.native.stop="openVideoCall(item)" icon-class="camera"></svg-icon>
          </el-tooltip>
        </span>
        <span class="item status">{{item.isLine ? '在线' : '离线'}}</span>
        <div class="item task-list">
          <el-tooltip class="item" effect="dark" content="打开轨迹列表" placement="top">
            <svg-icon @click.native.stop="openTrackList(item)" icon-class="task-list-icon"></svg-icon>
          </el-tooltip>
        </div>
      </div>
      <div v-if="!loading && userList.length === 0" class="empty">
        暂无数据
      </div>
    </div>
    <div class="bottom">
      <el-pagination
          id="pagination"
          small
          layout="total, prev, next, sizes"
          :pager-count=5
          :page-sizes="[10, 20, 50, 100, 500, 1000]"
          :current-page="query.offset"
          @size-change="handleSizeChange"
          @current-change="currentChangeHandle"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { CancelToken } from 'axios'
  import { getUserList } from "../../../api/grid-user";
  import {OK} from "../../../api/code";
  import {lnglat2latlngObj} from "../../../../transform/lnglat2latlngobj";
  import { getUserDetailTemplate } from "../../../common/tmap/user-detail-template";
  import { Bus } from "../../../common/js/bus";
  import { getImageUrl } from "../../../utils/app-helpers";
  import { points } from '@turf/helpers'
  import { getBounds } from "../../../utils/getbounds";

  const WX_AGENTID = '1000018'
  const WX_CORPID = 'wwba3b94c5c0bb7ccf'

  export default {
    name: "grid-user-list",
    inject: ['getMap'],
    data () {
      return {
        loading: true,
        query: {
          offset: 1,
          limit: 10,
          userName: null,
          isLine: 'all'
        },
        userList: [],
        total: 0,
        currentTab: 'all',
        hasFit: false // 只有该组件初始化的时候需要对网格员列表做一次fit，后面自动刷新时不需要
      }
    },
    created () {
      this.markerLayer = null // 网格员图标图层
      this.infoWindow = null
      this.renderUserList()
      Bus.$on('clickTrackBtn', this.clickTrackBtnListener = userName => {
        const user = this.userList.find(user => user.userName === userName)
        this.openTrackList(user)
      })
      Bus.$on('clickCameraBtn', this.clickCameraBtnListener = userPhone => {
        this.openVideoCall({ userPhone })
      })
      Bus.$on('clickGridUserDetailBtn', this.clickGridUserDetailBtnListener = id => {
        this.clickDetailHandle(id)
      })
      this.cancelGetUserListFn = () => {}
    },
    computed: {
      currentOrg () {
        return this.$store.state.currentOrg
      }
    },
    beforeDestroy () {
      this.cancelGetUserListFn()
      Bus.$off('clickTrackBtn', this.clickTrackBtnListener)
      Bus.$off('clickCameraBtn', this.clickCameraBtnListener)
      Bus.$off('clickGridUserDetailBtn', this.clickGridUserDetailBtnListener)
      clearInterval(this.timer)
      if (this.markerLayer) {
        this.markerLayer.setMap(null)
        this.markerLayer = null
      }
      this.infoWindow && this.infoWindow.destroy()
    },
    watch: {
      currentOrg () {
        this.renderUserList()
      }
    },
    methods: {
      renderUserList () {
        const getUserList = () => {
          Object.assign(this.query, { userLabel: this.query.userName })
          const params = Object.assign(this.query, {orgCode: this.currentOrg.orgCode})
          this._getUserList(params).then(userData => {
            const { total = 0, list = [] } = userData
            this.userList = list
            this.total = total
            this.showMarkers(list)
            if (!this.hasFit) {
              this.fitView(list)
              this.hasFit = true
            }
          })
        }

        // 需要定时刷新网格员列表
        const fn = () => {
          getUserList()
          clearTimeout(this.timer)
          this.timer = setTimeout(fn, 10000)
        }
        fn()
      },
      _getUserList (query) {
        this.loading = true;
        const cancelToken = new CancelToken(c => (this.cancelGetUserListFn = c))
        return getUserList(query, cancelToken).then(res => {
          return res.code === OK ? res.data : {}
        }).finally(() => {
          this.loading = false;
        })
      },
      showMarkers (list) {
        const geometries = list.filter(user => {
          return user.centerLon && user.centerLat
        }).map(user => {
          let styleId = 'member'
          if (user.userType === 'leader') {
            styleId = 'leader'
          }
          return {
            id: 'gridUser',
            styleId,
            position: lnglat2latlngObj([user.centerLon, user.centerLat]),
            properties: user
          }
        })

        if (this.markerLayer) {
          this.markerLayer.setGeometries(geometries)
        } else {
          this.markerLayer = this.createMarkers(geometries)
          this.markerLayer.on('click', event => {
            const { properties } = event.geometry
            if (!this.infoWindow) {
              this.infoWindow = this.createInfoWindow()
            }
            this.infoWindow.open()
            this.infoWindow.setPosition(event.geometry.position)
            this.infoWindow.setContent(getUserDetailTemplate(properties))
          })
        }
      },
      createMarkers (geometries) {
        return new TMap.MultiMarker({
          id: "grid-user-layer", //图层id
          map: this.getMap(),
          geometries,
          styles: this.getStyles()
        })
      },
      clearInputHandle () {
        this.query.offset = 1
        this.renderUserList()
      },
      handleTabClick (name) {
        this.currentTab = name
        this.query.isLine = name
        this.query.offset = 1
        this.renderUserList()
      },
      clickRow (row) {
        const { centerLon, centerLat } = row
        this.getMap().easeTo({
          center: lnglat2latlngObj([centerLon, centerLat]),
          zoom: 20
        })
      },
      openTrackList (row) {
        setTimeout(() => {
          this.$emit('click-track-btn', row)
        }, 10)
      },
      handleSizeChange (size) {
        this.query.limit = size
        this.renderUserList()
      },
      currentChangeHandle (page) {
        this.query.offset = page
        this.renderUserList()
      },
      openVideoCall (user) {
        console.log('唤起政务微信')
        const { userPhone } = user
        window.location.href = `wxworklocal://message?userid=${userPhone}&amp;agentid=${WX_AGENTID}&amp;corpid=${WX_CORPID}`
      },
      getStyles () {
        return {
          leader: new TMap.MarkerStyle({
            "width": 30,
            "height": 56,
            "anchor": { x: 16, y: 32 },
            "src": getImageUrl('grid-user-leader')
          }),
          member: new TMap.MarkerStyle({
            "width": 30,
            "height": 56,
            "anchor": { x: 16, y: 32 },
            "src": getImageUrl('grid-user-member')
          })
        }
      },
      createInfoWindow () {
        const infoWindow = new TMap.InfoWindow({
          map: this.getMap(),
          position: new TMap.LatLng(0, 0),
          offset: { x: 0, y: -35 }, //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
          content: ''
        })
        infoWindow.close()
        return infoWindow
      },
      fitView (userList) {
        const lnglatArray = userList.map(user => {
          return [user.centerLon, user.centerLat]
        })
        const bounds = getBounds(points(lnglatArray))
        this.getMap().fitBounds(bounds, { padding: 100 })
      },
      clickDetailHandle (id) {
        const user = this.userList.find(user => user.id === id)
        const obj = { type: 'clickGridPerson', target: user }
        console.info('postMessage派发事件', obj)
        window.parent.postMessage(obj, '*')
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped>
  @import "../../../styl/mixins.styl"
  .grid-user-list
    overflow hidden
    background #fff
    .search-input
      box-sizing border-box
      padding 10px 15px 0 15px
      .el-input__suffix
        right 18px
        transform translateX(-20px)
      .search-btn
        position relative
        display inline-block
        vertical-align top
        margin-left 15px
        .search
          display inline-block
          width 30px
          height 30px
          cursor pointer
    .tabs
      display flex
      .tab-item
        flex 1
        line-height 30px
        text-align center
        font-size 12px
        color #333
        cursor pointer
        user-select none
        border-bottom 2px solid #F5F7FA
        &.active
          color #5A9BF8
          border-bottom-color #5A9BF8
    .user-list
      margin-top 8px
      overflow auto
      height 400px
      padding-bottom 34px
      .user-item
        font-size 12px
        color #606266
        display flex
        padding 10px 18px 10px 12px
        cursor pointer
        user-select none
        &:hover
          background-color #F5F7FA
        .item
          flex 1
          text-align right
          &.name
            width 100px
            flex 0 0 100px
            no-wrap()
          .el-icon-user
            margin-right 5px
          .el-icon-position
            cursor pointer
            &:hover
              color #5A9BF8
          &.telephone
            width 100px
            flex 0 0 100px
          &:first-child
            text-align left
      .empty
        margin-top 20px
        text-align center
        color #606266
        font-size 12px
    .bottom
      padding 0 15px
      position absolute
      bottom 0
      line-height 30px
      background #fff
      .el-pagination
        display inline-block
        padding 2px 0
        .el-pagination__total
          margin-right 2px
        .btn-prev
          padding-left 0
          padding-right 0
        .btn-next
          padding-left 0
          padding-right 0
        .el-pagination__jump
          margin 0
</style>

<style lang="stylus">
  .bottom
    .el-pagination
      .el-pagination__sizes
        margin-left 70px
        .el-select
          .el-input
            .el-input__inner
              border none !important
            .el-input--mini
              .el-input__inner
                height 22px
                line-height 22px
</style>
