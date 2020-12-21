import Vue from 'vue'

Vue.directive('drag', {
  inserted: function (el, binding) {
    const { value } = binding
    let dragTarget = el.querySelector(value) || el // 如果指令的子节点设置了id为dragTarget，则会转移目标dom
    dragTarget.onmousedown = function (ev) {
      let disX = ev.clientX - el.offsetLeft
      let disY = ev.clientY - el.offsetTop
      document.onmousemove = function (ev) {
        let l = ev.clientX - disX
        let t = ev.clientY - disY
        el.style.left = l + 'px'
        el.style.top = t + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
