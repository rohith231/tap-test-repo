<template>
    <a-spin :spinning="!hasConnection && route.path != '/auth/database/null'"  size="large" :delay="500" tip="Checking Database Connection...">
      <a-layout class="vb__layout">
        <a-layout-content>
          <div
            :class="{
              [$style.container]: true,
              vb__layout__squaredBorders:applicationSettings.isSquaredBorders,
              vb__layout__cardsShadow:applicationSettings.isCardShadow,
              vb__layout__borderless:applicationSettings.isBorderless,
              [$style.white]:applicationSettings.authPagesColor === 'white',
              [$style.gray]:applicationSettings.authPagesColor === 'gray',

            }"
            :style="{
              backgroundImage:
              applicationSettings.authPagesColor === 'image'
                  ? `url(resources/images/content/photos/8.jpeg)`
                  : 'none',
            }"
          >
            <div
              :class="{
                [$style.topbar]: true,
                [$style.topbarGray]:applicationSettings.isGrayTopbar,
              }"
            >
              <div :class="$style.logoContainer">
                <div :class="$style.logo">
             <router-link :to="'/'" >
                      <svg
                        version="1.0"
                        width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000"
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
             </router-link>
                  <div :class="$style.name">
                    {{applicationSettings.masterName }}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <router-view v-slot="{ Component }">
                <transition :name="applicationSettings.routerAnimation" mode="out-in">
                  <component :is="Component" />
                </transition>
              </router-view>
            </div>
            <div class="pb-5">
              <!-- <ul
                class="list-unstyled d-flex mb-0 flex-wrap justify-content-center"
                :class="[$style.footerNav]"
              >
                <li>
                  <a href="https://h3olabs.com/privacy-policy" target="_blank">Terms of Use</a>
                </li>
                <li class="active list-inline-item">
                  <a href="https://h3olabs.com/contact" target="_blank">Compliance</a>
                </li>
                <li>
                  <a href="https://h3olabs.com/contact" target="_blank">Support</a>
                </li>
                <li>
                  <a href="https://h3olabs.com/cybersecurity-services" target="_blank">Services</a>
                </li>
                <li>
                  <a href="https://h3olabs.com/about" target="_blank">About</a>
                </li>
                <li>
                  <a href="https://h3olabs.com/htap" target="_blank">Software</a>
                </li>
              </ul> -->
              <div class="text-center">
                Copyright © {{ new Date().getFullYear() }}
                <!-- <a href="https://h3olabs.com" target="_blank" rel="noopener noreferrer">
                  H3olabs.com
                </a>
                |
                <a href="https://h3olabs.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a> -->
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </a-spin>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'AuthLayout',
   setup() {
    const route = useRoute()
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const hasConnection = computed(() => store.getters['database/hasConnection'])

    return {
      applicationSettings,
      hasConnection,
      route
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
