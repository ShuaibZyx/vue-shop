import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import dayjs from './js/dayjs.min.js'
//导入tree-table组件
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入全局样式表
import './assets/css/global.css'

//导入axios
import axios from 'axios'

Vue.config.productionTip = false

//全局注册tree-table组件
Vue.component('tree-table', TreeTable)

//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.filter('timeFormater', function (originValue, formatStr = 'YYYY年MM月DD日 HH:mm:ss') {
  return dayjs(originValue).format(formatStr)
})

//将Vue原型对象上的$http变为axios
Vue.prototype.$http = axios
//注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')
