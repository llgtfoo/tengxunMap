
export class UrlUtils {

  /**
   * 从url中根据key获取其对用的值
   * @param key
   * @return {string|null} 该key所对应的值
   */
  static getString (key) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }

}
