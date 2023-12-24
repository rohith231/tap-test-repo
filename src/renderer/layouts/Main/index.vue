<template>
  <template v-if="!OnlineStatus">
    <a-result
      status="500"
      title=""
      style="position:fixed; top:0; bottom: 0; right:0; left:0; z-index:1000; overflow: hidden; background-color: : rgb(255 255 255 / 50%)!important ;backdrop-filter: blur(20px);"
      @click="$router.go()"
      sub-title="Sorry, no internet connection."
    >
      <template #extra>
        <a-button type="primary"> Reload </a-button>
      </template>
    </a-result>
  </template>
  <vue3-tabs-chrome
    :ref="setTabRef"
    :tabs="newtabs"
    v-model="newtab"
    :class="{ 'theme-dark': applicationSettings.theme !== 'default' }"
    insert-to-after
    v-show="newtabs.length > 1"
  />
  <a-spin
    :spinning="!hasConnection"
    size="large"
    :delay="500"
    tip="Checking Database Connection..."
  >
    <div
      :class="{
        vb__layout__grayBackground: applicationSettings.isGrayBackground,
      }"
    >
      <a-layout
        v-if="!adminPage()"
        v-show="newtab == 'system-dashboard' && !adminPage()"
        :class="{
          vb__layout: true,
          vb__layout__contentMaxWidth: applicationSettings.isContentMaxWidth,
          vb__layout__appMaxWidth: applicationSettings.isAppMaxWidth,
          vb__layout__squaredBorders: applicationSettings.isSquaredBorders,
          vb__layout__cardsShadow: true,
          vb__layout__borderless: applicationSettings.isBorderless,
        }"
      >
        <vb-variants />
        <!-- <vb-sidebar /> -->
        <vb-menu-simply />
        <a-layout style="margin-top: 70px;">
          <!-- <a-layout-header
            
          >
            <vb-topbar />
          </a-layout-header> -->
          <a-layout-content
            class="vb__layout__content"
            :class="{
              'p-0':
                (!$router.currentRoute.value.meta.systemView ||
                  $router.currentRoute.value.meta.showSelectSystems) &&
                $router.currentRoute.value.fullPath != '/dashboard',
              // 'p-4':
              //   $router.currentRoute.value.fullPath == '/systems' ||
              //   $router.currentRoute.value.fullPath == '/systems/profile/new',
            }"
            :route="$router.currentRoute.value.fullPath"
          >
            <!-- <System v-if="$router.currentRoute.value.fullPath == '/systems'" /> -->
            <!-- <SystemDetails
              v-else-if="$router.currentRoute.value.fullPath == '/systems/profile/new'"
            /> -->
            <dashboard v-if="$router.currentRoute.value.fullPath == '/dashboard'" />
            <system-view v-else />
          </a-layout-content>
        </a-layout>
      </a-layout>

      <a-layout
        v-if="adminPage()"
        v-show="adminPage()"
        :class="{
          vb__layout: true,
          vb__layout__contentMaxWidth: applicationSettings.isContentMaxWidth,
          vb__layout__appMaxWidth: applicationSettings.isAppMaxWidth,
          vb__layout__squaredBorders: applicationSettings.isSquaredBorders,
          vb__layout__cardsShadow: true,
          vb__layout__borderless: applicationSettings.isBorderless,
        }"
      >
        <vb-variants />
        <!-- <vb-sidebar /> -->
        <vb-menu-classic />
        <a-layout style="margin-top: 70px;">
          <!-- <a-layout-header :class="{}">
            <vb-topbar />
          </a-layout-header> -->
          <!-- <vb-breadcrumbs /> -->
          <a-layout-content
            class="vb__layout__content"
            :route="$router.currentRoute.value.fullPath"
          >
            <router-view v-slot="{ Component }">
              <component :is="Component" :key="$route.fullPath" />
            </router-view>
          </a-layout-content>
          <a-layout-footer v-show="applicationSettings.layoutFooter === 'v1'">
            <vb-footer />
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </div>
  </a-spin>
  <a-spin :spinning="!hasConnection" :delay="500" tip="Checking Database Connection..."> </a-spin>

  <div id="components-back-top-demo-custom">
    <a-back-top />
  </div>
</template>

