import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/components/login.vue'),
      meta: { title: '登录页' }
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/components/homepage/404.vue'),
      meta: { title: '路由不存在' }
    },
    {
      name: '403',
      path: '/403',
      component: () => import('@/components/homepage/403.vue'),
      meta: { title: '资源不可访问' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  mode: 'history'//url地址不显示#号
})
/**
 * 全局路由守卫（相当于一个路由拦截器）
 */
const rightPathList = ['/login', '/404', '/403'];//直接可以进入的页面
router.beforeEach((to, from, next) => {//to表示当前路由对象
  // debugger
  console.log('跳转到:', to.fullPath);
  var token = sessionStorage.getItem('token');
	
  if (!token && to.path != '/login') {//登陆认证校验,没登录则跳转/login
    next({ path: '/login' })
  }
  else {//权限认证
	next();
    // if (rightPathList.includes(to.path)) {//判断访问地址是否被rightPathList是否被包含 (可以直接访问的页面)
    //   next();
    // }
    // else {
    //   next('403');
    // }
  }
})
/**
 * 请求拦截器,添加请求头token
 */
axios.interceptors.request.use(
  config => {
		//config.url="http://localhost:8080"+ config.url;//设置全局的请求地址
		console.log('>>>请求url:',config.url);
    var headers = config.headers;
    if (sessionStorage.getItem("token")) {
      headers.token = sessionStorage.getItem("token");
    }
    return config;
  },
  error => {
    console.log('>>>请求异常:',error.message);
    return Promise.reject(error);
  });
//接口请求超时设置
axios.defaults.timeout=5000;//毫秒
/**
 * 响应拦截器,添加请求头token
 */
axios.interceptors.response.use(function (response) {
  // Do something with response data
  console.log('<<<请求成功');
  return response;
}, error=> {
  // Do something with response error
  console.log('<<<异常信息:',error.message);
  return Promise.reject(error);
});


export default router //导出
