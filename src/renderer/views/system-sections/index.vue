<template>
    <sidebar-menu
      class="sidebar"
      :menu="menu"
      :collapsed="collapsed"
      :show-child="showChild"
      @item-click="onItemClick"
      @update:collapsed="onToggleCollapse">
    </sidebar-menu>
    <div id="view" :class="[{ collapsed: collapsed }]">
          <vb-breadcrumbs2 v-if="applicationSettings.layoutBreadcrumbs === 'v2'" />
          <POAMs v-if="current == 'POA&Ms'" />
          <Compliance v-else-if="current == 'Compliance Overview'" />
          <Devices v-else-if="current == 'Devices'" />
          <IPRanges v-else-if="current == 'IP Ranges'" />
          <SSP v-else-if="current == 'System Security Plan'" />
          <Inheritance v-else-if="current == 'Inheritance'" />
          <CustomControls v-else-if="current == 'Custom Controls'" />
          <FrameworkControls v-else-if="current == 'Framework controls'" />
          <router-view v-else v-slot="{ Component }" :key="$route.fullPath" class="padding-30">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
          <vb-footer />
    </div>
  <!--<a-layout id="components-layout-demo-top-side">
    <menu-left />
    <a-layout-content>
      <a-layout style="padding: 0; background: #fff; min-height: calc(100vh - 70px);">
        <a-layout-header>
          <vb-breadcrumbs2 v-if="applicationSettings.layoutBreadcrumbs === 'v2'" />
        </a-layout-header>
        <a-layout-content style="padding: 30px">
          <POAMs v-if="current == 'POA&Ms'" />
          <Compliance v-else-if="current == 'Compliance Overview'" />
          <Devices v-else-if="current == 'Devices'" />
          <IPRanges v-else-if="current == 'IP Ranges'" />
          <SSP v-else-if="current == 'System Security Plan'" />
          <Inheritance v-else-if="current == 'Inheritance'" />
          <CustomControls v-else-if="current == 'Custom Controls'" />
          <FrameworkControls v-else-if="current == 'Framework controls'" />
          <router-view v-else v-slot="{ Component }" :key="$route.fullPath">
            <transition>
              <component :is="Component" />
            </transition>
          </router-view>
        </a-layout-content>
        <a-layout-footer v-if="applicationSettings.layoutFooter === 'v1'">
            <vb-footer />
        </a-layout-footer>
      </a-layout>
    </a-layout-content>
  </a-layout>-->
</template>
<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
//import MenuLeft from '@/@vb/components/MenuSystemClassic/MenuLeft'
import POAMs from './POA&Ms'
import Compliance from './Compliance'
import Devices from './Devices'
import IPRanges from './IPRanges'
import Inheritance from './Inheritance'
import CustomControls from './CustomControls'
import FrameworkControls from './FrameworkControls'
import SSP from './SSP'
import VbFooter from '@/@vb/components/Footer'

import VbBreadcrumbs2 from '@/@vb/components/Breadcrumbs2'
export default {
  name: 'Vbmain',
  components: {
   // MenuLeft,
    POAMs,
    Compliance,
    Inheritance,
    FrameworkControls,
    CustomControls,
    Devices,
    SSP,
    IPRanges,
    VbBreadcrumbs2,
    VbFooter
  },
  setup() {
    const route = useRoute()
    const current = computed(() => route.meta.title)
    const store = useStore()
    //const showChild = true
    const applicationSettings = computed(() => store.getters.applicationSettings)
    // console.log('system setup')
    
    return {
      current,
      applicationSettings,
    }
  },
  data() {
    return {
 menu: [
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
      ],
      collapsed: false,
      showChild: true
    };
  },
  created() {
    // console.log('system created')
  },
  methods: {
    onItemClick(event, item) {
      if(item.title =='Controls'){
        if(document.getElementsByClassName('vsm--child')[0].style.display == 'block'||document.getElementsByClassName('vsm--child')[0].style.display ==""){
          document.getElementsByClassName('vsm--child')[0].style.display = 'none'
        }else{
          document.getElementsByClassName('vsm--child')[0].style.display = 'block'
        }
      }else if(item.title =='Target(s)'){
         if(document.getElementsByClassName('vsm--child')[1].style.display == 'block'||document.getElementsByClassName('vsm--child')[1].style.display ==""){
          document.getElementsByClassName('vsm--child')[1].style.display = 'none'
         }else{
          document.getElementsByClassName('vsm--child')[1].style.display = 'block'
         }
      }
    },
    onCollapse(c) {
      console.log("onCollapse");
      this.collapsed = c;
    },
    onToggleCollapse(collapsed) {
      console.log("Collapse");
      this.collapsed = collapsed;
    }
  },
}
</script>
<style>
.v-sidebar-menu.vsm_expanded .vsm--link_level-1.vsm--link_open {
    background-color: #000!important;
    color: #fff;
} 
.v-sidebar-menu.vsm_expanded .vsm--link_level-1.vsm--link_open .vsm--icon {
   background-color: #000!important;
   }
.sidebar{
  top:70px;
}
#view {
 padding-left: 320px;
 margin-top:20px;
}
.collapsed {
  padding-left: 100px!important;
  margin-top:20px;
}

.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: "\f105";
  font-family: "FontAwesome";
}
.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f07e";
  font-family: "FontAwesome";
}
.sidebar.v-sidebar-menu {
  top:70px;
}
.v-sidebar-menu .vsm--item {
    display: block;
    position: static!important;
    white-space: nowrap;
    width: 100%;
    padding: 0px;
}
.padding-30{
padding-top:30px;
}
</style>
