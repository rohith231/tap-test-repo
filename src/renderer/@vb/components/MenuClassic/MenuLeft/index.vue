<template>

<vb-menu-simply />
  <a-layout-sider
    :width="applicationSettings.leftMenuWidth"
    :collapsible="applicationSettings.isMobileView ? false : true"
    :collapsed="applicationSettings.isMenuCollapsed && !applicationSettings.isMobileView"
    :class="{
      [$style.menu]: true,
      [$style.white]: applicationSettings.menuColor === 'white',
      [$style.gray]: applicationSettings.menuColor === 'gray',
      [$style.dark]: applicationSettings.menuColor === 'dark',
      [$style.red]: applicationSettings.menuColor === 'red',
      [$style.antiquewhite]: applicationSettings.menuColor === 'antiquewhite',
      [$style.aqua]: applicationSettings.menuColor === 'aqua',
      [$style.blue]: applicationSettings.menuColor === 'blue',
      [$style.green]: applicationSettings.menuColor === 'green',
      [$style.orange]: applicationSettings.menuColor === 'orange',
      [$style.purple]: applicationSettings.menuColor === 'purple',
      [$style.unfixed]: applicationSettings.isMenuUnfixed,
      [$style.shadow]: applicationSettings.isMenuShadow,
    }"
    @collapse="onCollapse"
  >
    <div
      :class="$style.menuOuter"
      :style="{
        width:
          applicationSettings.isMenuCollapsed && !applicationSettings.isMobileView
            ? '80px'
            : applicationSettings.leftMenuWidth + 'px',
        height:
          applicationSettings.isMobileView || applicationSettings.isMenuUnfixed
            ? 'calc(100% - 64px)'
            : 'calc(100% - 110px)',
      }"
    >
      <!-- <router-link :to="'/'">
        <div :class="$style.logoContainer">
          <div :class="$style.logo">
            <svg
              version="1.0" 
              width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000"
              preserveAspectRatio="xMidYMid meet">

              <g
                transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
                fill="#000000" stroke="none">
                  <path
                    d="M107 405 c-32 -7 -60 -15 -63 -17 -3 -3 -4 -40 -2 -81 l3 -76 45 31
                    c25 17 94 54 153 83 l109 52 -58 11 c-70 15 -111 14 -187 -3z"/>
                  <path
                    d="M344 352 c-44 -26 -108 -69 -142 -95 -64 -50 -188 -164 -138 -128
                    l28 21 53 -45 c29 -25 58 -45 65 -45 6 0 48 30 91 66 l79 66 0 83 c0 79 1 84
                    28 104 45 34 22 24 -64 -27z"/>
              </g>
            </svg>
            <div :class="$style.name">{{ organizationName }}</div>
          </div>
        </div>
      </router-link> -->

      <perfect-scrollbar :style="{ height: '100%',top:'70px' }">
        <a-menu
          v-model:open-keys="openKeys"
          :inline-collapsed="applicationSettings.isMobileView ? false : applicationSettings.isMenuCollapsed =='true'? true: false"
          :mode="'inline'"
          :selected-keys="selectedKeys"
          :inline-indent="15"
          :class="$style.navigation"
          @click="handleClick"
          @openChange="handleOpenChange"
        >
          <template v-for="(item, index) in menuData">
            <template v-if="!item.roles || item.roles.includes(user.role) ">
              <a-menu-item-group v-if="item.category && item.key != 'q7r3hr' " :key="index" >
                <template #title >
                  {{ item.title }}
                </template>
              </a-menu-item-group>
              <item
                v-if="!item.children && !item.category && item.key != '__dashboard' "
                :key="item.key"
                :menu-info="item"
                :styles="$style"
              />
              <sub-menu v-if="item.children" :key="item.key" :menu-info="item" :styles="$style" />
            </template>
          </template>
        </a-menu>
      </perfect-scrollbar>
    </div>
  </a-layout-sider>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { encryptStorage } from '@/utils'

import find from 'lodash/find'
import { getMenuData } from '@/services/menu'
import SubMenu from './partials/submenu'
import Item from './partials/item'
import VbMenuSimply from '../../MenuSimply'

export default {
  name: 'MenuLeft',
  components: { SubMenu, Item, VbMenuSimply },
  setup() {
    const store = useStore()
    const route = useRoute()
    const menuData = computed(() => getMenuData)
    const selectedKeys = ref([])
    const openKeys = ref([])
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const isMenuCollapsed = computed(() => store.getters.applicationSettings.isMenuCollapsed)
    const user = computed(() => store.getters['user/user'])
    const pathname = computed(() => route.pathname)
    const organizationName = computed(() => store.getters['organization/organization'].name)

    const onCollapse = (collapsed, type) => {
      const value = !applicationSettings.value.isMenuCollapsed
      store.commit('CHANGE_SETTING', { setting: 'isMenuCollapsed', value })
    }

    const handleClick = e => {
      if (e.key === 'settings') {
        store.commit('CHANGE_SETTING', {
          setting: 'isSettingsOpen',
          value: true,
        })
        return
      }
      encryptStorage.setItem('app.menu.selectedKeys', [e.key])
      selectedKeys.value = [e.key]
    }

    const handleOpenChange = openKeys => {
      encryptStorage.setItem('app.menu.openedKeys', openKeys)
      openKeys.value = openKeys
    }

    const setSelectedKeys = () => {
      const flattenItems = (items, key) =>
        items.reduce((flattenedItems, item) => {
          flattenedItems.push(item)
          if (Array.isArray(item[key])) {
            return flattenedItems.concat(flattenItems(item[key], key))
          }
          return flattenedItems
        }, [])
      const selectedItem = find(flattenItems(menuData.value.concat(), 'children'), [
        'url',
        pathname,
      ])
      selectedKeys.value = selectedItem ? [selectedItem.key] : []
    }

    onMounted(() => {
      openKeys.value = encryptStorage.getItem('app.menu.openedKeys') || []
      selectedKeys.value = encryptStorage.getItem('app.menu.selectedKeys') || []
      setSelectedKeys()
    })

    watch(pathname, () => setSelectedKeys())
    watch(isMenuCollapsed, () => (openKeys.value = []))

    return {
      menuData,
      organizationName,
      selectedKeys,
      openKeys,
      applicationSettings,
      user,
      onCollapse,
      handleClick,
      handleOpenChange,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>

