<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <div class="card-header-flex align-items-center">
              <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
                <h5 class="mb-0">
                  <div class="vb__utils__heading">
                    <strong> IP-Ranges </strong>
                  </div>
                </h5>
              </div>
              <div>
                <span>
                  <a-input
                    class="mr-2 float-left"
                    placeholder="Search..."
                    @change="search"
                    style="width: 200px"
                    :loading="loading"
                  >
                    <template #suffix>
                      <a-tooltip title="Search">
                        <i class="fe fe-search" />
                      </a-tooltip>
                    </template>
                  </a-input>
                  <div
                    :class="$style.amount"
                    class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"
                  >
                    <div :class="$style.divider" class="mr-2" />
                    <button
                      type="button"
                      @click="showModal('new')"
                      class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
                    >
                      <span class="btn-addon">
                        <i class="btn-addon-icon fas fa-plus" />
                      </span>
                      Add IP
                    </button>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <template v-if="loading">
              <a-skeleton active />
              <a-skeleton active />
            </template>
            <template v-else>
              <vb-tables-antd-2
                :data="data"
                :columns="columns"
                @sort="sort($event)"
                model="ip"
                :events="{
                  view: 'view-record',
                }"
                @delete-record="getData"
                @view-record="showModal"
              />
              <pagination
                :total="total"
                :page-number="pageNumber"
                :items-per-page="itemsPerPage"
                @changePagination="changePagination($event)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- model -->

    <a-modal v-model:visible="visible" title="Add IP">
      <template #footer>
        <a-button key="back" @click="handleCancel"> Cancel </a-button>
        <a-button key="submit" type="primary" :loading="btnloading" @click="handleOk">
          Save
        </a-button>
      </template>
      <a-form ref="ruleForm" :model="form" :label-col="{ span: 5 }">
        <a-form-item ref="subnet" label="Subnet">
          <a-input v-model:value="form.subnet" />
        </a-form-item>
        <a-form-item label="Description" ref="description">
          <a-textarea v-model:value="form.description" :rows="3" />
        </a-form-item>

        <a-form-item v-bind="form.status" label="Switch">
          <a-switch :checked="form.status" default-checked @change="onChange" />
        </a-form-item>
        <!-- <a-switch    @change="sw"  v-decorator="['switch', { valuePropName: 'checked' }]"  checked-children="Active" un-checked-children="Inactive" /> -->
        <div class="row">
          <div class="col-lg-6">
            <h5>Login details</h5>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-lg-12">
            <a-form-item label="User name">
              <a-input
                v-model:value="form.username"
                @keyup="setLoginDetails"
                placeholder="User name"
              />
            </a-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <a-form-item label="Password">
              <a-input
                v-model:value="form.password"
                @keyup="setLoginDetails"
                placeholder="Password"
                type="password"
              />
            </a-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <a-form-item label="SSH Key">
              <a-upload
                :max-count="1"
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                accept=".pem"
                list-type="picture"
                :disabled="disabled"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  <span v-if="form.ssh_private_key && form.ssh_private_key.length > 0"
                    >Change File</span
                  >
                  <span v-else>Select File</span>
                </a-button>
              </a-upload>
            </a-form-item>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-6">
            <h5>Credential</h5>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-lg-12">
            <a-form-item label="Credentials">
              <a-select
                label="Credentials"
                style="width: 100% !important"
                placeholder="Credential"
                @change="setCredential"
                v-model:value="form.credential_id"
              >
                <a-select-option v-for="credential in system_credentials" :key="credential.id">
                  {{ credential.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { encrypt64, decrypt64 } from '~/encryption'
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, h, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'IPRanges',
  components: {
    pagination,
    VbTablesAntd2,
  },
  setup() {
    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    const store = useStore()
    let query_search,
      timeout,
      sortKey,
      descSort,
      order = null
    const loading = computed(() => store.getters['user/user'].loading)
    let data = computed(() => store.getters['ip/ip'].list)
    const total = computed(() => store.getters['ip/ip'].count)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let q_search = ''

    const system_credentials = computed(() => store.getters['systems/system_credentials'])
    store.dispatch('systems/GET_SYSTEM_CREDENTIALS', {
      payload: { id: store.getters['user/selectedSystem'] },
    })

    const getData = () => {
      store.dispatch('ip/GET_ALL', {
        payload: {
          system_id: selectedSystem.value,
          pageNumber: pageNumber.value,
          itemsPerPage: itemsPerPage.value,
          query_search,
          sortKey,
          descSort,
        },
      })
    }

    const changePagination = (data) => {
      itemsPerPage.value = data.itemsPerPage || itemsPerPage.value
      pageNumber.value = data.pageNumber || 1
      getData()
    }
    const search = (value) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        query_search = value.data
        ;(itemsPerPage.value = 10), (pageNumber.value = 1), getData()
      }, 1300)
    }
    const sort = (data) => {
      sortKey = data.sortKey
      descSort = data.descSort
      order = data.order
      getData()
    }
    watch(selectedSystem, (selectedSystem) => {
      getData()
    })
    watch(q_search, (q_search) => {
      search(q_search)
    })

    getData()

    return {
      getData,
      q_search,
      search,
      sort,
      changePagination,
      itemsPerPage,
      pageNumber,
      data,
      total,
      loading,
      system_credentials,
    }
  },
  data() {
    return {
      form: {
        id: null,
        subnet: '',
        description: '',
        status: true,
        credential_id: '',
        username: '',
        password: '',
        ssh_private_key: '',
      },
      fileList: [],
      btnloading: false,
      visible: false,
      columns: [
        {
          title: 'Run',
          dataIndex: 'picked_at',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          customRender: (value, row, index) => {
            if (value.record.picked_at) {
              return h('span', { class: 'badge badge-success' }, value.record.picked_at)
            } else {
              return h('span', { class: 'badge badge-warning' }, 'Procssing')
            }
          },
        },
        {
          title: 'Subnet',
          dataIndex: 'subnet',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'Status',
          dataIndex: 'status',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          customRender: (value, row, index) => {
            if (value.record.status) {
              return h('span', { class: 'badge badge-success' }, 'Active')
            } else {
              return h('span', { class: 'badge badge-warning' }, 'Inactive')
            }
          },
        },
        {
          title: 'Description',
          dataIndex: 'description',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'Action',
          slots: { customRender: 'action' },
        },
      ],
    }
  },
  methods: {
    onChange(checked) {
      this.form.status = checked
    },

    setLoginDetails() {
      this.form.credential_id = ''
      this.form.ssh_private_key = ''
      this.fileList = []
    },

    setCredential(value) {
      this.form.credential_id = value
      this.form.username = ''
      this.form.password = ''
      this.form.ssh_private_key = ''
      this.fileList = []
    },
    getDataAfter() {
      this.$store.dispatch('ip/GET_ALL', {
        payload: { system_id: this.$store.getters['user/selectedSystem'] },
      })
    },
    showModal(data = null) {
      if (data == 'new') {
        this.form = {
          id: null,
          subnet: '',
          description: '',
          status: true,
          credential_id: '',
          username: '',
          password: '',
          ssh_private_key: '',
        }
      }

      this.form = {
        ...this.form,
        ...data.record,
      }
      this.visible = true
    },
    readKeyFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (res) => {
          const content = res.target.result
          return resolve(content)
        }

        reader.onerror = (err) => {
          return reject(err)
        }

        reader.readAsText(file)
      })
    },
    async handleOk(e) {
      this.btnloading = true

      // SSH Key handling
      if (this.fileList && this.fileList[0]) {
        try {
          const key = await this.readKeyFile(this.fileList[0])
          this.form.ssh_private_key = encrypt64(key)
        } catch (e) {
          console.error(e)
          alert('Error reading SSH Key file')
          return
        }
      }

      // Password handling
      else if (this.form.password != '') {
        try {
          decrypt64(this.form.password)
        } catch (e) {
          this.form.password = encrypt64(this.form.password)
        }
      }

      if (this.form.id) {
        this.$store
          .dispatch('ip/UPDATE', {
            payload: {
              ...this.form,
              system_id: this.$store.getters['user/selectedSystem'],
              user_id: this.$store.getters['user/user'].id,
            },
          })
          .then(() => {
            setTimeout(() => {
              this.form = {
                id: null,
                subnet: '',
                description: '',
                status: true,
              }
              this.getDataAfter()
              this.visible = false
              this.btnloading = false
            }, 2000)
          })
      } else {
        this.$store
          .dispatch('ip/ADD', {
            payload: {
              ...this.form,
              system_id: this.$store.getters['user/selectedSystem'],
              user_id: this.$store.getters['user/user'].id,
            },
          })
          .then(() => {
            setTimeout(() => {
              this.form = {
                id: null,
                subnet: '',
                description: '',
                status: true,
              }
              this.getDataAfter()
              this.visible = false
              this.btnloading = false
            }, 2000)
          })
      }
    },
    handleCancel(e) {
      this.visible = false
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [file]
      this.form.credential_id = ''
      this.form.password = ''
      return false
    },
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
