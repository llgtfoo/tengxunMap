import Vue from 'vue'
import Vuex from 'vuex'
import { OK } from "../api/code";
import { getSubject } from "../api/subject";

Vue.use(Vuex)

const localKey = 'viewType'
const getView = () => {
  return localStorage.getItem(localKey) || 'children'
}

export default new Vuex.Store({
  state: {
    subjects: null, // 专题树
    flatSubjectsObj: null, // 对专题树做扁平化处理，处理为一个对象，key为${tableId}_${typeCode}，value为专题对象
    currentSubject: null, // 当前选择的专题
    currentOrg: null, // 当前org
    currentView: getView() // 当前视图类型
  },
  getters: {
    getPoiIcon: (state) => (obj) => {
      const { tableId, typeCode } = obj
      const key = `${tableId}_${typeCode}`
      return state.flatSubjectsObj[key].poiImageUrl   // poiImageUrl   imageUrl
    }
  },
  mutations: {
    setSubject (state, subjects) {
      const subjectObj = {}
      subjects.forEach(category => {
        if (category.children) {
          category.children.forEach(subject => {
            const { tableId, typeCode } = subject
            const key = `${tableId}_${typeCode}`
            subjectObj[key] = subject
          })
        }
      })

      state.flatSubjectsObj = subjectObj

      state.subjects = subjects
    },
    setCurrentOrg (state, org) {
      state.currentOrg = org
    },
    setCurrentSubject (state, subject) {
      state.currentSubject = subject
    },
    setCurrentView (state, view) {
      state.currentView = view
      localStorage.setItem(localKey, view)
    }
  },
  actions: {
    // 获取专题数据
    getSubject ({ commit }, mapId) {
      return getSubject(mapId).then(res => {
        const subjects = res.code === OK ? res.data : [];
        commit('setSubject', subjects)
        return subjects
      })
    }
  },
  modules: {
  }
})
