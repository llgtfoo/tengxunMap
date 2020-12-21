import CoordTransform from 'coordtransform'

const WGS84 = 'wgs84'
const GCJ02 = 'gcj02'

/**
 * 坐标转换类，为腾讯地图提供，默认以下转换：
 * 1、wgs84坐标转gcj02
 * 2、lnglat格式转为latlng
 */
export class LngLat2LatLng {

  constructor (options = {}) {
    const {
      sourceCoord = WGS84,
      destinationCoord = GCJ02
    } = options

    // 源数据的坐标系
    this.sourceCoord = sourceCoord
    // 目标数据的坐标系
    this.destinationCoord = destinationCoord
  }

  LngLat (lngLat) {
    let [ lng, lat ] = lngLat
    // WGS84坐标转GCJ02坐标
    if (this.sourceCoord === WGS84 && this.destinationCoord === GCJ02) {
      [lng, lat] = CoordTransform.wgs84togcj02(lng, lat)
    }
    return [lat, lng]
  }

  Point (point) {
    if (!point || point.type !== 'Point') {
      return
    }
    point.coordinates = this.LngLat(point.coordinates)
    return point
  }

  MultiPoint (multiPoint) {
    if (!multiPoint || multiPoint.type !== 'MultiPoint') {
      return
    }
    multiPoint.coordinates =
      multiPoint.coordinates.map( lngLat => this.LngLat(lngLat) )
    return multiPoint
  }

  LineString (lineString) {
    if (!lineString || lineString.type !== 'LineString') {
      return
    }
    lineString.coordinates =
      lineString.coordinates.map( lngLat => this.LngLat(lngLat) )
    return lineString
  }

  MultiLineString () {

  }

  Polygon (polygon) {
    if (!polygon || polygon.type !== 'Polygon') {
      return
    }
    polygon.coordinates =
      polygon.coordinates.map(arr => {
        return arr.map(lngLat => this.LngLat(lngLat))
      })
    return polygon
  }

  MultiPolygon (multiPolygon) {
    if (!multiPolygon || multiPolygon.type !== 'MultiPolygon') {
      return
    }
    multiPolygon.coordinates =
      multiPolygon.coordinates.map(arr1 => {
        return arr1.map(arr2 => {
          return arr2.map(lngLat => this.LngLat(lngLat))
        })
      })
    return multiPolygon
  }

  GeometryCollection () {

  }

  Feature (feature) {
    if (!feature || feature.type !== 'Feature') {
      return
    }
    const { geometry } = feature
    switch (feature.geometry.type) {
      case 'Point':
        feature.geometry = this.Point(geometry)
        break
      case 'LineString':
        feature.geometry = this.LineString(geometry)
        break
      case 'Polygon':
        feature.geometry = this.Polygon(geometry)
        break
      case 'MultiPolygon':
        feature.geometry = this.MultiPolygon(geometry)
        break
      default:
        return new Error('不支持的数据类型，待扩展')
    }
    return feature
  }

  FeatureCollection (featureCollection) {
    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
      return
    }
    featureCollection.features =
      featureCollection.features.map(feature => this.Feature(feature))
    return featureCollection
  }
}
