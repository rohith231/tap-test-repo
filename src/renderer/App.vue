<template>
  <styleLoader />
  <localization />
</template>

<script>
import { computed, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import qs from 'qs'
import Localization from '@/localization'
import StyleLoader from '@/styleLoader'
import { message } from 'ant-design-vue'
var notifier = require('../../common/Notifier')
import apiClient from '@/services/axios';


export default {
  name: 'App',
  components: { Localization, StyleLoader },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const masterName = computed(() => store.getters.applicationSettings.masterName)
    const routeTitle = computed(() => route.meta.title)
    const currentRoute = computed(() => route)
    const authorized = computed(() => store.getters['user/user'].authorized)
    const hasConnection = computed(() => store.getters['database/hasConnection'])



    message.config({
      top: '60px',
      duration: 1.5,
      maxCount: 3,
    });
    // watch page title change
    watch(
      [masterName, routeTitle],
      ([masterName, routeTitle]) => (document.title = `${masterName} | ${routeTitle}` || `${masterName}`),
    )

    // initial auth check
    onBeforeMount(async() => {
      message.loading({ content: 'Loading...', key: 'updatable' });

     await store.dispatch('database/DATABASE_CONNECTION', { payload: { operation: 'check' } }).then(response => {
          if(!hasConnection.value){
              router.push({
                path: '/auth/database/null',
                query: { redirect: route.fullPath },
              })
            }
          }).catch(error => {
            router.push({
                path: '/auth/database/null',
                query: { redirect: route.fullPath },
              })
          })

          if (hasConnection.value) {
            setTimeout(() => {
              store
                .dispatch('organization/GET', { payload: {} })
                .then(() => {
                  message.success({ content: 'Application Loaded', key: 'updatable' })
                  //store.dispatch('user/LOAD_CURRENT_ACCOUNT')
                })
                .catch((e) => {
                  // console.log(e)
                  // message.error({ content: e })
                })
            }, 1000)
          }

    })

    // redirect if authorized and current page is login
    watch(authorized, authorized => {
      if (authorized) {
        const query = qs.parse(currentRoute.value.fullPath.split('?')[1], {
          ignoreQueryPrefix: true,
        })
        router.push(query.redirect || '/')
      }
    })

 },
}
</script>

