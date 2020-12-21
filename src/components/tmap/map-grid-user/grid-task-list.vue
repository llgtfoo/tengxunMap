<template>
  <div class="grid-task-list">
    <div class="tip">
      <p class="back">
        <span @click="goBack"  class="btn"><i class="el-icon-arrow-left"></i>返回</span>
        <span @click="clearPath" class="btn clear">清除轨迹</span>
        <el-switch v-model="correct" @change="changeCorrect" active-text="轨迹纠偏" size="mini"></el-switch>
        <el-checkbox v-model="bindRoad" :disabled="correct">绑路</el-checkbox>
      </p>
    </div>
    <div class="query">
      <div class="date-wrap">
        <el-date-picker
            v-model="query.startTime"
            type="date"
            size="mini"
            style="width: 133px"
            value-format="yyyy-MM-dd"
            placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
            v-model="query.endTime"
            type="date"
            size="mini"
            style="width: 133px;margin-left: 10px"
            value-format="yyyy-MM-dd"
            placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button @click="searchHandle" size="mini" icon="el-icon-search" circle></el-button>
    </div>
    <div v-loading="loading" class="task-list">
      <div class="task-item" v-for="(item, index) in taskList" :key="index"
           :class="{active: currentTask.taskId === item.taskId}">
        <div v-if="currentTask.hasPath" class="play-button">
          <i v-if="playing" @click="stopHandle" class="icon el-icon-video-pause"></i>
          <i v-else @click="startHandle" class="icon el-icon-video-play"></i>
        </div>
        <div class="show-content" @click="clickTaskItem(item)">
          <div class="time-wrap">
            <p class="time">开始：{{item.startTime | formatDate}}</p>
            <p class="time">结束：{{item.endTime | formatDate}}</p>
          </div>
