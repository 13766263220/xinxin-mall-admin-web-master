
import ConvertRoutes from './convertRoutes'
import router from '../../router' //导入路由
/**
 * 动态添加路由
 * author:qlx
 */
const addRoutes = {
  state: {
    rootRoute: [],
    routeParams: []// 这里必须持久化参数,重新生成路由,因为里边的require方法没法持久化 (保存路由,可以让刷新时不消失数据)
  },
  mutations: {
    add_Routes (state, routeParam) { //添加
      let routeList = [] //创建路由数组
	  
      // routeList.push({ //往数组里添加首页路由
      //   name: 'index',
      //   path: '/index',
      //   component: resolve => require(['@/components/test/HelloWorld'], resolve),
      //   meta: {
      //     title: '系统首页'
      //   }
      // })
	  
      ConvertRoutes(routeList, routeParam) // 将后台的路由数据components转化成组件
		
      var rootRoute = [{
        path: '/home',
        component: resolve => require(['@/components/homepage/homepage.vue'], resolve),
        meta: { title: '母版页' },
        children: routeList
      }]
      state.routeParams = routeParam
      state.rootRoute = rootRoute
      // location.reload()
      // 动态添加路由
      router.addRoutes(rootRoute)

      //console.log('输出路由:', JSON.stringify(rootRoute))
    },
    add_Routes_Fresh (state) { //刷新页面时调用
      this.commit('add_Routes', state.routeParams)
    }
  },
  actions: {
    add_Routes ({ commit }, routeParam) {
      commit('add_Routes', routeParam)
    },
    add_Routes_Fresh ({ commit }) {
      commit('add_Routes_Fresh')
    }
  }
}
export default addRoutes
