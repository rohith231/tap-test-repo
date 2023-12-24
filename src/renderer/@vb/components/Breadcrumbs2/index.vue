<template>
  <div :class="$style.subbar" v-if="show">
    <ul :class="$style.breadcrumbs" class="mr-4">
      <li :class="$style.breadcrumb" v-if="routeDetails.meta.showSelectSystems">
        <a-select v-model="selectedSystem" :disabled="routeDetails.meta.disabledSelectSystems" :default-value="selectedSystem"  :loading="loading"  @change="setSystem" style="min-width: 170px;">
            <a-select-option :value="system.id"  v-for="(system) in user_systems" :key="system.id" >
                {{ system.name }}
            </a-select-option>
          </a-select>
      </li>
      <template v-for="(item, index) in breadcrumb" :key="index" >
        <router-link :to="item.path">
        <li :class="[$style.breadcrumb,$style.logo,item.icon,'mr-2']">
         <span style="padding-left:10px;padding-right:10px;"> {{ item.title }} </span> -
          </li>
        </router-link>
      </template>
    </ul>
    <div :class="$style.divider" class="mr-4 d-xl-block"  v-if="routeDetails.meta.showSelectFramework"/>
    <a-select  v-model="selectedFramework" :default-value="selectedFramework"  :loading="loading" style="min-width: 170px"  @change="setFramework" v-if="routeDetails.meta.showSelectFramework && system_frameworks.length > 0">
       <a-select-option :value="framework.identifier"  v-for="(framework) in system_frameworks" :key="framework.identifier" >
                {{ framework.name }}
       </a-select-option>
    </a-select>
    <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex" v-if="routeDetails.path == '/system-sections/dashboard' ">
    <router-link :to="`/systems/profile/` + selectedSystem">
       <button
        type="button"
        class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
      >
        <span class="btn-addon">
          <i class="btn-addon-icon fe fe-edit" />
        </span>
        Edit System
      </button>
      </router-link>

    </div>
    

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
    
    <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex"   v-if="routeDetails.path == '/roles' ">
      <a-tooltip placement="top" title="Mark as important">
        <a class="btn btn-sm btn-light mr-2">
          <i class="fe fe-star" />
        </a>
      </a-tooltip>
      
     <div :class="$style.divider" class="mr-4"  v-if="routeDetails.path == '/roles' "/>
       <button
        type="button"
        class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
      >
        <span class="btn-addon">
          
          <i class="btn-addon-icon fas fa-plus" />
        </span>
        Add Role
      </button>
    </div>

    <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex"   v-if="routeDetails.path == '/settings' ">
      <a-tooltip placement="top" title="Mark as important">
        <a class="btn btn-sm btn-light mr-2">
          <i class="fe fe-star" />
        </a>
      </a-tooltip>
      
     <div :class="$style.divider" class="mr-4"  v-if="routeDetails.path == '/settings' "/>
       <button
        type="button"
        class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
      >
        <span class="btn-addon">
          
          <i class="btn-addon-icon fas fa-plus" />
        </span>
        Add Setting
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMenuData } from '@/services/menu'
import NProgress from 'nprogress'
import { useStore } from 'vuex'
import { encryptStorage } from '@/utils'
import useEmitter from '@/composables/useEmitter'

export default {
  name: 'Breadcrumbs2',
  setup() {
    const store = useStore()

    const route = useRoute()
    const breadcrumb = ref([])
    const activeItem = ref([])
    const menuData = getMenuData
    const routePath = computed(() => route.path)
    const routeDetails = computed(() =>route)
    const user_systems = computed(() => store.getters['user/Systems'])
    const organizationName = computed(() => store.getters['organization/organization'].name)
    const system_frameworks = ref([])
    const show = ref(true)
    const emitter = useEmitter()
    let selectedSystem = ref('');
    let selectedFramework = ref('');
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
    const setFramework = (framework = null) => {

      selectedFramework.value = null
      
      encryptStorage.setItem(`selectedFramework`, selectedFramework.value)
      store.commit('user/SET_STATE', { selectedFramework:selectedFramework.value})


      if(!framework){
        let chosenSystem = user_systems.value.filter(system => system.id == selectedSystem.value);
  
        if(!chosenSystem[0] || !chosenSystem[0].Frameworks || chosenSystem[0].Frameworks.length  == 0){
          return
        }
        framework = chosenSystem[0].Frameworks[0].identifier;
      }
      selectedFramework.value = framework

      encryptStorage.setItem(`selectedFramework`, selectedFramework.value)
      store.commit('user/SET_STATE', { selectedFramework:selectedFramework.value})
    }

      emitter.on("update-selected-system", data => {  
        system_frameworks.value = data.system_frameworks
        
        selectedSystem.value = encryptStorage.getItem(`selectedSystem`)
        selectedFramework.value = encryptStorage.getItem(`selectedFramework`)
       });
    const setSystem = (system = null) => {

      if(!system){
        if(user_systems.value.length == 0){
          return
        }
        selectedSystem.value =  user_systems.value[0].id;

      }else{
        selectedSystem.value =  system
      }

      encryptStorage.setItem(`selectedSystem`, selectedSystem.value)
      store.commit('user/SET_STATE', { selectedSystem:selectedSystem.value})

      selectedFramework.value = null

      system_frameworks.value = []

      let chosenSystem = user_systems.value.filter(user_system => user_system.id ==  selectedSystem.value );
      setTimeout(()=>{
        
        if(chosenSystem[0] && chosenSystem[0].Frameworks && chosenSystem[0].Frameworks.length > 0){
            system_frameworks.value = chosenSystem[0].Frameworks;
            if(system_frameworks.value.some(child => child.identifier ===  encryptStorage.getItem(`selectedFramework`))){
              selectedFramework.value =   encryptStorage.getItem(`selectedFramework`);
            }else{
              selectedFramework.value =   system_frameworks.value[0].identifier;
            }
            encryptStorage.setItem(`selectedFramework`, selectedFramework.value)
            store.commit('user/SET_STATE', { selectedFramework:selectedFramework.value})

        }
      },10)

    }


    onMounted(() => {
      breadcrumb.value = getPath(menuData, routePath.value)
    })
    watch(routePath, routePath => {
      breadcrumb.value = getPath(menuData, routePath)
    })

    setSystem(encryptStorage.getItem(`selectedSystem`))

    return {
      setSystem,
      setFramework,
      organizationName,
      selectedSystem,
      selectedFramework,
      breadcrumb,
      activeItem,
      user_systems,
      show,
      system_frameworks,
      routeDetails,
    }
  },
  data() {
    return {
      viewType: "list",
      loading: false,
    };
  },
  methods: {
    handleChange(key) {
      this.loading = true
      NProgress.start()

      setTimeout(()=>{
        this.loading = false
        NProgress.done()

      },2000)
    },

  
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
