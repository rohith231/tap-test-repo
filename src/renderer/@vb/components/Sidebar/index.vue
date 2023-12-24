<template>
  <div>
    <div
      :class="{
        [$style.vb__sidebar]: true,
        [$style.vb__sidebar__toggled]: applicationSettings.isSidebarOpen,
      }"
    >
      <perfect-scrollbar :style="{ height: '100%' }">
        <div :class="$style.vb__sidebar__inner">
          <div style="padding: 20px 15px">
            <a
              href="javascript: void(0);"
              :class="$style.vb__sidebar__close"
              class="fe fe-x"
              @click="toggleSettings()"
            />
            <div class="mb-4">
              <b><strong>Notifications</strong></b>

              <button
                type="button"
                @click="toggle_read(null)"
                class="btn btn-primary d-md-block btn-sm"
                style="margin-left: 190px; margin-top: -25px"
              >
                Read All
              </button>
            </div>
            <v-divider></v-divider>
          </div>

          <div
            v-infinite-scroll="handleInfiniteOnLoad"
            class="demo-infinite-container"
            :infinite-scroll-disabled="busy"
            :infinite-scroll-distance="10"
          >
            <ul class="list-unstyled mb-0">
              <li
                v-for="(notification, index) in notifications"
                :key="index"
                :style="
                  notification.is_read
                    ? { 'border-left': '4px solid green !important' }
                    : { 'border-left': '4px solid orange !important' }
                "
                style="border-radius: 2px"
                :class="$style.item"
                @click="toggle_read(notification)"
              >
                <a href="javascript: void(0);" :class="$style.itemLink">
                  <div :class="$style.itemPic">
                    <i class="fas fa-bell"></i>
                  </div>
                  <div class="mr-2">
                    <div>{{ notification.text }}</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <pagination
            :total="total"
            :page-number="pageNumber"
            :items-per-page="itemsPerPage"
            @changePagination="changePagination($event)"
          />
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import throttle from 'lodash/throttle'
import VbColorPicker from './partials/colorPicker'
import infiniteScroll from 'vue-infinite-scroll'
import pagination from '@/@vb/components/Pagination/2'

export default {
  components: { pagination },
  directives: { infiniteScroll },
  setup() {
    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    const defaultColor = '#4b7cf3'
    const activeKey = ref(['1'])
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const notifications = computed(() => store.getters['notifications/list'])
    const total = computed(() => store.getters['notifications/total'])
    let busy = false
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
    const togglePreselectedThemes = () => {
      store.commit('CHANGE_SETTING', {
        setting: 'isPreselectedOpen',
        value: !applicationSettings.value['isPreselectedOpen'],
      })
    }
    const selectColor = throttle((color) => {
      store.commit('SET_PRIMARY_COLOR', { color })
    }, 200)
    const resetColor = () => {
      store.commit('SET_PRIMARY_COLOR', { color: defaultColor })
    }
    const getData = () => {
      store.dispatch('notifications/GET', {
        payload: { pageNumber: pageNumber.value, itemsPerPage: itemsPerPage.value },
      })
    }

    const changePagination = (data) => {
      itemsPerPage.value = data.itemsPerPage || itemsPerPage.value
      pageNumber.value = data.pageNumber || 1
      getData()
    }
    const handleInfiniteOnLoad = () => {
      const data = this.data
      this.loading = true
      if (data.length > 14) {
        this.$message.warning('Infinite List loaded all')
        busy = true
        this.loading = false
        return
      }
      this.fetchData((res) => {
        this.data = data.concat(res.results)
        this.loading = false
      })
    }

    return {
      handleInfiniteOnLoad,
      changePagination,
      busy,
      defaultColor,
      activeKey,
      applicationSettings,
      notifications,
      changeSettingValue,
      changeSettingEvent,
      changeSettingSwitch,
      toggleSettings,
      togglePreselectedThemes,
      selectColor,
      resetColor,
      itemsPerPage,
      pageNumber,
      total,
    }
  },
  methods: {
    toggle_read(notification) {
      this.emitter.emit('notification-action', notification)
    },
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>

<style scoped>
.demo-infinite-container {
  overflow: auto;
  height: 640px;
}
</style>