/*
 * @Descripttion: ''
 * @Author: lilong(lilong@hztianque.com)
 * @Date: 2020-12-21 11:23:03
 * @LastEditTime: 2020-12-21 15:22:07
 */
import bbox from '@turf/bbox'
import { lnglat2latlngObj } from "../../transform/lnglat2latlngobj"

/**
 * 获取一个FeatureCollection的范围，用于缩放视图
 * @param featureCollection
 * @return {TMap.LatLngBounds}
 */
export function getBounds(featureCollection) {
  const [minX, minY, maxX, maxY] = bbox(featureCollection)
  const sw = lnglat2latlngObj([Math.min(minX, maxX), Math.min(minY, maxY)])
  const ne = lnglat2latlngObj([Math.max(minX, maxX), Math.max(minY, maxY)])
  return new TMap.LatLngBounds(sw, ne)
}
