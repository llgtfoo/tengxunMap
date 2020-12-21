export const getUserDetailTemplate = (user) => {
  const isLeader = user.userType === 'leader'
  const status = user.isLine === true ? '在线' : '离线'
  const leaderRedIcon = `${process.env.BASE_URL}image/leader-red-icon.png`
  const cameraIcon = `${process.env.BASE_URL}image/camera-icon.png`

  let str = '<div class="grid-user-detail-infowindow">'
        str += '<div class="user-name">'
          str += '<span class="leader-name">' + user.userLabel + '</span>'
        if (isLeader) {
          str += '<img class="leader-tip-icon" width="14" height="14" src="' + leaderRedIcon +'" />'
          str += '<span class="leader-tip">网格长</span>'
        }
        str += '</div>'
        str += '<div class="item">'
          str += '<span class="name">状态：</span>'
          str += '<span class="content">' + status + '</span>'
        str += '</div>'
        str += '<div onclick="Bus.$emit(\'clickGridUserDetailBtn\', \''+ user.id +'\')" class="griduser-detail-btn">详情</div>'
        str += '<div onclick="Bus.$emit(\'clickTrackBtn\', \''+ user.userName +'\')" class="track-btn">轨迹 >></div>'
        str += '<img onclick="Bus.$emit(\'clickCameraBtn\', \''+ user.userPhone +'\')"  width="25" height="25" src="' + cameraIcon + '"class="camera-btn" />'
      str += '</div>'
  return str
}
