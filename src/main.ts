import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//加载路由文件
import router from './router/index'
//引入elementui图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//引入vuex
import store from './store'
//引入iconfont
import './assets/iconfont/iconfont.json'
import './assets/iconfont/iconfont.css'

import './assets/css/replaceElement.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
  }
  app.use(store)
  app.use(router)
  app.use(ElementPlus)
  app.mount('#app')