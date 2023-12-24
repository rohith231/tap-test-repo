<template>
  <menu-left v-if="applicationSettings.menuLayoutType === 'left'" />
  <menu-top v-if="applicationSettings.menuLayoutType === 'top'" />
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'

export default {
  components: { MenuTop, MenuLeft },
  setup() {
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)

    return {
      applicationSettings,
    }
  },
}
</script>
