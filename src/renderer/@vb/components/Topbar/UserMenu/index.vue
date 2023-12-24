<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <a-avatar shape="square" size="large" :class="$style.avatar">
          {{user.display_name ? user.display_name.charAt(0).toUpperCase() : ''}}
      </a-avatar>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <div>
            <strong>{{ $t('topBar.profileMenu.hello') }}, {{ user.display_name || 'Anonymous' }}</strong>
          </div>

              <div>
            <strong class="mr-1">{{ $t('topBar.profileMenu.role') }}:</strong>
        <span>
          <a-tag v-for="role in user.Roles" :key="role" color="blue">{{ role.name }}</a-tag>
        </span>
        <span v-if="user.Roles.length == 0">
          ---
        </span>
          </div>


        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <div>
            <strong class="mr-1">{{ $t('topBar.profileMenu.email') }}:</strong>
            {{ user.email || '—' }}
          </div>
          <div>
            <strong class="mr-1">{{ $t('topBar.profileMenu.phone') }}:</strong>
            {{ user.mobile_number || '—' }}
          </div>
        </a-menu-item>
          <a-menu-divider />
          <a-menu-item>
          <router-link :to='"/users/profile/" + user.id'>
              <i class="fe fe-user mr-2" />
              {{ $t('topBar.profileMenu.editProfile') }}
          </router-link>
          </a-menu-item>
        <a-menu-divider />
            <a-menu-item>
                <a
                  href="javascript: void(0);"
                  @click="changeSettingValue(applicationSettings.theme === 'default' ? 'dark' : 'default', 'theme')"
                >
                <span v-if="applicationSettings.theme === 'default'">  <i class="fas fa-moon mr-2" />  Dark Theme</span>
                <span v-if="applicationSettings.theme !== 'default'">  <i class="fas fa-sun mr-2" /> Light Theme</span>
                </a>
            </a-menu-item>
           <a-menu-divider />
            <a-menu-item>
                  <a-popconfirm placement="bottom" ok-text="Yes" cancel-text="No" @confirm="clearCache">
                    <template #title>
                      <p>Clear cache will remove all your setup data on this machine</p>
                      <p>Are you sure you want clear the cache?</p>
                    </template>
                    <a-tooltip placement="bottom">
                    <template #title>
                      <span> Clean Cache </span>
                    </template>
                    <a
                      href="javascript: void(0);"
                    >
                      <i class="fas fa-trash mr-2" /> Clean Cache
                    </a>
                  </a-tooltip>
                </a-popconfirm>
            </a-menu-item>

        <a-menu-divider />
          <a href="javascript: void(0);" @click="logout">
            <a-menu-item>
                <i class="fe fe-log-out mr-2" />
                {{ $t('topBar.profileMenu.logout') }}
            </a-menu-item>
          </a>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { notification } from 'ant-design-vue'

export default {
  components: {
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.getters['user/user'])
    const applicationSettings = computed(() => store.getters.applicationSettings)

    const logout = () => {
      store.dispatch('user/LOGOUT')
    }


    const changeSettingValue = (value, setting) => {
      store.commit('CHANGE_SETTING', { setting, value })
    }
    const clearCache = () => {
       store.dispatch('auth/CLEAR_CACHE', {}).then(response => {
            notification.success({
                message: 'Cache clear',
                description: 'You have successfully cleared the cache!',
              })
          })
    }
    return {
      user,
      applicationSettings,
      clearCache,
      changeSettingValue,
      logout,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
