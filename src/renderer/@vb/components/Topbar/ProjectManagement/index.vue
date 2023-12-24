<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <i class="fas fa-tools" :class="$style.icon" />
      <span class="d-none d-xl-inline">System Configure</span>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item-group title="Setup">
          <router-link to="#" :class="$style.breadcrumbLink">
            <a-menu-item @click="openTab('/auth/database/existing')"> Database </a-menu-item>
          </router-link>
          <a-menu-item @click="openTab('/interrogator')"> Interrogator </a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="System Optimization">
          <!-- <a-menu-item @click="showActionConfirm('DELETE_ALL_NOTIFIONS')">
            <a href="javascript: void(0);">Delete All Notifications</a>
          </a-menu-item> -->

          <!-- <a-menu-item @click="showActionConfirm('DELETE_ALL_LOGS')">
            <a href="javascript: void(0);">Delete All Logs</a>
          </a-menu-item> -->
          <!-- <a-menu-item @click="showActionConfirm('RESET_DATABASE')">
            <a href="javascript: void(0);">Reset Database</a>
          </a-menu-item> -->
        </a-menu-item-group>
        <a-menu-divider />
        <a-menu-item @click="openTab('/settings')">
          <a href="javascript: void(0);">
            <i class="fe fe-settings mr-2" />
            Settings
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import store from '@/store'
import { Modal } from 'ant-design-vue'
export default {
  methods: {
    openTab(url) {
      this.emitter.emit('open-new-tab', {
        url,
      })
    },
    showActionConfirm(action) {
      var title, content
      switch (action) {
        case 'DELETE_ALL_NOTIFIONS':
          title = 'Are you sure you want delete all notifications ?'
          content = 'You will not see the notifications again'
          break
        case 'DELETE_ALL_LOGS':
          title = 'Are you sure you want delete all logs ?'
          content = 'You will not see the logs again'
          break
        case 'RESET_DATABASE':
          title = 'Are you sure you want reset database ?'
          content = 'this action will reset your data to default'
          break
        case 'DATABASE_BACKUP':
          title = 'Database backup'
          content = 'You will not see this notifications again'
          break
        default:
          break
      }
      Modal.confirm({
        title: title,
        content: content,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          store.dispatch('setting/SYSTEM_OPTIMIZATION', { payload: { tasks: [action] } })
          // console.log('OK')
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style lang="scss" module>
@import './style.module.scss';
</style>