<!--          <span class="distance">{{item.distance ? item.distance : 0 }} m</span>-->
        </div>
      </div>
      <div class="empty" v-if="loading===false && taskList.length === 0">暂无数据</div>
    </div>
    <div class="bottom">
      <el-pagination
          small
          layout="total, prev, next"
          :pager-count=5
          :current-page="query.offset"
          @current-change="currentChangeHandle"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { formatDate } from "../../../utils/date";
  import { lnglat2latlngObj } from "../../../../transform/lnglat2latlngobj";
  import { getTaskList, getTrackDetail, trackMatche } from "../../../api/grid-user";
  import { lineString } from '@turf/helpers'
  import { getImageUrl } from "../../../utils/app-helpers";
  import { getBounds } from "../../../utils/getbounds";

  export default {
    name: "grid-task-list",
    props: ['user'],
    inject: ['getMap'],
    data () {
      return {
        loading: true,
        query: {
          startTime: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), 'yyyy-MM-dd hh:mm:ss'),
          endTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          offset: 1,
          limit: 10
        },
        taskList: [],
        total: 0,
        currentTask: {},
        correct: false, // 是否进行纠偏（switch开关的值）
        bindRoad: false, // 是否绑定路网
        originalPath: [], // 原始路径，没有纠偏
        playing: false // 当前是否正在播放
      }
    },
    created () {
      this.getTaskList()
      this.polylineLayer = null // 路径图层
      this.markerLayer = null   // 网格员marker,开始结束marker
    },
    beforeDestroy () {
      this.clearPath()
    },
    methods: {
      getTaskList () {
        this.loading = true
        const params = Object.assign({ userName: this.user.userName }, this.query)
        getTaskList(params).then(res => {
          const { total = 0, list = [] } = res.data || {}
          this.total = total
          this.taskList = list
          this.clickTaskItem(list[0])
        }).finally(() => {
          this.loading = false
        })
      },
      // 渲染轨迹路径
      renderTrack (item) {
        this.clearPath()
        this.currentTask = item
        this.loading = true
        const { orgCode } = this.$store.state.currentOrg
        getTrackDetail({taskId: item.taskId, orgCode}).then(res => {
          const data = res.data || []
          return data.map(item => {
            const coord = [item.centerLon, item.centerLat]
            return { coord, time: item.originTime }
          })
        }).then(data => {
          if (data.length === 0) {
            this.$message.warning('暂无轨迹数据')
            this.$set(this.currentTask, 'hasPath', false)
            return
          }
          this.$set(this.currentTask, 'hasPath', true)
          this.originalPath = data
          this.renderTrackHandle()
        }).finally(() => {
          this.loading = false
        })
      },
      renderTrackHandle () {
        if (this.marker) this.stopHandle();

        const map = this.getMap()
        this.pathInfo = this.getPathInfo(this.originalPath)
        const { path, bounds } = this.pathInfo
        const startPosition = path[0]
        const endPosition = path[path.length - 1]

        // 根据当前路径缩放视图
        map.fitBounds(bounds, { padding: 100 })

        if (this.polylineLayer) {
          this.polylineLayer.setGeometries([{
            styleId: 'router',
            paths: path
          }])
        } else {
          this.polylineLayer = this.createPolyline(path)
        }

        if (this.markerLayer) {
          this.markerLayer.setGeometries(this.getMarkersGeoms(startPosition, endPosition))
        } else {
          this.markerLayer = this.createMarkers(startPosition, endPosition)
          this.markerLayer.on('move_ended', () => {
            this.playing = false
          })
        }
      },
      createPolyline (path) {
        return new TMap.MultiPolyline({
          map: this.getMap(), // 绘制到目标地图
          // 折线样式定义
          styles: {
            'router': new TMap.PolylineStyle({
              'color': '#3777FF', //线填充色
              'width': 6, //折线宽度
              'borderWidth': 2, //边线宽度
              'borderColor': '#FFF', //边线颜色
              'lineCap': 'round' //线端头方式
            })
          },
          geometries: [{
            styleId: 'router',
            paths: path
          }],
        });
      },
      createMarkers (startPosition, endPosition) {
        return new TMap.MultiMarker({
          map: this.getMap(),
          styles: {
            'leader': new TMap.MarkerStyle({
              'anchor': { x: 15, y: 44},
              'faceTo': 'screen',
              'src': getImageUrl('grid-user-leader'),
            }),
            'member': new TMap.MarkerStyle({
              'anchor': { x: -15, y: 20 },
              'faceTo': 'screen',
              'src': getImageUrl('grid-user-member'),
            }),
            "start": new TMap.MarkerStyle({
              "width": 25,
              "height": 35,
              "anchor": { x: 16, y: 32 },
              "src": getImageUrl('start')
            }),
            "end": new TMap.MarkerStyle({
              "width": 25,
              "height": 35,
              "anchor": { x: 16, y: 32 },
              "src": getImageUrl('end')
            })
          },
          geometries: this.getMarkersGeoms(startPosition, endPosition)
        })
      },
      getMarkersGeoms (startPosition, endPosition ) {
        return [
          {
            "id": 'start',
            "styleId": 'start',
            "position": startPosition
          }, {
            "id": 'end',
            "styleId": 'end',
            "position": endPosition
          }, {
            id: 'user',
            styleId: 'leader',
            position: startPosition,
          }
        ]
      },
      getPathInfo (originalPath) {
        // const path = this.correctCompute(originalPath)
        const path = originalPath
        // 构造path和范围
        const latlngArray = []
        const lnglatArray = []
        path.forEach(item => {
          latlngArray.push(lnglat2latlngObj(item.coord))
          lnglatArray.push(item.coord)
        })
        const bounds = getBounds(lineString(lnglatArray))
        return { path: latlngArray, bounds }
      },
      startHandle () {
        this.playing = true
        const { path } = this.pathInfo
        this.markerLayer.moveAlong({
          'user': {
            path,
            speed: 250
          }
        }, {
          autoRotation:true
        })
      },
      stopHandle () {
        this.playing = false
        this.markerLayer.pauseMove()
      },
      // 纠偏
      correctCompute (originalPath) {
        console.log(originalPath)
        /*
        let array = JSON.parse(JSON.stringify(this.path))
        let path = array.map(item => item.coord)
        // 进行纠偏处理
        // 纠偏有两种方式，1、绑路，2、卡尔曼，默认为卡尔曼，当选择绑路时，采用绑路纠偏
        if (this.correct) {
          // 绑路纠偏
          if (this.bindRoad) {
            if (this.needTransform()) {
              array.forEach(item => {
                item.coord = MapUtils.transForm(item.coord, 'EPSG:3857', 'EPSG:4326')
              })
            }
            const data = array.map(item => {
              return { lon: item.coord[0], lat: item.coord[1], time: item.time }
            })
            this.trackerMatch(data).then(result => {
              this.showTrack(result)
            })
          } else {
            this.showTrack(MapUtils.Kalman(path))
          }
        } else {
          // 不进行纠偏处理
          this.showTrack(path)
        }
        return originalPath
         */
      },
      // 清除轨迹和其他图标
      clearPath () {
        if (this.markerLayer) {
          this.stopHandle()
          this.markerLayer.setGeometries([])
          this.currentTask = {}
        }
        if (this.polylineLayer) {
          this.polylineLayer.setGeometries([])
        }
      },
      goBack () {
        this.clearPath()
        this.$emit('back', true)
      },
      changeCorrect () {
        // this.clearPath()
        // this.renderTrackHandle()
      },
      searchHandle () {
        this.clearPath()
        this.currentTask = {}
        this.originalPath = []
        this.getTaskList()
      },
      clickTaskItem (item) {
        // this.$parent.closeDetailHandle()
        this.renderTrack(item)
      },
      currentChangeHandle (page) {
        this.query.offset = page
        this.getTaskList()
      },
      trackerMatche (data) {
        return trackMatche(data).then(res => {
          let array = res.data.data.paths[0].points.coordinates
          return array
        })
      }
    },
    filters: {
      formatDate (dateStr) {
        if (!dateStr) { return }
        return formatDate(new Date(dateStr), 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .grid-task-list
    background-color #fff
    position absolute
    top 40px
    height 520px
    width 100%
    .tip
      line-height 30px
      padding 0 10px
      background-color #F2F6FC
      .back
        user-select none
        .el-checkbox
          margin-left 45px
        .btn
          color #5a9bf8
          font-size 12px
          cursor pointer
          i
            margin-right 3px
        .clear
          margin-left: 20px
        .el-switch
          position absolute
          top 6px
          right 15px
          .el-switch__label
            font-size 12px
    .query
      padding 15px 15px 0 15px
      display flex
      justify-content space-between
    .task-list
      padding 10px 0
      height 380px
      /*overflow auto*/
      .task-item
        /*padding 10px 20px*/
        font-size 12px
        color #606266
        line-height 40px
        position relative
        &.active
          .play-button
            transform translate(0, 0)
            box-shadow 0 2px 4px rgba(0,0,0,0.12)
          .show-content
            background-color #F5F7FA
        .play-button
          width 70px
          height 65px
          top 0
          position absolute
          left -66px
          background-color #F5F7FA
          border-radius 6px
          transition all .1s
          transform translate(100%, 0)
          cursor pointer
          .icon
            line-height 65px
            font-size 40px
            margin-left 15px
            &::before
              color #5A9BF8
        .show-content
          box-sizing border-box
          position relative
          display flex
          justify-content space-between
          cursor pointer
          border-bottom 1px solid #F5F7FA
          background-color #fff
          padding 10px 18px
          &:hover
            background-color #F5F7FA
          .time-wrap
            display inline-block
            vertical-align middle
            .time
              line-height 22px
      .empty
        margin-top 20px
        text-align center
        color #606266
        font-size 12px
    .bottom
      padding 0 15px
      position absolute
      bottom 8px
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
