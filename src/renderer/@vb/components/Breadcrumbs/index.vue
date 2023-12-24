<template>
  <div :class="$style.breadcrumbs">
    <div :class="$style.path" style="display:flex;">
      <template v-for="(item, index) in breadcrumb">
        <span v-if="index != 0" :key="index">
          <span :class="$style.arrow"></span>
          <span>{{ item.title }}</span>
        </span>
      </template>
      <span v-if="activeItem">
        <span :class="$style.arrow"></span>
        <strong :class="$style.current">{{ activeItem.title }}</strong>
      </span>

    <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex"   v-if="routeDetails.path == '/users/list' ">
      
     <div :class="$style.divider" class="mr-4" />
     <router-link to="/users/profile/new">
       <button
        type="button"
        class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
      >
        <span class="btn-addon">
          <i class="btn-addon-icon fas fa-plus" />
        </span>
        Add User
      </button>
      </router-link>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMenuData } from '@/services/menu'

export default {
  name: 'Breadcrumbs',
  setup() {
    const route = useRoute()
    const breadcrumb = ref([])
    const activeItem = ref([])
    const menuData = getMenuData
    const routePath = computed(() => route.path)
 
    const routeDetails = computed(() =>route)
    const getPath = (data, url, parents = []) => {
      if (url === '/') {
        url = '/system-sections/dashboard'
      }
      let items = []
    
      if(routeDetails.value.meta.parents){
          items = routeDetails.value.meta.parents
      }
      activeItem.value =  {
        icon: routeDetails.value.meta ? routeDetails.value.meta.icon : '',
        key: routePath,
        title: routeDetails.value.meta ? routeDetails.value.meta.title : '',
        url: routePath
      }
      return items
    }

    onMounted(() => {
      breadcrumb.value = getPath(menuData, routePath.value)
    })

    watch(routePath, routePath => (breadcrumb.value = getPath(menuData, routePath)))

    return {
      breadcrumb,
      activeItem,
      routeDetails
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
