<template>
  <menu-left v-if="!applicationSettings.isMobileView" />
  <div v-if="applicationSettings.isMobileView">
    <div :class="$style.handler" @click="toggleMobileMenu">
      <div :class="$style.handlerIcon"></div>
    </div>
    <a-drawer
      :closable="false"
      :visible="applicationSettings.isMobileMenuOpen"
      placement="left"
      :wrap-class-name="$style.mobileMenu"
      @close="toggleMobileMenu"
    >
      <menu-left />
    </a-drawer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import MenuLeft from './MenuLeft'

export default {
  components: {  MenuLeft },
  setup() {
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)

    const toggleMobileMenu = () => {
      store.commit('CHANGE_SETTING', {
        setting: 'isMobileMenuOpen',
        value: !applicationSettings.value['isMobileMenuOpen'],
      })
    }

    return {
      applicationSettings,
      toggleMobileMenu,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
