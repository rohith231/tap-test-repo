<template>
  <div class="table-responsive text-nowrap">
    <a-table
      :expand-row-by-click="true"
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="false"
      @change="onChange"
    >
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div class="custom-filter-dropdown">
          <a-input
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm)"
            >Search</a-button
          >
          <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)"
            >Reset</a-button
          >
        </div>
      </template>
      <template #filterIcon="{ text: filtered }">
        <a-icon type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #baseline_impact="{ text: baseline_impact }">
        <span>
          <a-tag
            class="m-1"
            v-if="baseline_impact == null || baseline_impact.length == 0"
            key="00"
            color="gray"
          >
            Non applicable
          </a-tag>

          <a-tag
            class="m-1"
            v-for="tag in baseline_impact"
            :key="tag"
            :color="tag === 'HIGH' ? 'volcano' : tag === 'MODERATE' ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template #vulnerabilities="{ text: vulnerabilities }">
        <span v-for="(validation, spanIndex) in vulnerabilities" :key="spanIndex">
          <a-tag :color="getTagValidationClass(validation)">
            <span :style="`color:${getTagValidationTextColor(validation)}`">{{
              validation.vuln_num
            }}</span>
          </a-tag>
        </span>
      </template>
      <template #NIST80053r4_controls="{ text: NIST80053r4_controls }">
        <span>
          <a-tag v-for="control in NIST80053r4_controls" :key="control">
            {{ control.toUpperCase() }}
          </a-tag>
        </span>
      </template>

      <template #roles="{ text: roles }" v-if="path == '/users'">
        <span>
          <a-tag v-for="role in roles" :key="role" color="blue">{{ role.name }}</a-tag>
        </span>
        <span v-if="roles.length == 0"> --- </span>
      </template>

      <template #download_report="{ record }">
        <button
          type="button"
          class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
          @click="downloadPDF(record)"
        >
          <span class="btn-addon">
            <i class="btn-addon-icon fa fa-file-code-o" />
          </span>
          Download
        </button>
      </template>
      <template #actionRemove="{ record }">
        <span>
          <a-popconfirm
            :disabled="record.id == '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63' || record.id == user_id"
            title="Are you sure delete this?"
            @confirm="confirmDelete(record)"
            ok-text="Yes"
            cancel-text="No"
          >
            <a
              href="javascript: void(0);"
              class="btn btn-sm btn-light m-1"
              style="width: 95px"
              :class="{
                disabled:
                  record.id == '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63' ||
                  record.id == 'c32e3cc0-f20f-11ea-8fd0-bdb301126903' ||
                  record.id == user_id,
              }"
            >
              <small>
                <i class="far fa-trash-alt"></i>
              </small>
              Remove
            </a>
          </a-popconfirm>
        </span>
      </template>
      <template #actionView="{ record }">
        <span>
          <a
            href="javascript: void(0);"
            class="btn btn-sm btn-light m-1"
            style="width: 95px"
            @click="view(record)"
          >
            <small>
              <i class="far fa-edit"></i>
            </small>
            View
          </a>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a
            href="javascript: void(0);"
            class="btn btn-sm btn-light m-1"
            style="width: 95px"
            @click="view(record)"
          >
            <small>
              <i class="far fa-edit"></i>
            </small>
            View
          </a>
          <a-popconfirm
            :disabled="record.id == user_id"
            title="Are you sure delete this?"
            @confirm="confirmDelete(record)"
            ok-text="Yes"
            cancel-text="No"
            v-if="!(model === 'systems' && data.length === 1) && true"
          >
            <a
              href="javascript: void(0);"
              class="btn btn-sm btn-light m-1"
              style="width: 95px"
              :class="{
                disabled: record.id == user_id,
              }"
            >
              <small>
                <i class="far fa-trash-alt"></i>
              </small>
              Remove
            </a>
          </a-popconfirm>
        </span>
      </template>
      <template #commandDeviations="{ record }">
        <span>
          <a
            href="javascript: void(0);"
            class="btn btn-sm btn-light m-1"
            @click="$router.push({ path: `/command/deviations/${record.vuln_num}/${record.id}` })"
            style="width: 95px"
          >
            <small>
              <i class="fas fa-terminal"></i>
            </small>
            Command
          </a>
        </span>
      </template>
      <template #commandSTIGs="{ record }">
        <span>
          <a
            href="javascript: void(0);"
            class="btn btn-sm btn-light m-1"
            @click="$router.push({ path: `/command/STIGs/${record.vuln_num}/${record.id}` })"
            style="width: 95px"
          >
            <small>
              <i class="fas fa-terminal"></i>
            </small>
            Command
          </a>
        </span>
      </template>

      <template
        #expandedRowRender="{ record }"
        v-if="path.includes('NIST-controls') || path.includes('compliance') || path.includes('devices') || hasExtra || hasExtraTarget || hasExtraControl"
      >
        <NistControlDetails
          :nist-control="record"
          :framework="$route.params.framework"
          v-if="path.includes('NIST-controls')"
        />
        <template v-else-if="path.includes('compliance') || hasExtraControl">
          <template v-if="record.controls && record.controls.length > 0">
            <table :ref="refEle(el)">
              <thead>
                <tr>
                  <th class="text-center" style="border-bottom: 2px solid #000;width: 21%;">Status</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">Control</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">Updated</th>

                  <th class="text-center" style="width: 40%; border-bottom: 2px solid #000">
                    Vulnerability ID
                  </th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(control, trIndex) in record.controls" :key="trIndex">
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <!-- <span class="badge badge-success" v-if="control.control_status === 'COMPLIANT'">
                      PASS
                    </span> -->
                    <div class="progress" style="height:1.5rem">
    <div class="progress-bar" :style="`background-color: #5cb85c;width: ${control.passPercentage}%`">{{Math.round(control.passPercentage*100)/100  }}%</div>
    <div class="progress-bar" :style="`background-color: #d9534f;width: ${control.failPercentage}%;`">{{ Math.round(control.failPercentage*100)/100 }}%</div>
    <div class="progress-bar" :style="`background-color: #f0ad4e;width: ${control.otherPercentage}%;`">{{ Math.round(control.otherPercentage*100)/100 }}% </div>
  </div>
                    <!-- <span
                      class="badge badge-danger"
                      v-if="control.control_status === 'NON-COMPLIANT'"
                    >
                      FAIL
                    </span>
                    <span
                      class="badge badge-light"
                      v-if="control.control_status === 'NOT-APPLICABLE'"
                    >
                      NOT-APPLICABLE
                    </span> -->
                    <span class="badge badge-light" v-if="control.control_status === 'WAITING'">
                      WAITING
                    </span>
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ control.name }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ control.updated }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <span v-for="(validation, tdIndex) in control.vulnerabilities" :key="tdIndex">
                      <a-tag :color="getTagValidationClass(validation)">
                        <span :style="`color:${getTagValidationTextColor(validation)}`">{{
                          validation.vuln_num
                        }}</span>
                      </a-tag>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="mt-4 row text-center">
                      <div class="col-6">
                        <span class="badge badge-green">VALIDATION PASSED</span>
                      </div>
                      <div class="col-6">
                        <span class="badge badge-red">VALIDATION FAILED</span>
                      </div>
                      <div class="col-6">
                        <span class="badge badge-secondary">MANUAL VALIDATION REQUIRED</span>
                      </div>
                      <div class="col-6">
                        <span class="badge badge-yellow">MANUAL REMEDIATION REQUIRED</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else-if="record.vulnerabilities && record.vulnerabilities.length > 0">
            <table :ref="refEle(el)">
              <thead>
                <tr>
                  <th class="text-center" style="border-bottom: 2px solid #000">Status</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">Target</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">Updated</th>

                  <th class="text-center" style="width: 40%; border-bottom: 2px solid #000">
                    Vulnerability ID
                  </th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(device, trIndex) in record.devices" :key="trIndex">
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <span class="badge badge-success" v-if="device.device_status === 'COMPLIANT'">
                      PASS
                    </span>
                    <span
                      class="badge badge-danger"
                      v-if="device.device_status === 'NON-COMPLIANT'"
                    >
                      FAIL
                    </span>
                    <span
                      class="badge badge-light"
                      v-if="device.device_status === 'NOT-APPLICABLE'"
                    >
                      NOT-APPLICABLE
                    </span>
                      <!-- <div class="progress" style="width:250px;height:1.5rem">
      <div class="progress-bar" :style="`background-color: #5cb85c;width: ${device.passPercentage}%`">{{ device.passPercentage }}%</div>
      <div class="progress-bar" :style="`background-color: #d9534f;width: ${device.failPercentage}%;`">{{ device.failPercentage }}%</div>
      <div class="progress-bar" :style="`background-color: #f0ad4e;width: ${device.otherPercentage}%;`">{{ device.otherPercentage }}%</div>
    </div> -->
                    <span class="badge badge-light" v-if="device.device_status === 'WAITING'">
                      WAITING
                    </span>
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.ip_addr }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.updated }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <span v-for="(validation, spanIndex) in device.vulnerabilities" :key="spanIndex">
                      <a-tag :color="getTagValidationClass(validation)">
                        <span :style="`color:${getTagValidationTextColor(validation)}`">{{
                          validation.vuln_num
                        }}</span>
                      </a-tag>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <a-typography-title :ref="refEle(el)" :level="5" class="text-center">
              No Data
            </a-typography-title>
          </template>
        </template>
        <template v-else-if="path.includes('devices') || hasExtraTarget">
          <template
            v-if="record.devices && record.devices.length > 0">
            <table :ref="refEle(el)">
              <thead>
                <tr>
                  <th class="text-center" style="border-bottom: 2px solid #000;">IP</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">Host</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">OS</th>

                  <th class="text-center" style="border-bottom: 2px solid #000">
                    Mac Address
                  </th>
                  <th class="text-center" style="border-bottom: 2px solid #000">Status</th>
                
                  <th class="text-center" style="border-bottom: 2px solid #000">Validate</th>
                
                  <th class="text-center" style="border-bottom: 2px solid #000">Remediate</th>
                
                  <th class="text-center" style="border-bottom: 2px solid #000">Action</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr v-for="(device, trIndex) in record.devices" :key="trIndex">
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.ip_addr }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.host_name }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.os_type }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    {{ device.mac_address }}
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <span class="badge badge-success" v-if="device.connectable">
                      CONNECTED
                    </span>
                    <span class="badge badge-light" v-else-if="device.touched_at==null">
                      WAITING
                    </span>
                    <span class="badge badge-danger" v-else>
                      FAILED CONNECTION
                    </span>
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                      <i class="fas fa-check-circle" style="color: green;font-size: 16px;" v-if="device.validate"/>
                      <i class="fas fa-exclamation-circle" style="color: #faad15;font-size: 16px;" v-else/>
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    <i class="fas fa-check-circle" style="color: green;font-size: 16px;" v-if="device.remediate"/>
                    <i class="fas fa-exclamation-circle" style="color: #faad15;font-size: 16px;" v-else/>
                  </td>
                  <td class="text-center" style="border-bottom: 1px dashed #000">
                    
                    <span>
                      <a
                        href="javascript: void(0);"
                        class="btn btn-sm btn-light m-1"
                        style="width: 95px"
                        @click="deviceview(device)"
                      >
                        <small>
                          <i class="far fa-edit"></i>
                        </small>
                        View
                      </a>
                      <a-popconfirm
                        :disabled="device.id == user_id"
                        title="Are you sure delete this?"
                        @confirm="deviceconfirmDelete(device)"
                        ok-text="Yes"
                        cancel-text="No"
                        v-if="!(model === 'systems' && data.length === 1) && true"
                      >
                        <a
                          href="javascript: void(0);"
                          class="btn btn-sm btn-light m-1"
                          style="width: 95px"
                          :class="{
                            disabled: device.id == user_id,
                          }"
                        >
                          <small>
                            <i class="far fa-trash-alt"></i>
                          </small>
                          Remove
                        </a>
                      </a-popconfirm>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-else>
            <a-typography-title :ref="refEle(el)" :level="5" class="text-center">
              No Target(s)
            </a-typography-title>
          </template>
        </template>
        <template
          v-else-if="framework=='NIST80053R5'?
            (record[`${framework}CheckControl`] &&
            record[`${framework}CheckControl`].AuditR5Controls.length > 0):(record[`${framework}CheckControl`] &&
            record[`${framework}CheckControl`].AuditControls.length > 0)
          "
        >
          <a-form label-align="left" layout="vertical">
            <vb-assesment v-if="framework=='NIST80053R5'"
              :ref="refEle(el)"
              :audit="record[`${framework}CheckControl`].AuditR5Controls"
              :disbaled="true"
            />
            <vb-assesment v-else
              :ref="refEle(el)"
              :audit="record[`${framework}CheckControl`].AuditControls"
              :disbaled="true"
            />
          </a-form>
        </template>
        <template v-else>
          <a-typography-title :ref="refEle(el)" :level="5" class="text-center">
            No assessments
          </a-typography-title>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import VbAssesment from '@/@vb/widgets/Forms/CheckControl/partial/assesment.vue'
