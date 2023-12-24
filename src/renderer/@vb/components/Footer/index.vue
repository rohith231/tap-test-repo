<template>
  <div :class="$style.footer">
    <div :class="$style.footerInner">
      <a
        href="https://h3olabs.com"
        target="_blank"
        rel="noopener noreferrer"
        :class="$style.logo"
      >
        <svg
          version="1.0" width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000"
          preserveAspectRatio="xMidYMid meet">

          <g
            transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path
              d="M107 405 c-32 -7 -60 -15 -63 -17 -3 -3 -4 -40 -2 -81 l3 -76 45 31
              c25 17 94 54 153 83 l109 52 -58 11 c-70 15 -111 14 -187 -3z"/>
            <path
              d="M344 352 c-44 -26 -108 -69 -142 -95 -64 -50 -188 -164 -138 -128
              l28 21 53 -45 c29 -25 58 -45 65 -45 6 0 48 30 91 66 l79 66 0 83 c0 79 1 84
              28 104 45 34 22 24 -64 -27z"/>
          </g>
        </svg>
        <strong class="mr-2">{{ applicationSettings.masterName }}</strong>
      </a>
      <span :class="$style.release">Release {{ packageJson.version }} ({{License.license_name}})</span>
      <!-- <p class="mb-0">
        Copyright © {{ new Date().getFullYear() }}
          <a href="https://h3olabs.com" target="_blank" rel="noopener noreferrer">
              H3olabs.com
          </a>
          |
          <a href="https://h3olabs.com/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
      </p> -->
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const packageJson = require('../../../../../package.json')
      let License = computed(() => store.getters['license/license'].license)
      store.dispatch('license/GET_BY_ID', { payload: {} })
    return {
     applicationSettings,
     packageJson,
     License
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
