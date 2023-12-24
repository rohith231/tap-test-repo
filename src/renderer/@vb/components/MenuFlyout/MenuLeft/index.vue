<template>
  <div
    :class="{
      [$style.air__menuLeft]: true,
      [$style.air__menuLeft__mobileToggled]: applicationSettings.isMobileMenuOpen,
      [$style.air__menuLeft__toggled]: applicationSettings.isMenuCollapsed,
      [$style.air__menuLeft__unfixed]: true,
      [$style.air__menuLeft__compact]: true,
      [$style.air__menuLeft__gray]: true,
      [$style.air__menuFlyout__gray]: true,
    }"
  >
    <div :class="$style.air__menuLeft__outer">
      <a
        href="javascript: void(0);"
        :class="$style.air__menuLeft__mobileToggleButton"
        @click="toggleMobileMenu"
      >
        <span />
      </a>
      <a
        href="javascript: void(0);"
        :class="$style.air__menuLeft__toggleButton"
        @click="toggleMenu"
      >
        <span />
        <span />
      </a>

      <perfect-scrollbar>
        <div :class="$style.air__menuLeft__container">
          <ul :class="$style.air__menuLeft__list">
            <template v-for="(item, index) in menuData">
              <item
                v-if="!item.children && !item.category"
                :key="index"
                :item="item"
                :styles="$style"
                :active-item="activeItem"
              />
              <sub-menu
                v-if="item.children"
                :key="index"
                :item="item"
                :styles="$style"
                :active-item="activeItem"
                :active-submenu="activeSubmenu"
                :handle-submenu-click="handleSubmenuClick"
                :handle-flyout-over="handleFlyoutOver"
                :handle-flyout-out="handleFlyoutOut"
              />
              <category v-if="item.category" :key="index" :item="item" :styles="$style" />
            </template>
          </ul>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
  <a
    href="javascript: void(0);"
    :class="$style.air__menuLeft__backdrop"
    @click="toggleMobileMenu"
  />
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import { getSystemMenuData } from '@/services/system-menu'
import SubMenu from './partials/submenu'
import Item from './partials/item'
import Category from './partials/category'

export default {
  name: 'MenuLeft',
  components: { SubMenu, Item, Category },
  setup() {
    const store = useStore()
    const route = useRoute()
    const menuData = computed(() => getSystemMenuData)
    const activeSubmenu = ref('')
    const activeItem = ref('')
    const renderedFlyoutItems = ref({})
    const flyoutTimers = ref({})
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const pathname = computed(() => route.path)
    const flyoutActive = computed(() => {
      return (
        (applicationSettings.value.flyoutMenuType === 'flyout' ||
          applicationSettings.value.flyoutMenuType === 'compact' ||
          applicationSettings.value.isMenuCollapsed) &&
        !applicationSettings.value.isMobileView
      )
    })

    const toggleMobileMenu = () => {
      const setting = 'isMobileMenuOpen'
      const value = !applicationSettings.value[setting]
      store.commit('CHANGE_SETTING', { setting, value })
    }

    const toggleMenu = () => {
      const setting = 'isMenuCollapsed'
      const value = !applicationSettings.value[setting]
      store.commit('CHANGE_SETTING', { setting, value })
    }

    const toggleSettings = () => {
      const setting = 'isSidebarOpen'
      const value = !applicationSettings.value[setting]
      store.commit('CHANGE_SETTING', { setting, value })
    }

    const handleSubmenuClick = (key) => {
      const currentKey = activeSubmenu.value
      if (flyoutActive.value) {
        return
      }
      activeSubmenu.value = currentKey === key ? '' : key
    }

    const setActiveItems = () => {
      const flattenItems = (items, key) =>
        items.reduce((flattenedItems, item) => {
          flattenedItems.push(item)
          if (Array.isArray(item[key])) {
            return flattenedItems.concat(flattenItems(item[key], key))
          }
          return flattenedItems
        }, [])
      const selectedItem =
        _.find(flattenItems(menuData.value, 'children'), ['url', pathname.value]) || {}
      const selectedSubmenu = menuData.value.reduce((key, parent) => {
        if (Array.isArray(parent.children)) {
          parent.children.map((child) => {
            if (child.key === selectedItem.key) {
              key = parent
            }
            return ''
          })
        }
        return key
      })

      activeItem.value = selectedItem.key
      activeSubmenu.value = selectedSubmenu.key
    }

    const handleFlyoutOver = (event, key, items) => {
      if (flyoutActive.value) {
        clearInterval(flyoutTimers.value[key])
        const item = event.currentTarget
        const itemDimensions = item.getBoundingClientRect()
        renderedFlyoutItems.value = {
          ...renderedFlyoutItems.value,
          [key]: {
            key,
            itemDimensions,
            items,
          },
        }
      }
    }

    const handleFlyoutOut = (key) => {
      if (flyoutActive.value) {
        flyoutTimers.value[key] = setTimeout(() => {
          const updatedFlyoutItems = Object.assign({}, renderedFlyoutItems.value)
          delete updatedFlyoutItems[key]
          renderedFlyoutItems.value = {
            ...updatedFlyoutItems,
          }
        }, 100)
      }
    }

    const handleFlyoutContainerOver = (key) => {
      clearInterval(flyoutTimers.value[key])
    }

    onMounted(setActiveItems)
    watch(pathname, () => setActiveItems())
    const goPath = (path) => {
      // console.log(path)
    }
    return {
      goPath,
      menuData,
      activeSubmenu,
      activeItem,
      renderedFlyoutItems,
      flyoutTimers,
      applicationSettings,
      flyoutActive,
      toggleMobileMenu,
      toggleMenu,
      toggleSettings,
      handleSubmenuClick,
      handleFlyoutOver,
      handleFlyoutOut,
      handleFlyoutContainerOver,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
