import axios from './axios'

/**
 * 获取地图的专题树
 * @param mapId 地图id
 * @returns {AxiosPromise<any>}
 */
export function getSubject(mapId) {
  return axios.get(`/gis_data/poi_special_subject/getTree?mapId=${mapId}`)
}
