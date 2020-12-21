<template>
  <div class="map-org-choose">
    <org-choose :org-code="orgCode" @choose="chooseHandle"></org-choose>
  </div>
</template>

<script>
  import OrgChoose from '../../base/org-choose'
  import { getBorder } from "../../../api/org"
  import { OK } from "../../../api/code";
  import { getBounds } from "../../../utils/getbounds";
  import {lnglat2latlngObj} from "../../../../transform/lnglat2latlngobj";
  import { MyDOMOverlay } from "../../../common/tmap/MyDOMOverlay";
  import { UrlUtils } from "../../../utils/url-utils";

  export default {
    name: "map-org-choose",
    inject: ['getMap'],
    data () {
      return {
        orgCode: UrlUtils.getString('orgCode')
      }
    },
    created () {
      this.polygon = null
      this.orgLabelList = []
    },
    computed: {
      currentView () {
        return this.$store.state.currentView
      }
    },
    watch: {
      currentView () {
        this.getOrgBorder(this.$store.state.currentOrg).then(border => {
          this.renderOrgBorder(border.current, border.children)
        })
      }
    },
    methods: {
      chooseHandle (org) {
        this.$store.commit('setCurrentOrg', org)
        this.getOrgBorder(org).then(border => {
          console.log(org,border,'org111')
          this.renderOrgBorder(border.current, border.children)
        })
      },
      // 获取组织机构边界
      getOrgBorder (org) {
        return getBorder(org.orgCode).then(res => {
          let list = []
          if (res.code === OK) {
            list = res.data
          }
          const border = { current: null, children: [] }
          if (list.length > 0) {
            border.current = list[0]
          }
          if (list.length > 1) {
            border.children = list.slice(1)
          }
          return border
        })
      },
      renderOrgBorder (current, children) {
        const map = this.getMap()
        console.log(current, children,'-----')
        // fit
        map.fitBounds(getBounds(current), { padding: 100 })

        let featureCollectionArray = [current]
        if (this.currentView === 'children') {
          featureCollectionArray = children
        }
        console.log(featureCollectionArray,'featureCollectionArray')
        // 当前组织机构的所有直接下级区域多边形
        const geometries = featureCollectionArray.map(featureCollection => {
          const paths = this.getPath(featureCollection)
          console.log(paths,'paths')
          const { properties } = featureCollection.features[0]
          return {
            id: 'polygon', //多边形图形数据的标志信息
            styleId: 'polygon', //样式id
            paths, //多边形的位置信息
            properties
          }
        })

        const options = {
          id: 'current-org-layer', //图层id
          map, //显示多边形图层的底图
          geometries,
          styles: {
            'polygon': new TMap.PolygonStyle({
              'color': 'rgba(254,179,74,0.08)', //面填充色
              'showBorder':true, //是否显示拔起面的边线
              'borderWidth': 2,
              'borderColor': '#FEB24A', //边线颜色
              'borderDashArray': [10, 10]
            })
          }
        }

        if (this.polygon) {
          this.polygon.setGeometries(geometries)
        } else {
          this.polygon = new TMap.MultiPolygon(options)
          this.polygon.on('click', event => {
            this.clickOrgHandle(event)
          })
        }

        // 销毁上一次创建的label
        this.orgLabelList.forEach(label => {
          label.destroy()
        })
        // 地图上添加组织机构名称的label
        this.orgLabelList = this.createOrgLables(featureCollectionArray)
      },
      // 创建组织机构名称label
      createOrgLables (featureCollectionList) {
        const map = this.getMap()
        return featureCollectionList.map(featureCollection => {
          const { properties } = featureCollection.features[0]
          const { center, name } = properties
          return new MyDOMOverlay({
            map,
            content: name,
            className: 'org-label',
            position: lnglat2latlngObj([center.lng, center.lat])
          })
        })
      },
      getPath (featureCollection) {
        const { geometry } = featureCollection.features[0]
        if (geometry.type === 'MultiPolygon') {
          return geometry.coordinates.map(arr1 => {
            return arr1.map(arr2 => {
              return arr2.map(arr3 => lnglat2latlngObj(arr3))
            })
          })
        }
        if (geometry.type === 'Polygon') {
          return geometry.coordinates.map(arr1 => {
            return arr1.map(arr2 => lnglat2latlngObj(arr2))
          })
        }
        return null
      },
      clickOrgHandle (event) {
        const { adcode } = event.geometry.properties

        // 从组织机构接口的数据中获取更详细的组织机构信息返回给业务层
        let orgInfo
        const currentOrg = this.$store.state.currentOrg
        if (this.currentView === 'current') {
          orgInfo = Object.assign({}, currentOrg)
          delete orgInfo.children
        } else {
          const org = currentOrg.children.find(org => org.orgCode === adcode)
          orgInfo = Object.assign({}, org)
        }

        const obj = { type: 'clickOrg', target: orgInfo }
        console.log('postMessage派发事件', obj)
        window.parent.postMessage(obj, '*')
      }
    },
    components: {
      OrgChoose
    }
  }
</script>

<style lang="stylus" scoped>
.map-org-choose
  position absolute
  left 400px
  top 24px
</style>
