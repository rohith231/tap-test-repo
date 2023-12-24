import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import App from './App.vue'

// import './registerServiceWorker'
import router from './router'
import store from './store'
import { i18n } from './localization'
import './services/axios/fakeApi' // mocking api
import mitt from 'mitt'
// import VueApexCharts from "vue3-apexcharts";
const emitter = mitt()
import { Tabs } from 'ant-design-vue'
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(Antd)
  .use(Tabs)
  // .use(VueApexCharts)
  .use(PerfectScrollbar)
  .use(VueSidebarMenu)

app.config.globalProperties.emitter = emitter
app.config.globalProperties.docment = window.docment

app.mount('#app')
