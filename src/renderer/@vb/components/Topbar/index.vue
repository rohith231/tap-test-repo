<template>
  <div :class="$style.topbar">
    <!-- <div class="mr-4 d-none d-md-block">
      <vb-issues-history />
    </div> -->
    <div>
      <vb-user-menu />
    </div>
    <!-- <div class="mr-auto">
      <vb-project-management />
    </div> -->
    <!-- <div class="mr-3">
      <vb-actions />
    </div> -->
    <!-- <div class="mr-3">
      <vb-project-management />
    </div> -->
  </div>
</template>

<script>
// import VbIssuesHistory from './IssuesHistory'
// import VbProjectManagement from './ProjectManagement'
// import VbSearch from './Search'
// import VbLanguageSwitcher from './LanguageSwitcher'
// import VbActions from './Actions'
import VbUserMenu from './UserMenu'
// import VbFavPages from './FavPages'
// import VbCart from './Cart'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { notification } from 'ant-design-vue'

export default {
  components: {
    // VbIssuesHistory,
    // VbProjectManagement,
    // VbSearch,
    // VbLanguageSwitcher,
    // VbActions,
    VbUserMenu,
    // VbFavPages,
    // VbCart,
  },
  setup() {
    const defaultColor = '#4b7cf3'
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)

    const changeSettingValue = (value, setting) => {
      store.commit('CHANGE_SETTING', { setting, value })
    }
    const changeSettingEvent = (e, setting) => {
      const { value } = e.target
      store.commit('CHANGE_SETTING', { setting, value })
    }
    const changeSettingSwitch = (e, setting) => {
      const value = !applicationSettings.value[setting]
      store.commit('CHANGE_SETTING', { setting, value })
    }
    const toggleSettings = () => {
      store.commit('CHANGE_SETTING', {
        setting: 'isSidebarOpen',
        value: !applicationSettings.value['isSidebarOpen'],
      })
    }

    const clearCache = () => {
      store.dispatch('auth/CLEAR_CACHE', {}).then((response) => {
        //  console.log(`response CLEAR_CACHE => `)
        //  console.log(response)
        notification.success({
          message: 'Cache clear',
          description: 'You have successfully cleared the cache!',
        })
      })
    }

    return {
      defaultColor,
      applicationSettings,
      clearCache,
      changeSettingValue,
      changeSettingEvent,
      changeSettingSwitch,
      toggleSettings,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