import NistControlDetails from '@/@vb/components/NistControlDetails'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { encryptStorage } from '@/utils'
import useEmitter from '@/composables/useEmitter'
import axios from 'axios'
import NProgress from 'nprogress'

export default {
  components: { NistControlDetails, VbAssesment },

  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    columns: {
      type: Object,
      default: () => {
        return {}
      },
    },
    model: {
      type: String,
      default: () => {
        return null
      },
    },
    events: {
      type: Object,
      default: () => {
        return {}
      },
    },
    hasExtra: {
      type: Boolean,
      default: () => false,
    },
    hasExtraTarget: {
      type: Boolean,
      default: () => false,
    },
    hasExtraControl: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['sort', 'delete-record', 'view-record'],

  setup(props, { emit }) {
    const store = useStore()
    const searchText = ref('')
    const searchInput = ref(null)
    const route = useRoute()
    const loading = computed(() => store.getters['user/user'].fetchLoading)
    const user_id = computed(() => store.getters['user/user'].id)

    const loadingSetting = computed(() => store.getters['setting/setting'].loading)
    store.dispatch('setting/GET_ALL', {})
    const settingList = computed(() => store.getters['setting/setting'].list)
    const router = useRouter()
    const path = computed(() => route.path)
    const handleSearch = (selectedKeys, confirm) => {
      confirm()
      searchText.value = selectedKeys[0]
    }

    let framework = computed(() => encryptStorage.getItem(`selectedFramework`))

    const handleReset = (clearFilters) => {
      clearFilters()
      searchText.value = ''
    }
    const confirmDelete = (record) => {
      if (record.id && props.model && !props.events.delete) {
        if (props.model != 'device') {
        store
          .dispatch(`${props.model}/DELETE`, {
            payload: {
              id: record.id,
            },
          })
          .then(() => setTimeout(() => emit('delete-record', {}), 1000))
        }else{
        store
          .dispatch(`devicecategory/DELETE`, {
            payload: {
              id: record.id,
            },
          })
          .then(() => setTimeout(() => emit('delete-record', {}), 1000))
        }
      } else if (props.events.delete) {
        emit(props.events.delete, {
          record,
        })
      }
    }
    const deviceconfirmDelete = (record) => {
      if (record.id && props.model && !props.events.delete) {
        store
          .dispatch(`${props.model}/DELETE`, {
            payload: {
              id: record.id,
            },
          })
          .then(() => setTimeout(() => emit('delete-record', {}), 1000))
      } else if (props.events.delete) {
        emit(props.events.delete, {
          record,
        })
      }
    }
    const emitter = useEmitter()

    const view = (record) => {
      let extra = null
      let id = record.id
      if (record.id && props.model && !props.events.view) {
        if (props.model == 'systems') {
          emitter.emit('breadcrumbs-show', { show: false })

          const user_systems = computed(() => store.getters['user/Systems'])

          encryptStorage.setItem(`selectedSystem`, record.id)
          store.commit('user/SET_STATE', { selectedSystem: record.id })

          let selectedFramework = null

          let system_frameworks = []

          let chosenSystem = user_systems.value.filter((user_system) => user_system.id == record.id)

          setTimeout(() => {
            if (
              chosenSystem[0] &&
              chosenSystem[0].Frameworks &&
              chosenSystem[0].Frameworks.length > 0
            ) {
              system_frameworks = chosenSystem[0].Frameworks
              if (
                system_frameworks.some(
                  (child) => child.identifier === encryptStorage.getItem(`selectedFramework`),
                )
              ) {
                selectedFramework = encryptStorage.getItem(`selectedFramework`)
              } else {
                selectedFramework = system_frameworks[0].identifier
              }
              encryptStorage.setItem(`selectedFramework`, selectedFramework)
              store.commit('user/SET_STATE', { selectedFramework: selectedFramework })
            }
            emitter.emit('update-selected-system', {
              system_frameworks,
            })
           // router.push(`/dashboard`)
          router.push(`/${props.model}/profile/${id}` + (extra || ''))
          }, 10)

          return
        }

        if (props.model == 'framework-controls') {
          extra = `?control_number=${record.number}`
          id = null
          if (record.NIST800171R2CheckControl) {
            id = record.NIST800171R2CheckControl ? record.NIST800171R2CheckControl.id : null
            extra += record.NIST800171R2CheckControl
              ? `&NIST80053r4_controls=${record.NIST80053r4_controls}`
              : ''
          } else if (record.NIST80053R4CheckControl) {
            id = record.NIST80053R4CheckControl ? record.NIST80053R4CheckControl.id : null
          } else if (record.NIST80053R5CheckControl) {
            id = record.NIST80053R5CheckControl ? record.NIST80053R5CheckControl.id : null
          }
        }

        if (props.model == 'checkControls') {
          router.push(`/custom-controls/profile/${record.id}`)
          return
        }
        if (props.model == 'device') {
          router.push(`/device/category/${record.id}`)
          return
        }

        router.push(`/${props.model}/profile/${id}` + (extra || ''))
      } else if (props.events.view) {
        emit(props.events.view, {
          record,
        })
      }
    }

    const deviceview = (record) => {
      let extra = null
      let id = record.id
      if (record.id && props.model && !props.events.view) {
        router.push(`/${props.model}/profile/${id}` + (extra || ''))
      } else if (props.events.view) {
        emit(props.events.view, {
          record,
        })
      }
    }

    const downloadPDF = (record) => {
      store.commit('compliance/SET_STATE', {
        loading: true,
      })
      // console.log(record)
      NProgress.start()
      let selectedSystem = computed(() => store.getters['user/selectedSystem'])
      const user_systems = computed(() => store.getters['user/Systems'])

      let chosenSystem = user_systems.value.filter(
        (user_system) => user_system.id == selectedSystem.value,
      )

      var pdf_data = Object.assign({ info_system: chosenSystem[0] }, {})

      var key = record.hasOwnProperty('controls') ? 'compliance_target' : 'compliance_controls'
      pdf_data = Object.assign(pdf_data, { [key]: [record] })
      var data = {
        template: {
          shortid: 'HGs2d6T',
        },
        data: pdf_data,

        options: {
          preview: false,
          reports: {
            save: true,
          },
        },
      }
      let dataList = settingList.value.filter((setting) => {
        return setting.setting_key == 'js_report'
      })

      let jsReportUrl = dataList.length ? dataList[0]['setting_value'] : ''
      // console.log('jsReportUrl>>>>>>>>with key js_report>>>> ', jsReportUrl)

      const accessToken = encryptStorage.getItem('accessToken')

      axios
        .post('http://localhost:3331/api/v1/ssp/report/devices', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + accessToken
          } 
        })
        .then((response) => {
          NProgress.done()
          store.commit('compliance/SET_STATE', { loading: false })
          if(response.data.statusCode == 200) {
            const blob = new Blob([response.data.result], { type: 'text/html' })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            const d = new Date()
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            link.download = `${chosenSystem[0].name.replace(' ', '-')}-${key}-${da}-${mo}-${ye}.html`
            link.click()
          } else {
            alert("Export failed");
          }
        })
        .catch((error) => {
          NProgress.done()
          store.commit('compliance/SET_STATE', {
            loading: false,
          })
        })
    }
    const onChange = (pagination, filters, sorter) => {
      emit('sort', {
        sortKey: sorter.columnKey,
        descSort: sorter.order == 'descend' ? true : false,
        order: sorter.order,
      })
    }

    const refEle = (el) => {
      // console.log(document)
      setTimeout(() => {
        document
          .querySelectorAll(
            'tr.ant-table-expanded-row.ant-table-expanded-row-level-1 > td:nth-child(2)',
          )
          .forEach((el) => (el.colSpan = 9))
      }, 1)
    }
    return {
      downloadPDF,
      onChange,
      view,
      deviceview,
      refEle,
      user_id,
      loading,
      path,
      searchText,
      searchInput,
      handleReset,
      confirmDelete,
      deviceconfirmDelete,
      handleSearch,
      framework,
      loadingSetting,
      settingList,
    }
  },

  methods: {
    getTagValidationClass(obj) {
      switch (obj.status) {
        case 'COMPLIANT':
          return 'green'

        case 'NOT-APPLICABLE':
          return '#d9dee9'

        default:
          if (!obj.validation_cmd_status) return '#a1a1c2'
          if (!obj.remediation_cmd_status) return '#f9cb9c'
          return 'red'
      }
    },
    getTagValidationTextColor(obj) {
      switch (obj.status) {
        case 'COMPLIANT':
          return '#389e0d'

        case 'NOT-APPLICABLE':
          return '#5f6294'

        default:
          if (!obj.validation_cmd_status) return '#ffffff'
          if (!obj.remediation_cmd_status) return '#ffffff'
          return '#cf1322'
      }
    },
  },
}
</script>

<style >
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.ant-table-tbody > tr > td {
  white-space: normal !important;
}

.ant-table-placeholder {
  min-height: 450px !important;
}

.disabled {
  color: #7b7f88 !important;
}

tr.ant-table-expanded-row.ant-table-expanded-row-level-1 > td:first-child {
  display: none;
}

[data-vb-theme='default'] tr.ant-table-expanded-row,
[data-vb-theme='default'] tr.ant-table-expanded-row:hover {
  background: unset;
}

.badge-yellow {
  background-color: #f9cb9c;
  color: white;
}

.badge-red {
  background: #fff1f0;
  border-color: #ffa39e;
  color: #cf1322;
  border: 0.5px solid;
}

.badge-green {
  background: #f6ffed;
  border-color: #b7eb8f;
  color: #389e0d;
  border: 0.5px solid;
}
</style>
