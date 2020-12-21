import axios from './axios'

/**
 * 查询poi列表
 * @param subjects 查询专题，数组[{tableId, typeCode, dicts}]
 * @param options 其他查询条件
 * @return {*}
 */
export function getPoiList (subjects = [], options = {}) {
  const { orgCode, keyword, distance, point, points, limit, offset } = options
  const data = { subjects, orgCode, keyword, distance, point, points, limit, offset }
  return axios.post(`/gis_data/poi/es/search`, data)
}

/**
 * 获取poi详情
 * @param tableId
 * @param poiId
 * @param appId
 * @returns {AxiosPromise<any>}
 */
export function getPoiDetail (tableId, poiId, appId) {
  let url = `/gis_data/poi/${tableId}/${poiId}`
  if (appId) {
    url += `?grandAppId=${appId}`
  }
  return axios.get(url)
}

/**
 * 复合统计接口获取POI统计数据
 * @param params
 * @returns {*}
 */
export function getStatData (params, options) {
  return axios.post(`/gis_data/poistat/mixStat`, params, options)
}
