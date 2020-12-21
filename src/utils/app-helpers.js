import { UrlUtils } from "./url-utils";

/**
 * 给接口的地址中统一增加appKey参数
 * @param url 地址
 * @param webGateway 自定义key
 * @return {string}
 */
export function addAppKeyToUrl (url, webGateway) {
  if (!url) { return }
  const urlArr = url.split('?')
  const key = webGateway || UrlUtils.getString('appKey')
  if (urlArr.length === 1) {
    return `${url}?appKey=${key}`
  } else {
    return `${urlArr[0]}?appKey=${key}&${urlArr[1]}`
  }
}

/**
 * 根据图片名称获取图片路径
 * @param imageName
 * @return {string}
 */
export function getImageUrl(imageName) {
  const baseUrl = `${process.env.BASE_URL}image/`
  return  `${baseUrl}${imageName}.png`
}
