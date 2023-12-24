<template>
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
  <div
    class="v-sidebar-menu" 
    :inline-collapsed="applicationSettings.isMobileView ? false : applicationSettings.isMenuCollapsed =='true'? true: false"
    :class="sidebarClass"
    :style="[{'max-width': sidebarWidth}]"
    @mouseleave="onMouseLeave"
    @mouseenter="onMouseEnter"
    :mode="'inline'"
          :selected-keys="selectedKeys"
          :inline-indent="15"
  >
    <slot name="header" />
    <div
      class="vsm--scroll-wrapper"
      :style="isCollapsed && [rtl ? {'margin-left': '-17px'} : {'margin-right': '-17px'}]"
    >
      <div
        class="vsm--list"
        :style="isCollapsed && {'width': widthCollapsed}"
      >
        <sidebar-menu-item
          v-for="(item, index) in menu"
          :key="index"
          :item="item"
          :is-collapsed="isCollapsed"
          :active-show="activeShow"
          :show-one-child="showOneChild"
          :show-child="showChild"
          :rtl="rtl"
          :mobile-item="mobileItem"
          :disable-hover="disableHover"
          @set-mobile-item="setMobileItem"
          @unset-mobile-item="unsetMobileItem"
        >
          <slot
            slot="dropdown-icon"
            name="dropdown-icon"
          />
        </sidebar-menu-item>
      </div>
      <div
        v-if="isCollapsed"
        class="vsm--mobile-item"
        :style="mobileItemStyle.item"
      >
        <sidebar-menu-item
          v-if="mobileItem"
          :item="mobileItem"
          :is-mobile-item="true"
          :mobile-item-style="mobileItemStyle"
          :is-collapsed="isCollapsed"
          :show-child="showChild"
          :rtl="rtl"
          :disable-hover="disableHover"
        >
          <slot
            slot="dropdown-icon"
            name="dropdown-icon"
          />
        </sidebar-menu-item>
        <transition name="slide-animation">
          <div
            v-if="mobileItem"
            class="vsm--mobile-bg"
            :style="mobileItemStyle.background"
          />
        </transition>
      </div>
    </div>
    <slot name="footer" />
    <!--<button
      v-if="!hideToggle"
      class="vsm--toggle-btn"
      :class="{'vsm--toggle-btn_slot' : $slots['toggle-icon']}"
      @click="onToggleClick"
    >
      <slot name="toggle-icon" />
    </button>-->
  </div>
  </div>
  </a-layout-sider>
</template>
     
<!--<template>
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
     <div :class="$style.logoContainer">
        <div :class="$style.logo">
          <svg version="1.0" 
          width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000"
          preserveAspectRatio="xMidYMid meet">

          <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
          fill="#000000" stroke="none">
          <path d="M107 405 c-32 -7 -60 -15 -63 -17 -3 -3 -4 -40 -2 -81 l3 -76 45 31
          c25 17 94 54 153 83 l109 52 -58 11 c-70 15 -111 14 -187 -3z"/>
          <path d="M344 352 c-44 -26 -108 -69 -142 -95 -64 -50 -188 -164 -138 -128
          l28 21 53 -45 c29 -25 58 -45 65 -45 6 0 48 30 91 66 l79 66 0 83 c0 79 1 84
          28 104 45 34 22 24 -64 -27z"/>
          </g>
          </svg>
          <div :class="$style.name">{{ organizationName }}</div>
        </div>
      </div> 
      <perfect-scrollbar :style="{ height: '100%' }">
        <a-menu
          v-model:open-keys="openKeys"
          :inline-collapsed="applicationSettings.isMobileView ? false : applicationSettings.isMenuCollapsed =='true'? true: false"
          :mode="'inline'"
          :selected-keys="selectedKeys"
          :inline-indent="15"
          :class="$style.navigation"
          @click="handleClick"
          @openChange="handleOpenChange">
          <template v-for="(item, index) in menuData">
            <template v-if="!item.roles || item.roles.includes(user.role) ">
              <a-menu-item-group v-if="item.category && item.key != 'q7r3hr' " :key="index" >
                <template #title >
                  {{ item.title }}
                </template>
              </a-menu-item-group>
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
      </perfect-scrollbar>
    </div>
  </a-layout-sider>
