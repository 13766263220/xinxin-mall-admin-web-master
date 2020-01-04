// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'


//Vue.config.productionTip = false
//包引用------start
//0.引入babel-polyfill,兼容Ie,将es6转为es5
//import 'babel-polyfill'


//1.引入element-ui
import ElementUI from 'element-ui'
//默认样式
// import 'element-ui/lib/theme-chalk/index.css'
//自定义样式
//import "../static/theme/theme-blue/index.css";
// import "../static/theme/theme-red/index.css";
import "../static/mytheme/index.css";
Vue.use(ElementUI)
//后引入路由,组件内样式可以覆盖elementui样式
import router from './router'

//2.引入axios
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';//端口设置
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

Vue.prototype.$http = axios;//将axios改写到vue原型属性,调用方式例如this.$http.post(xxx)

//3.引入vuex
import store from './store'


//4.引入ckeditor
// import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document'

//5.引入moment,表格日期格式化
//import moment from 'moment'
//Vue.prototype.$moment=moment;//设置到vue原型属性,调用方式this.$moment(date).format("YYYY-MM-DD HH:mm:ss");

//引入jquery
//import $ from 'jquery'
//Vue.prototype.$jquery=jquery

//引入qs
import qs from "qs"
Vue.prototype.$qs=qs

//包引用------end

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
