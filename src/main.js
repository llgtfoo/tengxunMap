import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styl/base.styl'
import './plugins/element.js'
import './directive/index'

import { Bus } from './common/js/bus'
import SvgIcon from './components/base/svg-icon'

window.Bus = Bus

Vue.component(SvgIcon.name, SvgIcon)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./common/svg', false, /\.svg$/)
requireAll(req)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


