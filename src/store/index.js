import modules from './modules'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
  modules: modules,
  plugins: [vuexLocal.plugin]
})
// 刷新加载的方法
const refresh = function () {
  // 页面刷新重新加载路由
  store.dispatch('add_Routes_Fresh')
}
console.log('页面刷新,刷入路由')
refresh()
export default store //导出路由