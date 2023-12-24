<template>
  <div
    :class="{
      [$style.menuSimply]: true,
      [$style.menuSimply__white]: applicationSettings.menuColor === 'white',
      [$style.menuSimply__gray]: applicationSettings.menuColor === 'gray',
      [$style.menuSimply__red]: applicationSettings.menuColor === 'red',
      [$style.menuSimply__antiquewhite]: applicationSettings.menuColor === 'antiquewhite',
      [$style.menuSimply__aqua]: applicationSettings.menuColor === 'aqua',
      [$style.menuSimply__blue]: applicationSettings.menuColor === 'blue',
      [$style.menuSimply__green]: applicationSettings.menuColor === 'green',
      [$style.menuSimply__orange]: applicationSettings.menuColor === 'orange',
      [$style.menuSimply__purple]: applicationSettings.menuColor === 'purple',
    }"
  >
    <router-link :to="'/'">
      <div :class="$style.menuSimply__logo" class="d-none d-md-block">
        <div :class="$style.menuSimply__logo__letter">
          <svg
            version="1.0"
            width="48.000000pt"
            height="48.000000pt"
            viewBox="0 0 48.000000 48.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
              fill="#000000"
              stroke="none"
            >
              <path
                d="M107 405 c-32 -7 -60 -15 -63 -17 -3 -3 -4 -40 -2 -81 l3 -76 45 31
        c25 17 94 54 153 83 l109 52 -58 11 c-70 15 -111 14 -187 -3z"
              />
              <path
                d="M344 352 c-44 -26 -108 -69 -142 -95 -64 -50 -188 -164 -138 -128
        l28 21 53 -45 c29 -25 58 -45 65 -45 6 0 48 30 91 66 l79 66 0 83 c0 79 1 84
        28 104 45 34 22 24 -64 -27z"
              />
            </g>
          </svg>
        </div>
        <div :class="$style.menuSimply__logo__name">{{ organizationName }}</div>
      </div>
    </router-link>
    <!-- <div class="mr-auto d-block">
      <vb-menu-pages />
    </div> -->

    <!-- <div class="mr-4">
      <vb-fav-pages />
    </div>
    <div class="mr-auto mr-md-1">
      <vb-search />
    </div>

    <div class="mr-3 d-none d-md-block">
      <vb-notifications />
    </div> -->

    <!-- <div class="mr-3 d-none d-sm-block">
      <a-tooltip placement="bottom">
        <template #title>
          <span> Refresh </span>
        </template>
        <a href="javascript: void(0);" @click="$router.go(0)">
          <a-badge dot :offset="[-1, 12]">
            <i class="fas fa-sync-alt" />
          </a-badge>
        </a>
      </a-tooltip>
    </div> -->
    <a-row class="w-100 flex-row-reverse">
      <div class="d-none d-md-block m-2">
        <vb-user-menu />
      </div>
      <div class="d-none d-sm-block m-2">
        <a-tooltip placement="bottom">
          <template #title>
            <span> Check for update </span>
          </template>
          <a href="javascript: void(0);" @click="checkUpdate">
            <!-- <a-badge dot :offset="[-1, 12]"> -->
              <i class="fas fa-arrow-alt-circle-down" />
            <!-- </a-badge> -->
          </a>
        </a-tooltip>
      </div>
      <div class="d-none d-sm-block m-2">
        <router-link to="/users/list">
          <a-tooltip placement="bottom">
            <template #title>
              <span> Settings </span>
            </template>
            <i class="fas fa-gear" />
          </a-tooltip>
        </router-link>
      </div>
    </a-row>
  </div>
</template>

<script>
import { computed } from 'vue'
// import VbMenuPages from './MenuPages'
// import VbActions from './Actions'
// import VbNotifications from './Notifications'
import VbUserMenu from './UserMenu'
import VbProjectManagement from './ProjectManagement'
// import VbSearch from './Search'
// import VbFavPages from './FavPages'
import { useStore } from 'vuex'
import { CHECK_FOR_UPDATE_PENDING } from './ipc.constants'
import { notification } from 'ant-design-vue'
// import { version as currentAppVersion } from 'package.json'

export default {
  components: {
    // VbMenuPages,
    // VbActions,
    // VbNotifications,
    VbUserMenu,
    VbUserMenu,
    // VbFavPages,
    // VbProjectManagement,
    // VbSearch,
  },

  setup() {
    const defaultColor = '#4b7cf3'
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const organizationName = computed(() => store.getters['organization/organization'].name)

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

    window.myapi.onResponse((updateInfo) => {
      // console.log("update info");
      // console.log(updateInfo)
      if (updateInfo) {
        notification.success(updateInfo)
      }
    })

    const checkUpdate = () => {
      // console.log('checking for update', CHECK_FOR_UPDATE_PENDING, window)
      window.myapi.request(CHECK_FOR_UPDATE_PENDING)
    }

    return {
      organizationName,
      defaultColor,
      applicationSettings,
      changeSettingValue,
      changeSettingEvent,
      changeSettingSwitch,
      toggleSettings,
      checkUpdate,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>