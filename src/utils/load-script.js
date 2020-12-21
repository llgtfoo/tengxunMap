/**
 * 通过url动态加载script
 * @param url 文件位置
 * @return {Promise<any>}
 */
export const load = (url) => {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script')
    tag.setAttribute('src', url)
    tag.onload = resolve
    tag.onerror = reject
    document.head.appendChild(tag)
  })
}
