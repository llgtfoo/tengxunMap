import axios from './axios'

/**
 * 根据地图id获取地图配置
 * @param id
 * @return {*}
 */
export function getMapConfig(id) {
  return axios.get(`/gis_data/poimap/get?id=${id}`)
}
