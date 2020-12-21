import axios from './axios'

/**
 * 根据orgCode获取组织机构详情和直接子区域
 * @param orgCode
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getOrgDetail (orgCode) {
  return axios.get(`/gis_data//usercenterOrg/get?orgCode=${orgCode}&orgType=110`)
}

/**
 * 根据地区编码获得地图边界数组
 * @param name
 * @returns {AxiosPromise<Array>}
 */
export function getBorder (orgcode) {
  return axios.get(`/gis_data/sysGis2DLayer/listBusinessGeoJson?orgcode=${orgcode}`)
}
