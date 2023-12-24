<template>
  <div
    :class="{
      [$style.menu]: true,
      [$style.white]: applicationSettings.menuColor === 'white',
      [$style.gray]: applicationSettings.menuColor === 'gray',
      [$style.dark]: applicationSettings.menuColor === 'dark',
    }"
  >
    <div :class="$style.logoContainer">
      <div :class="$style.logo">
        <svg
          
          viewBox="0 0 24 24"
          version="1.1"
          height="24px"
          width="24px"
        >
          <g>
            <path
              fill="#4b7cf3"
              strokeWidth="1"
              stroke="#4b7cf3"
              d="M12,10.9c-0.1,0-0.2,0-0.2-0.1L3.5,6.1C3.4,6,3.3,5.8,3.3,5.6c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4S20.6,6,20.5,6.1l-8.2,4.7C12.2,10.8,12.1,10.9,12,10.9z M4.8,5.6L12,9.8l7.2-4.2L12,1.5      L4.8,5.6z"
            />
            <path
              fill="#4b7cf3"
              strokeWidth="1"
              stroke="#4b7cf3"
              d="M13.6,23.6c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.2-0.3-0.2-0.4v-9.5c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.3,0.4l-8.2,4.7C13.8,23.6,13.7,23.6,13.6,23.6z M14.1,13.9v8.3l7.2-4.2V9.8      L14.1,13.9z"
            />
            <path
              fill="#4b7cf3"
              strokeWidth="1"
              stroke="#4b7cf3"
              d="M10.4,23.6c-0.1,0-0.2,0-0.2-0.1l-8.2-4.7c-0.2-0.1-0.3-0.3-0.3-0.4V8.9c0-0.2,0.1-0.3,0.2-0.4c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.2,0.4C10.5,23.6,10.5,23.6,10.4,23.6z M2.7,18.1l7.2,4.2v-8.3L2.7,9.8      V18.1z"
            />
          </g>
        </svg>
        <div :class="$style.name">{{ applicationSettings.masterName }}</div>
        <div :class="$style.descr" class="text-capitalize">
          {{ applicationSettings.version }}
        </div>
      </div>
    </div>
    <div :class="$style.navigation">
      <a-menu :mode="'horizontal'" :selected-keys="selectedKeys" @click="handleClick">
        <template v-for="item in menuData">
          <template v-if="!item.roles || item.roles.includes(user.role)">
            <item
              v-if="!item.children && !item.category"
              :key="item.key"
              :menu-info="item"
              :styles="$style"
            />
            <sub-menu v-if="item.children" :key="item.key" :menu-info="item" :styles="$style" />
          </template>
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import find from 'lodash/find'
import { getMenuData } from '@/services/menu'
import SubMenu from './partials/submenu'
import Item from './partials/item'
import {encryptStorage} from '@/utils'

export default {
  name: 'MenuTop',
  components: { SubMenu, Item },
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
