<template>
  <a href="javascript: void(0);" @click="showModal()">
    <a-badge>
      <i class="fas fa-bullhorn" />
    </a-badge>
  </a>
  <a-modal v-model:visible="visible" title="Send notification">
    <template #footer>
      <a-button key="back" @click="handleCancel">
        Cancel
      </a-button>
      <a-button key="submit" type="primary" @click="sendNotification">
        Send Notification
      </a-button>
    </template>
    <a-form :rules="rules" ref="ruleForm" :model="form" :label-col="{ span: 5 }">
      <a-form-item>
        <a-radio-group
          :options="plainOptions"
          :default-value="form.type"
          :value="form.type"
          @change="changeOption"
        />
      </a-form-item>
      <template v-if="form.type === 'Systems'">
        <a-form-item label="User roles">
          <a-select
            v-model="roles"
            required
            name="roles"
            :disabled="disabled"
            v-model:value="form.selectedRoles"
            :default-value="form.selectedRoles"
            @change="roleChange"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              allRoles.map(role => {
                return { value: role.id, label: role.name }
              })
            "
          >
          </a-select>
        </a-form-item>

        <a-form-item label="Systems">
          <a-select
            required
            name="systems"
            :disabled="disabled"
            v-model:value="form.selectedSystems"
            :default-value="form.selectedSystems"
            @change="systemChange"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              allSystems.map(system => {
                return { value: system.id, label: system.name }
              })
            "
          >
          </a-select>
        </a-form-item>
      </template>
      <template v-if="form.type === 'Users'">
        <a-form-item label="User roles">
          <a-select
            required
            name="roles"
            :disabled="disabled"
            v-model:value="form.selectedRoles"
            :default-value="form.selectedRoles"
            @change="roleChange"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              allRoles.map(role => {
                return { value: role.id, label: role.name }
              })
            "
          >
          </a-select>
        </a-form-item>
        <a-form-item label="Users">
          <a-select
            required
            name="users"
            :disabled="disabled"
            v-model:value="form.selectedUsers"
            :default-value="form.selectedUsers"
            @change="userChange"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              filteredUsers.map(user => {
                return { value: user.id, label: user.display_name }
              })
            "
          >
          </a-select>
        </a-form-item>
      </template>
      <a-form-item ref="message" label="Message" name="message">
        <a-textarea required placeholder="Message..." :rows="4" v-model:value="form.message" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { notificationAPI } from '@/services/notification'
import { notification } from 'ant-design-vue'

export default {
  components: {},
  setup(props) {
    const store = useStore();

    store.dispatch('systems/GET_ALL', { payload: { pageNumber: -1, itemsPerPage: -1 } })
    store.dispatch('roles/GET_ROLES', { payload: { pageNumber: -1, itemsPerPage: -1 } })
    store.dispatch('users/GET_USERS', { payload: { pageNumber: -1, itemsPerPage: -1 } })

    const visible = ref(false);
    const plainOptions = ['Organization', 'Systems', 'Users'];
    const rules = {};

    const allSystems = computed(() => [
      { id: 'All Systems', name: 'All Systems' },
      ...store.getters['systems/systems'].list,
    ])

    const allRoles = computed(() => [
      { id: 'All Roles', name: 'All Roles' },
      ...store.getters['roles/roles'].list,
    ])
    const allUsers = computed(() => [
      { id: 'All Users', display_name: 'All Users', Roles: [] },
      ...store.getters['users/users'].list,
    ])

    let filteredUsers = computed(() => allUsers.value);
    let form = ref({
      type: 'Organization',
      selectedSystems: ['All Systems'],
      selectedRoles: ['All Roles'],
      selectedUsers: ['All Users'],
      message: '',
    });

    const showModal = () => {
      visible.value = true
      resetForm()
    }

    const swapForms = () => {
      form.value.selectedSystems = ['All Systems']
      form.value.selectedRoles = ['All Roles']
      form.value.selectedUsers = ['All Users']
    }

    const resetForm = () => {
      form.value = {
        type: 'Organization',
        selectedSystems: ['All Systems'],
        selectedRoles: ['All Roles'],
        selectedUsers: ['All Users'],
        message: '',
      }
    }

    const changeOption = (e) => {
      form.value.type = e.target.value
      swapForms()
    }

    const handleCancel = () => {
      visible.value = false
    }

    const sendNotification = () => {
      notificationAPI({ form: form.value, allSystems: allSystems.value.slice(1), allRoles: allRoles.value.slice(1), allUsers: allUsers.value.slice(1)}).then(response => {
        if (response.data.statusCode) {
          notification.success({
            message: 'Notification sent',
            description: response.data.result,
          })
        } else {
          notification.error({
            message: 'Notification Not sent',
            description: response.data.result,
          })
        }
        handleCancel()
      })
    }

    const roleChange = (value) => {
      let index = value.indexOf('All Roles');
      if(index == 0 && value.length > 1) { form.value['selectedRoles'] = value.slice(1) }
      if(index > 0) { form.value['selectedRoles'] = ['All Roles']}
      if(value.length == 0) { form.value['selectedRoles'] = ['All Roles']}
    }

    const systemChange = (value) => {
      let index = value.indexOf('All Systems');
      if(index == 0 && value.length > 1) { form.value['selectedSystems'] = value.slice(1) }
      if(index > 0) { form.value['selectedSystems'] = ['All Systems']}
      if(value.length == 0) { form.value['selectedSystems'] = ['All Systems']}
    }

    const userChange = (value) => {
      let index = value.indexOf('All Users');
      if(index == 0 && value.length > 1) { form.value['selectedUsers'] = value.slice(1) }
      if(index > 0) { form.value['selectedUsers'] = ['All Users']}
      if(value.length == 0) { form.value['selectedUsers'] = ['All Users']}
    }

    return {
      form,
      filteredUsers,
      allSystems,
      allRoles,
      allUsers,
      visible,
      plainOptions,
      rules,
      showModal,
      swapForms,
      resetForm,
      changeOption,
      roleChange,
      systemChange,
      userChange,
      handleCancel,
      sendNotification
    }
  },
}
</script>
