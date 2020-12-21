
export function getCameraDetailTemplate (camera) {
  // const cameraIcon = `${process.env.BASE_URL}image/camera-icon.png`
  let str = '<div class="camera-detail-infowindow">'
      str += '<div class="name">'
        str += '<span class="name-text">' + camera.name + '</span>'
      str += '</div>'
      //str += '<div class="item">'
        //str += '<span class="name">地址：</span>'
        //str += '<span class="content">' + camera.address + '</span>'
      //str += '</div>'
      //str += '<div onclick="Bus.$emit(\'clickPlayBtn\', \''+ camera.businessId +'\')" class="play-btn">播放</div>'
    str += '</div>'
  return str
}
