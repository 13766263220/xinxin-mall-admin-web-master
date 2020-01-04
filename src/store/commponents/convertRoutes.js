import { lazy } from './lazyLoading'
/**
 * 拼接动态路由
 */
export default (routerList,sysMenuList) => {
  toRoutes(routerList, sysMenuList)
}
// routerList 显示路由 ，sysMenuList 数据库路由
function toRoutes (routerList,sysMenuList) {
	// alert(sysMenuList)
  if (sysMenuList) {
    for (var i = 0; i < sysMenuList.length; i++) {
      // 每个url
      var sysMenuNode = sysMenuList[i]
      if (sysMenuNode.route !== '#') {
        // 获取路由的url地址
        var code = sysMenuNode.route
        var routeNode = {
          name: code,
          path: '/' + code,
          component: lazy(code),
          meta: { title: sysMenuNode.name}
          // children: []
        }
        routerList.push(routeNode)
      } 
    }
  }
}
