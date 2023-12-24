<template>
  <a-form :rules="rules" :model="user" label-align="left" layout="vertical" @finish="onSubmit">
    <div class="row">
      <div class="col-lg-6">
        <a-form-item required label="First name" name="first_name">
          <a-input v-model:value="user.first_name" :disabled="disabled" placeholder="First name" />
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item label="Last name">
          <a-input v-model:value="user.last_name" :disabled="disabled" placeholder="Last name" />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item required label="Username" name="user_name">
          <a-input v-model:value="user.user_name" :disabled="disabled" placeholder="Username" />
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item required label="Email" name="email">
          <a-input v-model:value="user.email" :disabled="disabled" placeholder="Email" />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6" v-if="user_id == 'new'">
        <a-form-item required label="Password" name="password">
          <a-input-password
            v-model:value="user.password"
            :disabled="disabled"
            placeholder="Password"
            type="password"
          />
        </a-form-item>
      </div>
      <div class="col-lg-6" v-else>
        <a-form-item label="Password" name="password">
          <a-input-password
            v-model:value="user.password"
            :disabled="disabled"
            placeholder="Password"
            type="password"
          />
        </a-form-item>
      </div>
      <div class="col-lg-6" v-if="user_id == 'new'">
        <a-form-item required label="Confirm Password" name="confirm_password">
          <a-input-password
            v-model:value="user.confirm_password"
            :disabled="disabled"
            placeholder="Confirm Password"
            type="password"
          />
        </a-form-item>
      </div>
      <div class="col-lg-6" v-else>
        <a-form-item label="Confirm Password" name="confirm_password">
          <a-input-password
            v-model:value="user.confirm_password"
            :disabled="disabled"
            placeholder="Confirm Password"
            type="password"
          />
        </a-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="Mobile Number">
          <a-input
            v-model:value="user.mobile_number"
            :disabled="disabled"
            placeholder="Mobile Number"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Phone Number">
          <a-input
            v-model:value="user.phone_number"
            :disabled="disabled"
            placeholder="Phone Number"
          />
        </a-form-item>
      </div>
      <div class="col-lg-2">
        <a-form-item label="Ext">
          <a-input v-model:value="user.extension" :disabled="disabled" placeholder="Ext" />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="User roles">
          <a-select
            required
            name="Roles"
            v-model:value="user.Roles"
            :default-value="user.Roles"
            :disabled="disabled"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              allRoles.map((role) => {
                return { value: role.id, label: role.name }
              })
            "
          >
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item label="User systems">
          <a-select
            required
            name="Systems"
            :disabled="disabled"
            v-model:value="user.Systems"
            :default-value="user.Systems"
            mode="multiple"
            style="width: 100% !important"
            placeholder="Please select"
            :options="
              allSystems.map((system) => {
                return { value: system.id, label: system.name }
              })
            "
          >
          </a-select>
        </a-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="user.change_pass_in_login" :disabled="disabled"
            >User must change password on first login</a-checkbox
          >
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="user.cannot_change_pass" :disabled="disabled"
            >User cannot change password</a-checkbox
          >
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="user.disable" :disabled="disabled">Disable user</a-checkbox>
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <div class="row">
          <div class="col-lg-6">
            <a-form-item>
              <a-checkbox v-model:checked="user.account_expires" :disabled="disabled"
                >Expire user account</a-checkbox
              >
            </a-form-item>
          </div>
          <div class="col-lg-6">
            Days :
            <a-date-picker
              v-model:value="user.expireAt"
              :default-value="user.expireAt"
              :disabled="disabled || !user.account_expires"
              placeholder="Expire At"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <a-typography-title :level="5">User Settings</a-typography-title>
      </div>
      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="user.settings.notifications" :disabled="disabled">
            Notification</a-checkbox
          >
        </a-form-item>
      </div>
    </div>
    <div class="card-footer">
      <button type="submit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button @click="$router.push({ path: '/users' })" class="btn btn-light px-5 pull-right">
        Cancel
      </button>
    </div>
  </a-form>
</template>
<script>
import { ref, toRaw, computed } from 'vue'
import { useStore } from 'vuex'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  setup(props, { emit }) {
    const previewVisible = false
    const previewImage = ''
    const store = useStore()
    store.dispatch('roles/GET_ROLES', { payload: { pageNumber: -1, itemsPerPage: -1 } })
    store.dispatch('systems/GET_ALL', { payload: { pageNumber: -1, itemsPerPage: -1 } })
    const allRoles = computed(() => store.getters['roles/roles'].list)
    const allSystems = computed(() => store.getters['systems/systems'].list)
    const rules = {
      first_name: [
        {
          required: true,
          message: 'Please input your first name!',
          trigger: 'change',
        },
      ],
      email: [
        {
          required: true,
          message: 'Please input your email!',
          trigger: 'change',
        },
      ],
      user_name: [
        {
          required: true,
          message: 'Please input your username!',
          trigger: 'change',
        },
      ],
      password: [
        {
          required: props.data.user_id == 'new',
          message: 'Please input your password!',
          trigger: 'change',
        },
      ],
      confirm_password: [
        {
          required: props.data.user_id == 'new',
          message: 'Please input your confirm password!',
          trigger: 'change',
        },
      ],
    }
    let User = computed(() => store.getters['users/users'].user)

    const user = computed(() => {
      User.value.Roles.map(function (role, index) {
        if (typeof role === 'object') {
          User.value.Roles[index] = role.id
        }
      })
      User.value.Systems.map(function (system, index) {
        if (typeof system === 'object') {
          User.value.Systems[index] = system.id
        }
      })
      return User.value
    })
    store.dispatch('users/GET_BY_ID', { payload: { id: props.data.user_id } })
    const user_systems = []
    const roles = []
    let buttonLable = computed(() => (props.data.user_id == 'new' ? 'Save' : 'Update'))

    const onSubmit = () => {
      // console.log('submit!', toRaw(user))
      if (props.data.user_id != 'new') {
        store
          .dispatch('users/UPDATE', {
            payload: {
              ...toRaw(user).value,
            },
          })
          .then(() => {})
      } else {
        store
          .dispatch('users/ADD', {
            payload: {
              ...toRaw(user).value,
            },
          })
          .then(() => {})
      }
    }

    const handleCancel = () => {
      this.previewVisible = false
    }

    return {
      handleCancel,
      onSubmit,
      allRoles,
      allSystems,
      previewImage,
      previewVisible,
      user,
      roles,
      rules,
      buttonLable,
      user_systems,
    }
  },
}
</script>
