
export class MyDOMOverlay extends TMap.DOMOverlay{

  mydom;

  constructor (options) {
    super(options)
  }

  // 初始化
  onInit (options) {
    const { position, content, className } = options;
    this.position = position;
    this.content = content;
    this.className = className;
  }

  // 创建DOM元素，返回一个DOMElement
  createDOM () {
    this.mydom = document.createElement("div");
    //设置DOM样式
    this.mydom.className = this.className;
    this.mydom.innerHTML = this.content;
    return this.mydom;
  }

  // 更新DOM元素，在地图移动/缩放后执行
  updateDOM () {
    if (!this.map) {
      return;
    }
    // 经纬度坐标转容器像素坐标
    let pixel = this.map.projectToContainer(this.position);

    //默认使用DOM左上角作为坐标焦点进行绘制（左上对齐）
    //如想以DOM中心点（横向&垂直居中）或其它位置为焦点，可结合this.dom.clientWidth和this.dom.clientHeight自行计算
    let left = pixel.getX() - this.dom.clientWidth / 2 + 'px'; //本例水平居中
    let top = pixel.getY() + 'px';

    //将平面坐标转为三维空间坐标
    this.dom.style.transform = `translate3d(${left}, ${top}, 0px)`;
  }

  //自定义一个更新内容的方法
  updateContent (content) {
    this.mydom.innerHTML = content;
  }

}
