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
      path: '/home',
      component: () => import('@/components/homepage/homepage.vue'),
      meta: {
        title: '母版页'
      },
      children: [
        {
          path: '/index',
          name: '系统首页',
          component: () => import('@/components/test/HelloWorld'),
          meta: {
            title: '系统首页',
            hideclose: true,
            role: ['管理员', '超级管理员']
          }
        },
        {
          path: '/productList',
          name: 'productList',
          component: () => import('@/components/views/product/productList'),
          meta: {
            title: '商品列表',
            role: ['管理员', '超级管理员']
          }
        },
		{
		  path: '/productAdd',
		  name: 'productAdd',
		  component: () => import('@/components/views/product/productAdd'),
		  meta: {
		    title: '添加商品',
		    role: ['超级管理员']
		  }
		},
		{
		  path: '/brand',
		  name: 'brand',
		  component: () => import('@/components/views/product/productbrand'),
		  meta: {
			title: '品牌管理',
			role: ['超级管理员']
		  }
		},
		{
		  path: '/category',
		  name: 'category',
		  component: () => import('@/components/views/product/productCategory'),
		  meta: {
			title: '商品分类',
			role: ['超级管理员']
		  }
		}
      ]
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
    if (rightPathList.includes(to.path)) {//判断访问地址是否被rightPathList是否被包含 (可以直接访问的页面)
      next();
    }
    else if (hasPermit(to)) {//判断是否有权限访问
      next();
    }
    else {
      next('403');
    }

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


//获取当前路由是否有权限访问
function hasPermit(to) {
	
  var hasPermit = false;
  if (to.meta && to.meta.role) {//判断该路由上是否写了角色
    var ruleList = getRuleList();//获得登录用户的所有角色
    hasPermit = ruleList.some(rule => {//这里相当与一个循环，当有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测，rule就表示满足条件的角色
      return to.meta.role.includes(rule);//判断ruleList是否有当前路由（是否满足条件）
    });
// 		hasPermit = ruleList.some(function(rule) {
// 			alert(rule)
// 			return to.meta.role.includes(rule);//判断ruleList是否有当前路由
// 		});
  }
  return hasPermit;//返回回去判断的结果

}
//获取登陆的角色集合
function getRuleList() {
  var ruleList = []; //角色数组
  var strRule = sessionStorage.getItem("position");//获取当前角色
  if (strRule.indexOf("|") != -1) {//判断当前角色是否有‘|’符号
    ruleList = strRule.split("|");//那就按照‘|’把他拆分
  } else {
    ruleList.push(strRule);//添加当前角色
  }
  return ruleList;
}

export default router //导出
