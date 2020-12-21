import axios from './axios'

// 获取网格员列表
export function getUserList(data = {}, cancelToken) {
  const {limit, offset, userName, userLabel, isLine, orgCode} = data
  const params = { limit, offset, userName, userLabel, isLine, orgCode, includeLower: true}
  return axios.get(`/gis/users/list`, { params, cancelToken })
}

// 获取某个网格员的任务列表
export function getTaskList(options = {}) {
  const { userName, startTime, endTime, orgCode, limit, offset } = options
  const params = { userName, startTime, endTime, orgCode, limit, offset }
  return axios.get(`/gis/tasks/mockList`, { params })
  // return axios.get('http://yapi.daliandong.cn/mock/140/web/appcloud/api/gis/tasks/list', { params })
}

// 获取轨迹数据
export function getTrackDetail(options = {}) {
  const { taskId, orgCode } = options
  const params = { taskId, orgCode }
  return axios.get(`/gis/tracker/getMockByTaskId`, { params })
  // return axios.get('http://yapi.daliandong.cn/mock/140/web/appcloud/api/gis/tracker/getByTaskId', { params })
}

export function trackMatche(data) {
  return axios.post(`/gis_data/commonservice/trackerMatch?points_encoded=false`, data)
}
