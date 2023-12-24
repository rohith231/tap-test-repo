<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <a-badge :count="total_count">
        <i class="fe fe-bell" :class="$style.icon" />
      </a-badge>
    </div>
    <template #overlay>
      <div class="card vb__utils__shadow width-350">
        <div class="card-body p-0">
          <ul class="list-unstyled mb-0">
            <template v-for="(notification, index) in notifications" :key="index">
              <li
                @onClick="onMouseEnter"
                :style="
                  notification.is_read
                    ? { 'border-left': '4px solid green !important' }
                    : { 'border-left': '4px solid orange !important' }
                "
                style="border-radius: 2px"
                :class="$style.item"
                @click="toggle_read(notification)"
                v-if="index < 5"
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
            </template>
            <v-divider></v-divider>
            <h5
              class="px-3 py-1 text-center"
              v-if="notifications.length > 0"
              @click="toggleSettings"
            >
              <a href="javascript: void(0);"> See All </a>
            </h5>
            <h5 class="px-3 py-1 text-center" v-else>
              <a href="javascript: void(0);"> No notification </a>
            </h5>
          </ul>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import useEmitter from '@/composables/useEmitter'
import { notification } from 'ant-design-vue'

export default {
  components: {},
  setup() {
    const store = useStore()
    store.dispatch('notifications/GET', { payload: { pageNumber: 1, itemsPerPage: 10 } })
    let total_count = ref(0)
    const unread_count = computed(() => store.getters['notifications/unReadCount'])
    const notifications = computed(() => store.getters['notifications/list'])
    const applicationSettings = computed(() => store.getters.applicationSettings)
    window.myapi.onResponse((args) => {
      // console.log(args)
      // if (args.receiver_id && store.getters['user/user'] && args.receiver_id !== store.getters['user/user'].id) {
      //   return;
      // }
      notification.destroy()
      notification.info({
        message: 'Notification',
        description: args.text,
      })

      notifications.value.unshift({
        is_read: false,
        id: args.id,
        text: args.text,
        createdAt: args.createdAt,
      })
      total_count.value = total_count.value + 1
      // this.selected = this.notifications.map((notification, index) => (notification.is_read === false) ? index : null);
      // this.selected = this.selected.filter((item) => item !== null);
    })

    const formatedDataFromNow = (value) => {
      if (!value) {
        return ''
      }
      return moment(value).fromNow()
    }
    const toggleSettings = () => {
      store.commit('CHANGE_SETTING', {
        setting: 'isSidebarOpen',
        value: !applicationSettings.value['isSidebarOpen'],
      })
    }
    const emitter = useEmitter()
    emitter.on('notification-action', (data) => toggle_read(data))

    const toggle_read = (notification) => {
      var action = 'read'
      var list_notifications = notification ? [notification.id] : null
      if (notification) {
        notification.is_read = !notification.is_read
        if (notification.is_read) {
          if (total_count.value != '99+' && total_count.value != 0) {
            total_count.value--
          }
        } else {
          action = 'unRead'
          if (total_count.value != '99+') {
            total_count.value++
          }
        }
      } else {
        total_count.value = 0
        notifications.value.forEach((element, index) => {
          notifications.value[index].is_read = true
        })
      }

      store.dispatch('notifications/ADD_ACTION', {
        payload: { action, notifications: list_notifications },
      })
    }

    const onMouseEnter = (e) => {
      e.stopPropagation()
      e.preventDefault()
    }
    return {
      toggleSettings,
      onMouseEnter,
      toggle_read,
      formatedDataFromNow,
      notifications,
      unread_count,
      total_count,
    }
  },
  watch: {
    unread_count(nVal, oldVal) {
      if (this.unread_count == '99+') return

      this.total_count = this.unread_count > 99 ? '99+' : this.unread_count
      this.total_count = this.unread_count < 0 ? 0 : this.unread_count
    },
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