</template>-->

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { encryptStorage } from '@/utils'
import find from 'lodash/find'
import { getSystemMenuData } from '@/services/system-menu'
//import SubMenu from './partials/submenu'
//import Item from './partials/item'
import SidebarMenuItem from './SidebarMenuItem.vue'

export default {
  name: 'MenuLeft',
  components: {
    SidebarMenuItem,
    //SubMenu,
   // Item
      },
  provide () {
    return {
      emitActiveShow: this.onActiveShow,
      emitItemClick: this.onItemClick,
      emitItemUpdate: this.onItemUpdate
    }
  },
  props: {
   /* menu: {
      type: Array,
      required: true
    },*/
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '350px'
    },
    widthCollapsed: {
      type: String,
      default: '50px'
    },
    showChild: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: ''
    },
    showOneChild: {
      type: Boolean,
      default: false
    },
    rtl: {
      type: Boolean,
      default: false
    },
    relative: {
      type: Boolean,
      default: false
    },
    hideToggle: {
      type: Boolean,
      default: false
    },
    disableHover: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const menuData = computed(() => getSystemMenuData)
    const selectedKeys = ref([])
    const openKeys = ref([])
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const isMenuCollapsed = computed(() => store.getters.applicationSettings.isMenuCollapsed)
    const user = computed(() => store.getters['user/user'])
    const pathname = computed(() => route.pathname)
    const organizationName = computed(() => store.getters['organization/organization'].name)

      //console.log("isSettingsOpen", isSettingsOpen)
    const onCollapse = (collapsed, type) => {
      const value = !applicationSettings.value.isMenuCollapsed
      store.commit('CHANGE_SETTING', { setting: 'isMenuCollapsed', value })
    }

    const handleClick = e => {
      console.log("isSettingsOpen", isSettingsOpen)
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
  data () {
    return {
      isCollapsed: this.collapsed,
      mobileItem: null,
      mobileItemPos: 0,
      mobileItemHeight: 0,
      mobileItemTimeout: null,
      activeShow: null,
      parentHeight: 0,
      parentWidth: 0,
      parentOffsetTop: 0,
      parentOffsetLeft: 0,
      menu: [
  // VB:REPLACE-START:MENU-CONFIG
  /*{
    category: true,
    title: 'Compliance',
    key: 'q7r3hr',
  },*/
  {
    title: 'Quick View',
    key: '__statistics',
    href: '/system-sections/dashboard',
    icon: 'fa fa-bar-chart',
  },
  {
    title: 'Information Systems',
    key: '__information_systems',
    href: '/systems',
    icon: 'fas fa-laptop'
  },
  {
    title: 'Compliance Overview',
    key: '__compliance',
    href: '/system-sections/compliance',
    icon: 'fas fa-check-double',
  },
{
  title: 'Controls',
  key: '__controls',
  //href: '/controls',
    icon: 'fa fa-chevron-down',
  child:[
    {
    title: 'Framework Controls',
    key: '__framework-controls',
    href: '/system-sections/framework-controls',
    icon: 'fa fa-bars',
  },
{
    title: 'Custom Controls',
    key: '__custom-controls',
    href: '/system-sections/custom-controls',
    icon: 'far fa-list-alt',
  },
]
},
  {
    title: 'POAMs',
    key: '__POA&Ms',
    href: '/system-sections/POA&Ms',
    icon: 'fas fa-tasks',
  },
  {
    title: 'Inheritance',
    key: '__inheritance',
    href: '/system-sections/inheritance',
    icon: 'fas fa-angle-double-down',
  },
  {
  title: 'Target(s)',
  key: 'targets',
   icon: 'fa fa-chevron-down', 
   //href: '/system-sections/devices',
  child:[
    /*{
    title: 'Devicecategories',
    key: '__devicecategories',
    href: '/system-sections/devicecategories',
    icon: 'fas fa-server',
  },*/
  {
    title: 'Target(s) List',
    key: '_targets',
    href: '/system-sections/devices',
    icon: 'fas fa-server',
  },
  {
    title: 'IP Ranges',
    key: '__ip-ranges',
    href: '/system-sections/ip-ranges',
    icon: 'fas fa-globe',
  },
  ]
  },
  {
    title: 'System Security Plan',
    key: '_ssp',
    href: '/system-sections/ssp',
    icon: 'fa fa-shield',
  },
  {
    title: 'AI (Coming Soon)',
    key: '_AI',
    // href: '/system-sections/ssp',
    icon: 'fa fa-head-side-gear',
  },
]
    }
  },
  computed: {
    sidebarWidth () {
      return this.isCollapsed ? this.widthCollapsed : this.width
    },
    sidebarClass () {
      return [
        !this.isCollapsed ? 'vsm_expanded' : 'vsm_collapsed',
        this.theme ? `vsm_${this.theme}` : '',
        this.rtl ? 'vsm_rtl' : '',
        this.relative ? 'vsm_relative' : ''
      ]
    },
    mobileItemStyle () {
      return {
        item: [
          { 'position': 'absolute' },
          { 'top': `${this.mobileItemPos}px` },
          this.rtl ? { 'right': '0px' } : { 'left': '0px' },
          this.rtl ? { 'padding-right': this.sidebarWidth } : { 'padding-left': this.sidebarWidth },
          this.rtl && { 'direction': 'rtl' },
          { 'z-index': 0 },
          { 'width': `${this.parentWidth - this.parentOffsetLeft}px` },
          { 'max-width': this.width }
        ],
        dropdown: [
          { 'position': 'absolute' },
          { 'top': `${this.mobileItemHeight}px` },
          { 'width': '100%' },
          { 'max-height': `${this.parentHeight - (this.mobileItemPos + this.mobileItemHeight) - this.parentOffsetTop}px` },
          { 'overflow-y': 'auto' }
        ],
        background: [
          { 'position': 'absolute' },
          { 'top': '0px' },
          { 'left': '0px' },
          { 'right': '0px' },
          { 'width': '100%' },
          { 'height': `${this.mobileItemHeight}px` },
          { 'z-index': -1 }
        ]
      }
    }
  },
  watch: {
    collapsed (val) {
      if (this.isCollapsed === this.collapsed) return
      this.isCollapsed = val
      this.mobileItem = null
    }
  },
  methods: {
    onMouseLeave () {
      this.unsetMobileItem(false, 300)
    },
    onMouseEnter () {
      if (this.isCollapsed) {
        if (this.mobileItemTimeout) clearTimeout(this.mobileItemTimeout)
      }
    },
    onToggleClick () {
      this.isCollapsed = !this.isCollapsed
      this.mobileItem = null
      this.$emit('toggle-collapse', this.isCollapsed)
    },
    onActiveShow (item) {
      this.activeShow = item
    },
    onItemClick (event, item, node) {
      var divs = document.getElementsByClassName('vsm--item_open')
      if(item.title =='Controls'){
        if(divs[0].children[1].style.display == 'block'||divs[0].children[1].style.display ==""){
        divs[0].children[1].style.display = 'none'
        }else{
        divs[0].children[1].style.display = 'block'
        }
      }else if(item.title =='Target(s)'){
         if(divs[1].children[1].style.display == 'block'||divs[1].children[1].style.display ==""){
          divs[1].children[1].style.display = 'none'
         }else{
         divs[1].children[1].style.display = 'block'
         }
      }
      this.$emit('item-click', event, item, node)
    },
    setMobileItem ({ item, itemEl }) {
      if (this.mobileItem === item) return
      const sidebarTop = this.$el.getBoundingClientRect().top
      const itemLinkEl = itemEl.children[0]
      const { top, height } = itemLinkEl.getBoundingClientRect()

      let positionTop = top - sidebarTop
      this.initParentOffsets()
      this.mobileItem = item
      this.mobileItemPos = positionTop
      this.mobileItemHeight = height
    },
    unsetMobileItem (immediate, delay = 800) {
      if (!this.mobileItem) return
      if (this.mobileItemTimeout) clearTimeout(this.mobileItemTimeout)
      if (immediate) {
        this.mobileItem = null
        return
      }
      this.mobileItemTimeout = setTimeout(() => {
        this.mobileItem = null
      }, delay)
    },
    initParentOffsets () {
      let { top: sidebarTop, left: sidebarLeft, right: sidebarRight } = this.$el.getBoundingClientRect()
      let parent = this.relative ? this.$el.parentElement : document.documentElement
      this.parentHeight = parent.clientHeight
      this.parentWidth = parent.clientWidth
      if (this.relative) {
        let { top: parentTop, left: parentLeft } = parent.getBoundingClientRect()
        this.parentOffsetTop = sidebarTop - (parentTop + parent.clientTop)
        this.parentOffsetLeft = this.rtl ? this.parentWidth - sidebarRight + (parentLeft + parent.clientLeft) : sidebarLeft - (parentLeft + parent.clientLeft)
      } else {
        this.parentOffsetTop = sidebarTop
        this.parentOffsetLeft = this.rtl ? this.parentWidth - sidebarRight : sidebarLeft
      }
    },
    onItemUpdate (newItem, item) {
      if (item === this.mobileItem) {
        this.mobileItem = newItem
      }
      if (item === this.activeShow) {
        console.log('activeShow', this.activeShow)
        this.activeShow = newItem
      }
    }
  },
}
</script>
<style lang="scss" module>
@import '@/@vb/components/MenuSystemClassic/MenuLeft/vue-sidebar-menu.scss';

