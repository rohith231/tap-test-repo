<template>
  <div class="card-header-flex align-items-center">
    <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
      <h5 class="mb-0">
        <div class="vb__utils__heading">
          <strong>
            {{ data.title }}
            <span>
              <a-popconfirm
                title="Are you sure you want reset compliance?"
                @confirm="resetCompliance"
                ok-text="Yes"
                cancel-text="No"
              >
                <a-tooltip placement="bottom">
                  <template #title>
                    <span> reset compliance for demo </span>
                  </template>
                  <a href="javascript: void(0);">
                    <i class="fas fa-sync-alt mx-2 fa-xs" />
                  </a>
                </a-tooltip>
              </a-popconfirm>
            </span>
          </strong>
        </div>
      </h5>
    </div>
    <div></div>

    <span>
      <button
        type="button"
        class="btn btn-primary btn-with-addon text-nowrap d-none d-md-block btn-sm mt-3 m-2"
        @click="downloadPDF"
      >
        <span class="btn-addon">
          <i class="btn-addon-icon fa fa-file-code-o" />
        </span>
        {{ tab }} Report
      </button>
    </span>
    <a-tabs
      @tabClick="callBackTabs"
      :default-active-key="1"
      class="vb-tabs-bold"
      style="margin-bottom: -10px"
    >
      <a-tab-pane key="Target">
        <template #tab>
          <span>
            <i class="fas fa-laptop"></i>
            Target(s)
          </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="Controls">
        <template #tab>
          <span>
            <i class="fas fa-list-alt"></i>
            Controls
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import axios from 'axios'
import NProgress from 'nprogress'
import { encryptStorage } from '@/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: '',
        }
      },
    },
  },
  emits: ['data-type'],
  setup(props, { emit }) {
    const store = useStore()
    const tab = ref('Target')
    const loading = computed(() => store.getters['setting/setting'].loading)
    store.dispatch('setting/GET_ALL', {})
    const settingList = computed(() => store.getters['setting/setting'].list)

    const callBackTabs = (type) => {
      tab.value = type
      emit('data-type', type)
    }

    const downloadPDF = () => {
      store.commit('compliance/SET_STATE', {
        loading: true,
      })
      NProgress.start()
      let selectedSystem = computed(() => store.getters['user/selectedSystem'])
      const user_systems = computed(() => store.getters['user/Systems'])
      let list = computed(() => store.getters['compliance/compliance'].list)
      let chosenSystem = user_systems.value.filter(
        (user_system) => user_system.id == selectedSystem.value,
      )

      var pdf_data = Object.assign({ info_system: chosenSystem[0] }, {})

      var key = tab.value == 'Target' ? 'compliance_target' : 'compliance_controls'
      pdf_data = Object.assign(pdf_data, { [key]: list.value })
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
      const reportAPIUrl = tab.value == "Target" ? 'http://localhost:3331/api/v1/ssp/report/devices' : 'http://localhost:3331/api/v1/ssp/report/controls'

      axios
        .post(reportAPIUrl, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + accessToken
          } 
        })
        .then((response) => {
          store.commit('compliance/SET_STATE', { loading: false })
          NProgress.done();
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
    const resetCompliance = () => {
      store.dispatch('compliance/RESET_COMPLIANCE', {})
    }

    return {
      tab,
      downloadPDF,
      callBackTabs,
      resetCompliance,
      settingList,
      loading,
    }
  },
}
</script>
