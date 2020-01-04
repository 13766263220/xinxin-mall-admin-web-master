import addRoutes from './commponents/addRouters'
import addMenus from './commponents/addMenus'
import addPermission from './commponents/addPermission'
export default {
  menu: addMenus, //添加菜单
  route: addRoutes, //添加路由
  permission: addPermission //添加权限
}