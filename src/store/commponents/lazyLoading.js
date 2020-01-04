/**
 *
 * 懒加载动态路由
 */
function lazy (path) {
  // return  resolve => require(["@/components/" + name + ".vue"], resolve)
  return getComponetByPath('/' + path)
}
function getComponetByPath (path) {
  for (var i = 0; i < dynamicRouter.length; i++) {
    var route = dynamicRouter[i]
    if (route.path === path) { //判断地址是否与
      return route.component
    }
  }
}
/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
	{
	  path: '/index',  //系统首页
	  component: resolve => require(['@/components/test/HelloWorld'], resolve)
	},
  {
    path: '/productList',  //商品列表
    component: resolve => require(['@/components/views/product/productList'], resolve)
  },
  {
    path: '/productAdd',  //添加商品
    component: resolve => require(['@/components/views/product/productAdd'], resolve)
  },
  {
    path: '/brand',  //品牌管理
    component: resolve => require(['@/components/views/product/productbrand'], resolve)
  },
  {
    path: '/category',  //商品类型
    component: resolve => require(['@/components/views/product/productCategory'], resolve)
  },
  {
    path: '/orderFormList',  //订单列表
    component: resolve => require(['@/components/views/orderForm/orderFormList'], resolve)
  },
  {
    path: '/orderFormSetting',  //订单设置
    component: resolve => require(['@/components/views/orderForm/orderFormSetting'], resolve)
  },
  {
    path: '/salesReturnRequest',  //退货申请处理
    component: resolve => require(['@/components/views/orderForm/salesReturnRequest'], resolve)
  },
	{
	  path: '/userInfoList',  //退货申请处理
	  component: resolve => require(['@/components/views/user/userInfoList'], resolve)
	}
]
export { lazy }
