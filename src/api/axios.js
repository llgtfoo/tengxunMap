import axios from 'axios'
import { addAppKeyToUrl } from "../utils/app-helpers";
// import { Message } from 'element-ui'

const { VUE_APP_GIS_URL } = process.env

axios.defaults.baseURL = `${VUE_APP_GIS_URL}/web/appcloud/api`

// cors下允许携带cookie
axios.defaults.withCredentials = true

// http request拦截器
axios.interceptors.request.use(
  config => {
    config.url = addAppKeyToUrl(config.url)
    return config
  },
  err => {
    // Message.error('网络异常')
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
