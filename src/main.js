import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/' // 配置请求的根目录
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.filter('dateFormat', function (dateStr) {
  // 根据给定的时间字符串，得到特定的时间
  const dt = new Date(dateStr * 1000)

  //   yyyy-mm-dd
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, '0')
  const d = dt.getDate().toString().padStart(2, '0')

  var hh = dt.getHours().toString().padStart(2, '0')
  var mm = dt.getMinutes().toString().padStart(2, '0')
  var ss = dt.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