<script>
import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'
import { computed, onMounted, ref, watch, reactive, KeepAlive } from 'vue'
import { useStore } from 'vuex'
import VbTopbar from '@/@vb/components/Topbar'
import VbSidebar from '@/@vb/components/Sidebar'
import VbVariants from '@/@vb/components/Variants'
import VbMenuSimply from '@/@vb/components/MenuSimply'
import VbMenuClassic from '@/@vb/components/MenuClassic'
import VbBreadcrumbs2 from '@/@vb/components/Breadcrumbs2'
import VbBreadcrumbs from '@/@vb/components/Breadcrumbs'
import VbFooter from '@/@vb/components/Footer'
import Vue3TabsChrome from 'vue3-tabs-chrome'
import VbAppPartialsJiraAgileBoard from '@/@vb/widgets/AppPartials/JiraAgileBoard'
import useEmitter from '@/composables/useEmitter'
import { getMenuData } from '@/services/menu'
import { useRoute } from 'vue-router'
import router from '@/router'
import { encryptStorage } from '@/utils'
import Dashboard from '@/views/dashboard/alpha'
import SystemView from '@/views/system-sections/index.vue'
// import System from '@/views/system-sections/System'
// import SystemDetails from '@/views/system-sections/System/details'

export default {
  name: 'MainLayout',
  components: {
    KeepAlive,
    VbMenuClassic,
    VbMenuSimply,
    VbTopbar,
    VbSidebar,
    VbVariants,
    VbBreadcrumbs2,
    VbBreadcrumbs,
    VbFooter,
    VbAppPartialsJiraAgileBoard,
    Vue3TabsChrome,
    Dashboard,
    SystemView,
    // System,
    // SystemDetails,
  },
  setup() {
    // console.log('main setup')
    let OnlineStatus = ref(true)

    const alertOnlineStatus = () => {
      OnlineStatus.value = navigator.onLine
    }

    window.addEventListener('online', alertOnlineStatus)
    window.addEventListener('offline', alertOnlineStatus)

    alertOnlineStatus()

    const route = useRoute()
    const routePath = computed(() => route.path)
    const routeDetails = computed(() => route)
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const touchStartPrev = ref(0)
    const touchStartLocked = ref(false)
    const hasConnection = computed(() => store.getters['database/hasConnection'])
    const tabRef = ref()
    const toggleMobileMenu = () => {
      const value = !applicationSettings.value.isMobileMenuOpen
      store.commit('CHANGE_SETTING', { setting: 'isMobileMenuOpen', value })
    }

    const setViewPort = (isMobileView = false, isTabletView = false) => {
      store.commit('CHANGE_SETTING', {
        setting: 'isMobileView',
        value: isMobileView,
      })
      store.commit('CHANGE_SETTING', {
        setting: 'isTabletView',
        value: isTabletView,
      })
    }

    // resize viewport events (commit toggleMenu, etc...)
    const detectViewPortListener = () => {
      detectViewPort(false)
    }
    const detectViewPort = (firstLoad = false) => {
      const isMobile = applicationSettings.value.isMobileView
      const isTablet = applicationSettings.value.isTabletView
      const width = window.innerWidth
      const state = {
        next: {
          mobile: width < 768,
          tablet: width < 992,
          desktop: !(width < 768) && !(width < 992),
        },
        prev: {
          mobile: isMobile,
          tablet: isTablet,
          desktop: !isMobile && !isTablet,
        },
      }
      // desktop
      if (state.next.desktop && (state.next.desktop !== state.prev.desktop || firstLoad)) {
        setViewPort(false, false)
      }
      // tablet & collapse menu
      if (
        state.next.tablet &&
        !state.next.mobile &&
        (state.next.tablet !== state.prev.tablet || firstLoad)
      ) {
        setViewPort(false, true)
        store.commit('CHANGE_SETTING', {
          setting: 'isMenuCollapsed',
          value: true,
        })
      }
      // mobile
      if (state.next.mobile && (state.next.mobile !== state.prev.mobile || firstLoad)) {
        setViewPort(true, false)
      }
    }

    const setTabRef = (el) => {
      tabRef.value = el
    }
    // mobile slide bindings
    const bindMobileSlide = () => {
      // mobile menu touch slide opener
      const unify = (e) => {
        return e.changedTouches ? e.changedTouches[0] : e
      }
      document.addEventListener(
        'touchstart',
        (e) => {
          const x = unify(e).clientX
          touchStartPrev.value = x
          touchStartLocked.value = x > 70
        },
        { passive: false },
      )
      document.addEventListener(
        'touchmove',
        (e) => {
          const x = unify(e).clientX
          const prev = touchStartPrev.value
          if (x - prev > 50 && !touchStartLocked.value) {
            toggleMobileMenu()
            touchStartLocked.value = true
          }
        },
        { passive: false },
      )
    }

    const adminPage = (path = route.fullPath) =>
      getMenuData.some(
        (x) => (x.url === path && path != '/dashboard') || routeDetails.value.meta.adminPage,
      )
    const newtab = ref('system-dashboard')
    let newtabs = reactive([
      {
        label: 'System dashboard',
        key: 'system-dashboard',
        favico: require('./logo.png'),
        path: adminPage() ? '/dashboard' : routeDetails.value.fullPath,
        closable: false,
        dragable: true,
        swappable: true,
      },
    ])

    onMounted(() => bindMobileSlide())
    onMounted(() => detectViewPort(true))
    onMounted(() => window.addEventListener('resize', detectViewPortListener))
    onMounted(() => {
      // if (adminPage()) {
      //   emitter.emit('open-new-tab', { url: route.fullPath })
      // }

      // newtab.value = newtabs.some((tab) => tab.key == encryptStorage.getItem('app.activeTab'))
      //   ? encryptStorage.getItem('app.activeTab')
      //   : newtabs[0].key
    })

    // const emitter = useEmitter()
    // emitter.on('open-new-tab', (data) => {
    //   if (tabRef.value && !newtabs.some((tab) => tab.key == 'admin-setting')) {
    //     tabRef.value.addTab({
    //       label: `${routeDetails.value.meta.title}`,
    //       key: 'admin-setting',
    //       favico: require('./logo.png'),
    //       path: data.url,
    //       dragable: true,
    //       swappable: true,
    //     })
    //   }

    //   if (data.url) {
    //     newtabs.forEach((tab) => {
    //       if (tab.key == 'admin-setting' && data.url != '/dashboard') {
    //         tab.path = data.url
    //       }
    //     })
    //   }
    //   newtab.value = 'admin-setting'

    //   encryptStorage.setItem('app.activeTab', newtab.value)
    // })

    // watch(newtab, () => handleClick())
    // watch(routePath, (routePath) => {
    //   newtabs.forEach((tab) => {
    //     if (tab.key == newtab.value) {
    //       if (adminPage() && newtab.value == 'admin-setting') {
    //         tab.label = `${routeDetails.value.meta.title}`
    //         tab.path = routeDetails.value.fullPath
    //       } else if (newtab.value == 'system-dashboard') {
    //         tab.label = `System - ` + `${routeDetails.value.meta.title}`
    //         tab.path = routeDetails.value.fullPath
    //       }
    //     }
    //   })
    // })

    // const handleClick = () => {
    //   if (newtabs) {
    //     var activeItemTab = newtabs.filter((t) => t.key == newtab.value)

    //     if (activeItemTab[0].key == 'system-dashboard') {
    //       var systemDashboardTab = newtabs.filter((t) => t.key == 'system-dashboard')
    //       activeItemTab[0].path = adminPage() ? systemDashboardTab[0].path : activeItemTab[0].path
    //     }

    //     // router.back();
    //     router.replace({ path: activeItemTab[0].path })
    //   }
    //   encryptStorage.setItem('app.activeTab', newtab.value)
    // }

    return {
      OnlineStatus,
      adminPage,
      applicationSettings,
      hasConnection,
      newtabs,
      setTabRef,
      newtab,
      routeDetails,
    }
  },
  created() {
    // console.log('main created')
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(
        el,
        {
          rotateZ: '45deg',
          translateY: '30px',
          translateX: '30px',
          opacity: 0,
        },
        { complete: done },
      )
    },
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>

<style>
.vue3-tabs-chrome {
  padding-top: 5px;
  /* background-color: #dee1e6; */
  position: sticky !important;
  top: 0px;
  z-index: 997;
}
.vue3-tabs-chrome .tabs-item.active {
  width: 250px !important;
}
</style>

<style scoped>
#components-back-top-demo-custom .ant-back-top {
  bottom: 75px !important;
}
#components-back-top-demo-custom .ant-back-top-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #7dbcea;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgba(16, 142, 233, 1);
  color: #fff;
  min-height: 120px;
  line-height: 120px;
  height: 200px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
</style>
