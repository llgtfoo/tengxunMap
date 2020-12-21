import CoordTransform from 'coordtransform'

// 将标准的经纬度坐标转换为腾讯的LatLng对象
export const lnglat2latlngObj = (lnglat) => {
  const [ lng, lat ] = CoordTransform.wgs84togcj02(...lnglat)
  return new TMap.LatLng(lat, lng)
}
