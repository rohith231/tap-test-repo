/* eslint-disable vue/valid-v-model */
<template>
  <div>
    <div class="row">
      <div class="col-md-12 vb__utils__heading">
        <strong v-if="type == 'credentials'"> System Credentials </strong>
        <strong v-else-if="type == 'control'"> Control Approval </strong>
        <strong v-else-if="type == 'ato'"> ATO Approval </strong>
      </div>
      <br />
      <br />

      <div class="col-lg-3 col-md-12">
        <div class="card-placeholder">
          <div class="card-body">
            <vb-widgets-lists-22 @changeSystem="changeSystem($event)" />
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-md-12">
        <div class="card card-top card-top-primary" v-if="system.id">
          <div class="card-header py-0">
            <div class="card-header-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
                <h5 class="mb-0">
                  <div class="vb__utils__heading">
                    <strong>
                      {{ system.name }}
                    </strong>
                  </div>
                </h5>
              </div>
              <div>
                <a href="javascript: void(0);" @click="add" class="btn btn-light mr-2">
                  <i class="fas fa-plus-square"></i>
                  Add new
                  <span v-if="type == 'credentials'"> credentials</span>
                  <span v-else> step</span>
                </a>
              </div>
            </div>
          </div>
          <div class="card-body" style="height: 450px; overflow: scroll">
            <template v-if="loading">
              <a-skeleton active />
              <a-skeleton active />
              <a-skeleton active />
            </template>
            <template v-else-if="type == 'credentials'">
              <a-collapse accordion v-for="(item, index) in system_credentials" :key="index">
                <a-collapse-panel :header="item.name" key="1">
                  <template #extra>
                    <a-button
                      type="danger"
                      size="small"
                      class="mr-3 mb-3 pull-right"
                      @click="remove(index)"
                      ><i class="fe fe-trash mr-1" /> Remove</a-button
                    ></template
                  >

                  <a-form label-align="left" layout="vertical">
                    <div class="row">
                      <div class="col-lg-12">
                        <a-form-item label="Credential Name">
                          <a-input v-model:value="item.name" placeholder="Credential Name" />
                        </a-form-item>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <a-form-item label="Username">
                          <a-input v-model:value="item.username" placeholder="Username" />
                        </a-form-item>
                      </div>
                      <div class="col-lg-3">
                        <a-form-item label="Password">
                          <a-input-password
                            v-model:value="item.password"
                            @keyup="setPassword(index)"
                            placeholder="Password"
                            type="password"
                          />
                        </a-form-item>
                      </div>

                      <div class="col-lg-3">
                        <a-form-item label="Key">
                          <a-upload
                            :max-count="1"
                            @change="handleFileUpload"
                            :before-upload="beforeUpload"
                            accept=".pem"
                            list-type="picture"
                          >
                            <a-button @click="uploadSshKey(index)">
                              <upload-outlined></upload-outlined>
                              <span v-if="item.ssh_private_key && item.ssh_private_key.length > 0"
                                >Change Key File</span
                              >
                              <span v-else>Select Key File</span>
                            </a-button>
                          </a-upload>
                        </a-form-item>
                      </div>
                    </div>
                  </a-form>
                </a-collapse-panel>
              </a-collapse>
            </template>
            <template v-else>
              <a-collapse accordion v-for="(item, index) in approval_process" :key="index">
                <a-collapse-panel :header="item.name" key="1">
                  <template #extra>
                    <a-button
                      type="danger"
                      size="small"
                      class="mr-3 mb-3 pull-right"
                      @click="remove(index)"
                      :disabled="['Create', 'Auth', 'Edit'].includes(item.label)"
                      ><i class="fe fe-trash mr-1" /> Remove</a-button
                    ></template
                  >
                  <a-form label-align="left" layout="vertical">
                    <div class="row">
                      <div class="col-lg-12">
                        <a-form-item label="Step Name">
                          <a-input v-model:value="item.name" placeholder="Step Name" />
                        </a-form-item>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-lg-12">
                        <a-form-item label="Description">
                          <a-input v-model:value="item.description" placeholder="Description" />
                        </a-form-item>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <a-form-item label="Roles">
                          <a-select
                            v-model:value="item.ApprovalProcessRoles"
                            mode="multiple"
                            style="width: 100% !important"
                            placeholder="Please select"
                            option-label-prop="label"
                            :options="
                              allRoles.map(role => {
                                return { value: role.role_id, label: role.name }
                              })
                            "
                          >
                            <template #option="{ value: val, label }">
                              <span role="img" :aria-label="val"></span>
                              &nbsp;&nbsp;{{ label }}
                            </template>
                          </a-select>
                        </a-form-item>
                      </div>
                      <div class="col-lg-6">
                        <a-form-item label="Users">
                          <a-select
                            mode="multiple"
                            style="width: 100% !important"
                            placeholder="Please select"
                            option-label-prop="label"
                            v-model:value="item.ApprovalProcessUsers"
                            :options="
                              item.users.map(user => {
                                return { value: user.user_id, label: user.display_name }
                              })
                            "
                          >
                            <template #option="{ value: val, label }">
                              <span role="img" :aria-label="val"></span>
                              &nbsp;&nbsp;{{ label }}
                            </template>
                          </a-select>
                        </a-form-item>
                      </div>
                    </div>
                  </a-form>
                </a-collapse-panel>
              </a-collapse>
            </template>
          </div>
          <div class="card-footer" style="text-align: center">
            <a-affix class="align-center">
              <a-button class="m-1" type="default">Cancel</a-button>
              <a-button type="primary" @click="submit">Save</a-button>
            </a-affix>
          </div>
        </div>
        <div class="card bg-light" style="height: 500px" v-else>
          <div
            class="card-body"
            style="text-align: center; border: 1px dashed #a1a1c2; border-radius: 5px"
          >
            <div class="text-center text-blue">
              <div
                class="font-weight-bold font-size-24"
                style="height: 500px; line-height: 500px; text-align: center"
              >
                Select System...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VbWidgetsLists22 from '@/@vb/widgets/WidgetsLists/22'
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { encrypt64, decrypt64 } from '~/encryption'

