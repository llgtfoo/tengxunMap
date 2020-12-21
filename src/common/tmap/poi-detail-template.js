export function getPoiDetailTemplate (poi) {

  const poiId = `${poi.tableId}_${poi.typeCode}_${poi.id}`

  let str = '<div class="poi-detail-infowindow">'
      str += '<div class="poi-name">'
        str += '<span class="name-text">' + poi.name + '</span>'
        str += '<span onclick="Bus.$emit(\'clickPoiDetailBtn\', \''+ poiId +'\')" class="detail-btn">详情 >></span>'
      str += '</div>'
      /*
      str += '<div class="item">'
        str += '<span class="name">状态：</span>'
        str += '<span class="content">' + status + '</span>'
      str += '</div>'
       */
      // str += '<div onclick="Bus.$emit(\'clickPoiBtn\', \''+ poiId +'\')" class="detail-btn">详情 >></div>'
      str += '</div>'
  return str
}
