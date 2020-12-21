const list = [
  {
    id: 1,
    name: '测试1',
    url: 'http://103.20.114.97:8866/01053964463/40255853735699702944105185474177/40255853735699702944105185474177.m3u8'
  },
  {
    id: 2,
    name: '测试2',
    url: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8'
  },
  {
    id: 3,
    name: '测试3',
    url: 'http://a_ivi.bupt.edu.cn/hls/cctv3hd.m3u8'
  },
  {
    id: 4,
    name: '测试4',
    url: 'http://103.20.114.97:8866/01053964462/75433544876946513256703319883923/75433544876946513256703319883923.m3u8'
  },
  {
    id: 5,
    name: '测试5',
    url: 'http://103.20.114.97:8866/01053964462/75433544876946513256703319883923/75433544876946513256703319883923.m3u8'
  }
]

/**
 * 用来mock摄像头在线播放数据
 * @param number [1, 5]
 * @return {*[]}
 */
export function getMockCameraList (number) {
  return list.slice(0, number - 1)
}