@import './style.module.scss';
.v-sidebar-menu {
    * {
      box-sizing: border-box;
    }
  
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    transition: 0.3s max-width ease;
    
    .vsm--scroll-wrapper {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .vsm--dropdown > .vsm--list {
      padding: 5px;
    }
    
    .vsm--item {
      position: relative;
      display: block;
      width: 100%;
      white-space: nowrap;
      padding:15px;
    }
  
    .vsm--link {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      font-size: $item-font-size;
      font-weight: 400;
      padding: $item-padding;
      line-height: $item-line-height;
      text-decoration: none;
      user-select: none;
      z-index: 20;
      transition: 0.3s all ease;
      &_exact-active,
      &_active {
        font-weight: 600;
      }
      &_disabled {
        opacity: 0.4;
        pointer-events: none;
      }
      &_level-1 {
        .vsm--icon {
          height: $icon-height;
          line-height: $icon-height;
          width: $icon-width;
          flex-shrink: 0;
          text-align: center;
          border-radius: 3px;
        }
      }
    }
  
    .vsm--icon {
      display: inline-block;
      margin-right: 10px;
    }
  
    .vsm--title {
      flex-grow: 1;
    }
  
    .vsm--arrow {
      width: 30px;
      text-align: center;
      font-style: normal;
      font-weight: 900;
      transition: 0.3s transform ease;
      &:after {
        content: '\f105';
        font-family: 'Font Awesome 5 Free';
      }
      &_open {
        transform: rotate(90deg);
      }
      &_slot:after {
        display: none;
      }
    }
  
    .vsm--header {
      font-size: 14px;
      font-weight: 600;
      padding: 10px;
      white-space: nowrap;
      text-transform: uppercase;
    }
  
    .vsm--badge {
      &_default {
        padding: 0px 6px;
        font-size: 12px;
        border-radius: 3px;
        height: 20px;
        line-height: 20px;
        font-weight: 600;
        text-transform: uppercase;
      }
    }
  
    .vsm--toggle-btn {
      display: block;
      text-align: center;
      font-style: normal;
      font-weight: 900;
      height: 50px;
      cursor: pointer;
      border: none;
      width: 100%;
      &:after {
        content: '\f337';
        font-family: 'Font Awesome 5 Free';
      }
      &_slot:after {
        display: none;
      }
    }
  
    &.vsm_collapsed {
      & .vsm--link_level-1 {
        &.vsm--link_hover,
        &:hover {
          background-color: transparent !important;
        }
      }
    }
  
    &.vsm_rtl {
      right: 0;
      left: inherit;
      text-align: right;
      direction: rtl;
  
      & .vsm--icon {
        margin-left: 10px;
        margin-right: 0px;
      }
    }

    &.vsm_relative {
      position: relative;
      height: 100%;
    }

    .expand-enter-active,
    .expand-leave-active {
      transition: height 0.3s ease;
      overflow: hidden;
    }
    .expand-enter,
    .expand-leave-to {
      height: 0 !important;
    }

    .slide-animation-enter-active {
      transition: width 0.3s ease;
    }
    .slide-animation-leave-active {
      transition: width 0.3s ease;
    }
    .slide-animation-enter,
    .slide-animation-leave-to {
      width: 0 !important;
    }

    .fade-animation-enter-active {
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .fade-animation-leave-active {
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .fade-animation-enter,
    .fade-animation-leave-to {
      opacity: 0 !important;
      visibility: hidden !important;
    }

    .vsm--mobile-item>.vsm--item {
      padding: 0 !important;
      margin: 0 !important;
    }
    .vsm--mobile-item>.vsm--item>.vsm--link {
      margin: 0 !important;
      background-color: transparent !important;
      line-height: $icon-height !important;
    }
  }
</style>

