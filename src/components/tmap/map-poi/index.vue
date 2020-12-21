<template>
  <div class="map-poi" v-loading="loading">
    <div class="poi-item" v-for="poi in list"
         :key="poi.id"
         @click="clickPoiItem(poi)">
      <img class="icon" :src="poi.icon" width="24" height="35">
      <div class="info">
        <p class="poi-name">{{poi.name}}</p>
        <p class="poi-address">{{poi.address}}</p>
      </div>
    </div>
    <div v-if="!loading && list.length === 0" class="empty">
      暂无数据
    </div>
    <div class="bottom">
      <el-pagination
          v-if="list.length >= 10"
          id="pagination"
          small
          layout="total, prev, next, sizes"
          :pager-count=5
          :page-size="query.limit"
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
  import { getPoiList, getPoiDetail } from "../../../api/poi";
  import {lnglat2latlngObj} from "../../../../transform/lnglat2latlngobj";
  import { getBounds } from "../../../utils/getbounds";
  import { points } from '@turf/helpers'
  import {getPoiDetailTemplate} from "../../../common/tmap/poi-detail-template";
  import { Bus } from "../../../common/js/bus";
  import {OK} from "../../../api/code";

  export default {
    name: "map-poi",
    inject: ['getMap'],
    props: {
      subjects: {
        default () { return [] }
      },
      keyword: {
        default () { return '' }
      }
    },
    data () {
      return {
        loading: true,
        query: {
          limit: 20,
          offset: 1
        },
        list: [],
        total: 0
      }
    },
    computed: {
      currentOrg () {
        return this.$store.state.currentOrg
      },
      currentSubject() {
        return this.$store.state.currentSubject
      }
    },
    created () {
      Bus.$on('clickPoiDetailBtn', this.clickPoiDetailListener = (str) => {
        this.clickPoiDetailHandle(str)
      })
      this.markerLayer = null // poi图标图层
      this.infoWindow = null
      this._getPoiList()
    },
    beforeDestroy () {
      Bus.$off('clickPoiDetailBtn', this.clickPoiDetailListener)
      if (this.markerLayer) {
        this.markerLayer.setMap(null)
        this.markerLayer = null
      }
      this.infoWindow && this.infoWindow.destroy()
    },
    watch: {
      currentOrg () {
        this._getPoiList()
      }
    },
    methods: {
      _getPoiList () {
        this.infoWindow && this.infoWindow.close()

        this.loading = true
        const subjects = this.getSubjects()
        const { orgCode } = this.currentOrg
        const params = Object.assign({ orgCode, keyword: this.keyword }, this.query)
        getPoiList(subjects, params).then(res => {
          this.total = res.data.total
          const list = res.data.rows || []
          const getPoiIcon = this.$store.getters.getPoiIcon
          list.forEach(item => {
            item.icon = getPoiIcon(item)
          })
          this.list = list
          this.renderMarkers(this.list)
        }).finally(() => {
          this.loading = false
        })
      },
      getSubjects () {
        const getSubject = (subject) => {
          const { tableId, typeCode, dicts } = subject
          return { tableId, typeCode, dicts }
        }
        if (this.subjects.length > 0) {
          return this.subjects.map(getSubject)
        } else {
          const subjectObj = this.$store.state.flatSubjectsObj
          return Object.keys(subjectObj).map(key => {
            return getSubject(subjectObj[key])
          })
        }
      },
      renderMarkers (list) {
        if (list.length === 0) return

        const lnglatArray = []

        const geometries = list.map(poi => {
          const { tableId, typeCode } = poi
          const lnglat = poi.location.split(',')

          lnglatArray.push(lnglat)

          return {
            id: 'poi',
            styleId: `${tableId}_${typeCode}`,
            position: lnglat2latlngObj(lnglat),
            properties: poi
          }
        })

        if (this.markerLayer) {
          this.markerLayer.setGeometries(geometries)
        } else {
          this.markerLayer = this.createMarkers(geometries)
          this.markerLayer.on('click', event => {
            this.openInfoWindow(event.geometry.properties)
          })
        }

        this.getMap().fitBounds(getBounds(points(lnglatArray)), {padding: 100})
      },
      createMarkers (geometries) {
        return new TMap.MultiMarker({
          id: "poi-layer", //图层id
          map: this.getMap(),
          geometries,
          styles: this.getStyles()
        })
      },
      getStyles () {
        const flatSubjectsObj = this.$store.state.flatSubjectsObj || {}
        const styleObj = {}
        Object.keys(flatSubjectsObj).forEach(key => {
          styleObj[key] = new TMap.MarkerStyle({
            "width": 24,
            "height": 35,
            "anchor": { x: 16, y: 32 },
            "src": flatSubjectsObj[key].poiImageUrl
          })
        })
        return styleObj
      },
      createInfoWindow () {
        const infoWindow = new TMap.InfoWindow({
          map: this.getMap(),
          position: new TMap.LatLng(0, 0),
          offset: { x: -5, y: -35 }, //设置信息窗相对position偏移像素，为了使其显示在Marker的上方
          content: ''
        })
        infoWindow.close()
        return infoWindow
      },
      handleSizeChange (size) {
        this.query.limit = size
        this._getPoiList()
      },
      currentChangeHandle (page) {
        this.query.offset = page
        this._getPoiList()
      },
      clickPoiItem (poi) {
        this.getMap().panTo(lnglat2latlngObj(poi.location.split(',')))
        this.openInfoWindow(poi)
      },
      openInfoWindow (poi) {
        if (!this.infoWindow) {
          this.infoWindow = this.createInfoWindow()
        }
        this.infoWindow.open()
        this.infoWindow.setPosition(lnglat2latlngObj(poi.location.split(',')))
        this.infoWindow.setContent(getPoiDetailTemplate(poi))
      },
      clickPoiDetailHandle (str) {
        const array = str.split('_')
        const tableId = array[0]
        const id = array[2]
        getPoiDetail(tableId, id).then(res => {
          if (res.code === OK) {
            const poi = Object.assign({ tableId }, res.data)
            const obj = { type: 'clickPoi', target: poi }
            console.info('postMessage派发事件', obj)
            window.parent.postMessage(obj, '*')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .map-poi
    margin-top 10px
    .poi-item
      display flex
      border-top 1px solid #ececec
      padding 15px 0
      cursor pointer
      &:hover
        background-color #fafafa
      .icon
        flex 0 0 24px
        width 24px
      .info
        flex 1
        margin-left 10px
        .poi-name
          font-size 14px
        .poi-address
          color #666
          font-size 12px
    .empty
      margin-top 20px
      text-align center
      color #606266
      font-size 12px
</style>

<style lang="stylus">
  .bottom
    margin-top 5px
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
