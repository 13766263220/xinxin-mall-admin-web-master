
/**
 * 动态添加菜单
 * author:qlx
 */
const addMenus = {
  state: {
    menuList: []
  },
  getters: {
    getMenuList: state => {
      return state.menuList
    }
  },
  mutations: {
    add_Menus (state, param) {
      if (param) {
        var menuList = []
        // menuList.push({
        //   icon: 'el-icon-tickets',
        //   path: '#1',
        //   title: '系统首页',
        //   subs: [{
        //     icon: 'el-icon-tickets',
        //     path: 'index',
        //     title: '首页',
        //     subs: []
        //   }]
        // })
		
		
        _addMenu(menuList, param)
        state.menuList = menuList
      }
      function _addMenu (menuList, params) {
        for (var i = 0; i < params.length; i++) {
			var menuParam = params[i]
          var menu = {
            icon: 'el-icon-tickets',
            path: menuParam.route,
            title: menuParam.name,
            subs: []
          }
			
          // 只涉及二级菜单
          if (menuParam.child && menuParam.child.length > 0) {
            _addMenu(menu.subs, menuParam.child)
          }
          menuList.push(menu)
        }

        //console.log('树形菜单结构：' + JSON.stringify(menuList))
      }
    }
  },
  actions: {
    add_Menus ({ commit }, param) {
      commit('add_Menus', param)
    }
  }
}
export default addMenus