export default {
  name: 'VbMessaging',

  components: {
    VbWidgetsLists22,
  },

  setup() {
    const initialSystem = {
      id: null,
      name: '',
    }
    const route = useRoute()
    const store = useStore()
    const routePath = computed(() => route.path)
    const system_credentials = computed(() => store.getters['systems/system_credentials'])
    let value = []
    const allRoles = computed(() => store.getters['approvalProcess/allRoles'])
    const approvalProcess = computed(() => store.getters['approvalProcess/list'])
    let selectedItemIndex = 0

    const allUsers = computed(() => {
      var users = []
      allRoles.value.map(function(role, index) {
        if (role['users'].length) {
          role['users'].forEach(element => {
            users.push({
              user_id: element.user_id,
              role_id: element.UserRole.role_id,
              display_name: element.display_name,
            })
          })
        }
        return role['users']
      })

      return users
    })

    const approval_process = computed(() =>
      approvalProcess.value.map(function(step, index) {
        approvalProcess.value[index]['users'] = []

        step.ApprovalProcessRoles.map(function(role, role_index) {
          var roleUsers = []

          if (typeof role === 'object') {
            roleUsers = allUsers.value.filter(user => user.role_id == role.role_id)
            roleUsers.forEach(ele => approvalProcess.value[index]['users'].push(ele))
            return (approvalProcess.value[index].ApprovalProcessRoles[role_index] = role.role_id)
          }

          roleUsers = allUsers.value.filter(user => user.role_id == role)
          roleUsers.forEach(ele => approvalProcess.value[index]['users'].push(ele))

          approvalProcess.value[index]['users'] = roleUsers
        })

        step.ApprovalProcessUsers.map(function(user, user_index) {
          if (typeof user === 'object') {
            return (approvalProcess.value[index].ApprovalProcessUsers[user_index] = user.user_id)
          }
        })

        return step
      }),
    )

    const loading = computed(() => store.getters['user/fetchLoading'])
    let users = ref([])
    let system = reactive({ ...initialSystem })
    let type = ref('')

    const useSSHKey = (state, index) => {
      selectedItemIndex = index
      system_credentials.value[selectedItemIndex].useSSHKey = state
    }

    const handleFileUpload = obj => {
      const reader = new FileReader()
      reader.onload = res => {
        const content = res.target.result
        system_credentials.value[selectedItemIndex].ssh_private_key = encrypt64(content)
      }

      reader.onerror = err => {
        console.error(err)
        alert('Error reading SSH Key file')
      }

      reader.readAsText(obj.file)
    }

    const beforeUpload = () => {
      return false
    }

    const uploadSshKey = index => {
      selectedItemIndex = index

      if (system_credentials.value[selectedItemIndex].password)
        system_credentials.value[selectedItemIndex].password = ''
    }

    const setPassword = index => {
      selectedItemIndex = index

      if (system_credentials.value[selectedItemIndex].ssh_private_key)
        system_credentials.value[selectedItemIndex].ssh_private_key = ''
    }

    const setType = () => {
      if (routePath.value.includes('system-credentials')) {
        type.value = 'credentials'
      } else if (routePath.value.includes('ATO-approval')) {
        type.value = 'ato'
      } else if (routePath.value.includes('control-approval')) {
        type.value = 'control'
      }
    }

    const changeSystem = async selectedSystem => {
      Object.assign(system, selectedSystem)
      let res = {}

      if (system.id) {
        switch (type.value) {
          case 'ato':
            console.dir('=>ato')
            store.dispatch('approvalProcess/GET_ALL', {
              payload: { system_id: system.id, type: type.value },
            })
            break
          case 'control':
            console.dir('=>control')
            store.dispatch('approvalProcess/GET_ALL', {
              payload: { system_id: system.id, type: type.value },
            })
            break
          case 'credentials':
            console.dir('=>credentials')
            store.dispatch('systems/GET_SYSTEM_CREDENTIALS', { payload: { id: system.id } })
            break
        }
      }
    }

    watch(routePath => {
      ;[system.id, system.name] = [null, '']
      setType()
    })

    const uuidv4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    const add = () => {
      if (type.value == 'credentials') {
        system_credentials.value.push({
          system_id: system.id,
          name:
            'New Credential ' +
            (system_credentials.value.length == 0 ? 1 : system_credentials.value.length + 1),
          deletedAt: null,
          username: null,
          ssh_private_key: null,
          useSSHKey: false,
          password: null,
        })
      } else {
        approvalProcess.value.splice(1, 0, {
          id: uuidv4(),
          system_id: system.id,
          name: 'New Approval Step ' + (approvalProcess.value.length - 1),
          label: 'approval_step ' + (approvalProcess.value.length - 1),
          description: '',
          type: type.value,
          order: approvalProcess.value.length - 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          ApprovalProcessRoles: [],
          ApprovalProcessUsers: [],
        })
        approvalProcess.value.join()
      }
    }

    const filterUsers = approvalProcessRoles => {
      users.value = []
      for (let index = 0; index < approvalProcessRoles.length; index++) {
        const approval = approvalProcessRoles[index]

        let Role = allRoles.value.filter(data => data.role_id == approval.role_id)
        if (Role[0]) {
          for (let i = 0; i < Role[0].users.length; i++) {
            users.value.push(Role[0].users[i])
          }
        }
      }
    }
    const remove = index => {
      if (type.value == 'credentials') {
        system_credentials.value.splice(index, 1)
      } else {
        approvalProcess.value.splice(index, 1)
      }
    }

    const updateSelected = data => console.log(data)
    const submit = () => {
      if (type.value == 'credentials') {
        Object.keys(system_credentials.value).map(key => {
          if (system_credentials.value[key].password) {
            try {
              decrypt64(system_credentials.value[key].password)
            } catch (error) {
              system_credentials.value[key].password = encrypt64(
                system_credentials.value[key].password,
              )
            }
          }
        })
        store.dispatch('systems/SAVE_CREDENTIALS', {
          payload: { system_id: system.id, oss_credentials: system_credentials.value },
        })
      } else {
        var steps = approval_process.value

        steps.map(function(step, index) {
          step.ApprovalProcessRoles.map(function(role, role_index) {
            if (typeof role !== 'object') {
              return (steps[index].ApprovalProcessRoles[role_index] = { role_id: role })
            }
          })
          step.ApprovalProcessUsers.map(function(user, user_index) {
            if (typeof user !== 'object') {
              return (steps[index].ApprovalProcessUsers[user_index] = { user_id: user })
            }
          })
          step['order'] = index + 1
          return step
        })

        store.dispatch('approvalProcess/SAVE', {
          payload: { system_id: system.id, type: type.value, steps },
        })
      }
    }

    setType()

    return {
      remove,
      setType,
      changeSystem,
      add,
      submit,
      filterUsers,
      updateSelected,
      beforeUpload,
      value,
      users,
      loading,
      allRoles,
      allUsers,
      system_credentials,
      approval_process,
      system,
      type,
      selectedItemIndex,
      uploadSshKey,
      setPassword,
      handleFileUpload,
      useSSHKey,
    }
  },
}
</script>

<style>
.ant-collapse.ant-collapse-icon-position-left {
  margin-top: 10px;
}

.ant-collapse-content {
  overflow: unset !important;
}
</style>
