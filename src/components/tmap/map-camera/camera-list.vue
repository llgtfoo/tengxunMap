<template>
  <div class="camera-list-container">
    <div class="search-input">
      <el-input  v-model="query.keyword"
                 @clear="clearInputHandle"
                 size="small"
                 @keyup.enter.native="renderCamera" clearable placeholder="请输入摄像头名称查询">
        <el-button @click="renderCamera" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div v-loading="loading" class="list-wrap">
      <div class="camera-item" v-for="item in cameraList" :key="item.id">
        <el-checkbox v-model="item.checked" @change="checkHandle(item)">
          {{item.name}}
        </el-checkbox>
      </div>
      <div v-if="!loading && cameraList.length === 0" class="empty">
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
      <div class="play-btn" @click="playCamerasHandle">视频播放</div>
    </div>
    <el-dialog
        title="摄像头播放"
        :close-on-click-modal="false"
        :width="playList.length > 1 ? '1120px' : '720px'"
        :modal-append-to-body="false"
        :visible.sync="showVideoDialog">
          <camera-play-container v-if="showVideoDialog" :list="playList"></camera-play-container>
          <span slot="footer" class="dialog-footer">
        <el-button @click="showVideoDialog = false">取 消</el-button>
        <el-button type="primary" @click="showVideoDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getPoiList } from "../../../api/poi";
  import {lnglat2latlngObj} from "../../../../transform/lnglat2latlngobj";
  import {getImageUrl} from "../../../utils/app-helpers";
  import {getBounds} from "../../../utils/getbounds";
  import { points } from '@turf/helpers'
  import CameraPlayContainer from './camera-play-contaner'
  import { Bus } from "../../../common/js/bus";
  import { getCameraDetailTemplate } from "../../../common/tmap/camera-detail-template";

  const CAMERA_TABLE_ID = process.env.VUE_APP_CAMERA_TABLE_ID

  export default {
    name: "camera-list",
    inject: ['getMap'],
    data () {
      return {
        loading: true,
        query: {
          offset: 1,
          limit: 10,
          keyword: ''
        },
        cameraList: [],
        playList: [], // 可播放的视频地址
        total: 0,
        showVideoDialog: false
      }
    },
    computed: {
      currentOrg () {
        return this.$store.state.currentOrg
      }
    },
    created () {
      this.markerLayer = null
      this.infoWindow = null
      Bus.$on('clickPlayBtn', this.clickPlayBtnListener = id => {
        this.playList = this.getPlayInfo([id])
        this.showVideoDialog = true
      })
      this.renderCamera()
    },
    beforeDestroy () {
      Bus.$off('clickPlayBtn', this.clickPlayBtnListener)
      this.markerLayer && this.markerLayer.setMap(null)
      this.markerLayer = null
      this.infoWindow && this.infoWindow.destroy()
    },
    watch: {
      currentOrg () {
        this.renderCamera()
      }
    },
    methods: {
      renderCamera () {
        this.loading = true
        const subjects = [{ tableId: Number(CAMERA_TABLE_ID) }]
        const orgCode = this.currentOrg.orgCode
        getPoiList(subjects, Object.assign({ orgCode }, this.query)).then(res => {
          const { total = 0, rows = [] } = res.data || {}
          this.total = total
          this.cameraList = rows
          this.renderMarkers(rows)
        }).finally(() => {
          this.loading = false
        })
      },
      clearInputHandle () {
        this.query.offset = 1
        this.renderCamera()
      },
      checkHandle (item) {
        if (this.cameraList.filter(i => i.checked).length > 9) {
          this.$message({
            showClose: true,
            message: '最多可播放9路',
            type: 'warning'
          })
          this.$set(item, 'checked', false)
        }
      },
      handleSizeChange (size) {
        this.query.limit = size
        this.renderCamera()
      },
      currentChangeHandle (page) {
        this.query.offset = page
        this.renderCamera()
      },
      renderMarkers (list) {
        const lnglatArray = [] // 收集经纬度用来求bounds

        const geometries = list.filter(item => {
          return item.location
        }).map(item => {
          const lnglat = item.location.split(',')
          const position = lnglat2latlngObj(lnglat)

          lnglatArray.push(lnglat)

          return {
            id: 'camera',
            styleId: 'camera',
            position,
            properties: item
          }
        })

        this.infoWindow && this.infoWindow.close()

        if (this.markerLayer) {
          this.markerLayer.setGeometries(geometries)
        } else {
          this.markerLayer = this.createMarkers(geometries)
          this.markerLayer.on('click', event => {
            const { businessId } = event.geometry.properties
            this.playList = this.getPlayInfo([businessId])
            this.showVideoDialog = true
            this.infoWindow && this.infoWindow.close()
          })
          this.markerLayer.on('hover', event => {
            if (event.geometry) {
              const { properties } = event.geometry
              if (!this.infoWindow) {
                this.infoWindow = this.createInfoWindow()
              }
              this.infoWindow.open()
              this.infoWindow.setPosition(event.geometry.position)
              this.infoWindow.setContent(getCameraDetailTemplate(properties))
            } else {
              this.infoWindow && this.infoWindow.close()
            }
          })
        }
        // 缩放视图
        this.getMap().fitBounds(getBounds(points(lnglatArray)), { padding: 100 })
      },
      createMarkers (geometries) {
        return new TMap.MultiMarker({
          id: "camera-layer", //图层id
          map: this.getMap(),
          geometries,
          styles: {
            camera: new TMap.MarkerStyle({
              "width": 24,
              "height": 35,
              "anchor": { x: 16, y: 32 },
              "src": getImageUrl('camera-icon2')
            })
          }
        })
      },
      createInfoWindow () {
        const infoWindow = new TMap.InfoWindow({
          map: this.getMap(),
          position: new TMap.LatLng(0, 0),
          offset: { x: -4, y: -35 }, //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
          content: ''
        })
        infoWindow.close()
        return infoWindow
      },
      playCamerasHandle () {
        this.infoWindow && this.infoWindow.close()

        const playIds = this.cameraList
          .filter(item => item.checked)
          .map(item => item.businessId)
        this.playList = this.getPlayInfo(playIds)
        if (this.playList.length === 0) {
          this.$message.warning('请选择要播放的摄像头')
          return
        }
        this.showVideoDialog = true
      },
      getPlayInfo (ids = []) {
        const CAMERA_PLAY_URL = process.env.VUE_APP_CAMERA_PLAY_URL
        return ids.map(id => {
          return {
            id,
            url: `${CAMERA_PLAY_URL}/live/cameraid/${id}%240/substream/2.m3u8`
          }
        })
      }
    },
    components: {
      CameraPlayContainer
    }
  }
</script>

<style lang="stylus" scoped>
.camera-list-container
  background-color #fff
  position relative
  z-index 10
  padding-bottom 95px
  .search-input
    box-sizing border-box
    padding 10px 15px 10px 15px
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
  .list-wrap
    height 400px
    overflow auto
    .camera-item
      font-size 12px
      color #606266
      display flex
      padding 10px 18px
      cursor pointer
      user-select none
      &:hover
        background-color #F5F7FA
      .item
        flex 1
        text-align right
    .empty
      margin-top 20px
      text-align center
      color #606266
      font-size 12px
  .bottom
    padding-left 15px
    position absolute
    bottom 15px
    line-height 30px
    background #fff
    z-index 1
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
    .play-btn
      background #d31d01
      border-radius 4px
      color #fff
      line-height 32px
      height 32px
      text-align center
      cursor pointer
</style>

<style lang="stylus">
.camera-list-container
  .camera-item
    .el-checkbox
      &.is-checked
        .el-checkbox__input
          .el-checkbox__inner
            background-color #d31d01
            border-color #d31d01
        .el-checkbox__label
          color #1f2d3d
</style>
