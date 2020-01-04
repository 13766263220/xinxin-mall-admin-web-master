<template>
  <!-- 没用el-aside因为自带300宽度 -->
  <div class="_aside">
    <el-menu :default-active="this.$route.path.replace('/', '')"
             :collapse="navShow"
             class="el-menu-vertical-demo menu"
             background-color="#304156"
             text-color="rgb(191,203,217)"
             active-text-color="rgb(64,158,255)"
             unique-opened
             router>
      <template v-for="(item,i) in menuList">
        <template v-if="item.subs && item.subs.length">
			
          <el-submenu :index="item.path"
                      :key="i">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs"
                          :key="i"
                          :index="subItem.path">
				<i :class="item.icon"></i><span>{{ subItem.title }}</span> 
            </el-menu-item>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<style lang="scss">
._aside {
  .menu {
    height: 100%;
  }
  .menu:not(.el-menu--collapse) {
    //设置才可以有折叠特效
    width: 200px;
  }
}
</style>

<script>

import { mapGetters } from 'vuex'
import bus from '../common/bus'
export default {
  data () {
    return {
      navShow: false // 导航是否折叠
    }
  },
  created () {
    bus.$on('navShowChange', navShow => {
      this.navShow = navShow
    })
  },
  computed: mapGetters({
    menuList: 'getMenuList'

  })
}
</script>
