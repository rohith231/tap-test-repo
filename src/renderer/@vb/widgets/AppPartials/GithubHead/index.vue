<template>
  <div>
    <div className="d-flex flex-wrap">
      <div className="mr-auto pr-3 my-2">
        <i className="fe fe-book font-size-21 mr-2" />
        <div className="text-nowrap d-inline-block font-size-18 text-dark">
          <a className="font-size-18 text-blue" href="javascript: void(0);">
            {{ filteredStories[0].name }}
          </a>
          /
          <a className="font-size-18 text-blue" href="javascript: void(0);">
            System Security Plan
          </a>
        </div>
      </div>
      <div className="">
        <!-- @click="getReport" -->
        <button
          type="button"
          class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm m-2"
          @click="showModal"
        >
          <span class="btn-addon">
            <i class="btn-addon-icon fa fa-file-code-o" />
          </span>
          Report
        </button>

        <a-modal
          v-model:visible="visible"
          title="Please select the sections for your report"
          ok-text="Download"
          cancel-text="Cancel"
          @ok="getReport"
        >
        <a-checkbox v-model:checked="selectall" @change="onCheck">
        <span v-if="!selectall">Select All</span>
        <span v-if="selectall">De-Select All</span>
        </a-checkbox>
      
          <a-tree
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :v-model="checkedKeys"
            :checked-keys="checkedKeys"
            @expand="onExpand"
            @check="check"
            :tree-data=chapters
          >
          </a-tree>
        </a-modal>
      </div>
    </div>
    <!-- <a-tabs :default-active-key="1" class="vb-tabs-bordered">
      <a-tab-pane key="1">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#Prepared By' }">
            Prepared By
          </router-link>
        </template>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#Prepared For' }">
            Prepared For
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="3">
        <template #tab>
          <router-link
            :to="{ path: '/system-sections/ssp', hash: '#Information System Name/Title' }"
          >
            Information System Name/Title
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="4">
        <template #tab>
          <router-link
            :to="{ path: '/system-sections/ssp', hash: '#Information System Categorization' }"
          >
            Information System Categorization
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="5">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#General System Description' }">
            General System Description
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="6">
        <template #tab>
          <router-link
            :to="{ path: '/system-sections/ssp', hash: '#System Environment And Inventory' }"
          >
            System Environment And Inventory
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="7">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#System Interconnections' }">
            System Interconnections
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="9">
        <template #tab>
          <router-link
            :to="{
              path: '/system-sections/ssp',
              hash: '#Laws, Regulations, Standards and Guidance',
            }"
          >
            Laws, Regulations, Standards and Guidance"
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="9">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#Minimum Security Controls' }">
            Minimum Security Controls
          </router-link>
        </template>
      </a-tab-pane>

      <a-tab-pane key="10">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#Custom Security Controls' }">
            Custom Security Controls
          </router-link>
        </template>
      </a-tab-pane>
      <a-tab-pane key="11">
        <template #tab>
          <router-link :to="{ path: '/system-sections/ssp', hash: '#Custom Security Controls' }">
            Custom Security Controls
          </router-link>
        </template>
      </a-tab-pane>
    </a-tabs> -->
  </div>
</template>

<script>
import { watch, computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import NProgress from 'nprogress'
import { encryptStorage } from '@/utils'
const chapters = [
  {
    title: 'Prepared By',
    key: '1',
  },
  {
    title: 'Prepared For',
    key: '2',
  },
  {
    title: 'Information System Name/Title',
    key: '3',
  },
  {
    title: 'Information System Categorization',
    key: '4',
    children: [
      {
        title: 'System Sensitivity Level',
        key: '4.1',
      },
      {
        title: 'Security Objectives Categorization (FIPS 199)',
        key: '4.2',
      },
      {
        title: 'Digital Identity Determination',
        key: '4.3',
      }
    ]
  },
  {
    title: 'Information System Owner',
    key: '5',
  },
  {
    title: 'Other Designated Contacts',
    key: '6',
    children: [
      {
        title: 'Management Point of Contact',
        key: '6.1',
      },
      {
        title: 'Technical Point of Contact',
        key: '6.2',
      },
      {
        title: 'Other Contact',
        key: '6.3',
      },
    ],
  },
  {
    title: 'Assignment of security responsibility',
    key: '7',
    children: [
      {
        title: 'CSP Name Internal ISSO (or Equivalent) Point of Contact',
        key: '7.1',
      },
      {
        title: 'AO Point of Contact',
        key: '7.2',
      },
    ]
  },
  {
    title: 'Information System Operational Status',
    key: '8',
  },
  {
    title: 'Information System Type',
    key: '9',
    children: [
      {
        title: 'Service Models',
        key: '9.1',
      },
      {
        title: 'Cloud Deployment Models',
        key: '9.2',
      },
      {
        title: 'Service provider architecture layers',
        key: '9.3',
      },
    ]
  },
  {
    title: 'Leveraged Authorizations',
    key: '10',
  },
  {
    title: 'Network Architecture',
    key: '11',
  },
  {
    title: 'System Environment And Inventory',
    key: '12',
  },
  {
    title: 'Data Flow',
    key: '13',
  },
  {
    title: 'Ports, Protocols and Services',
    key: '14',
  },
  {
    title: 'Applicable Standards and Guidance',
    key: '15',
  },
  {
    title: 'Framework Controls',
    key: '16',
    children: [
      {
        title: 'Framework Controls',
        key: '16.2',
      },
      {
        title: 'Assessment',
        key: '16.1',
      },
    ]
  },
  {
    title: 'Custom Controls',
    key: '17',
  },
  {
    title: 'Compliances',
    key: '18'
  }
]
export default {
  name: 'VbGithubDiscuss',
  components: {},

  /*props: {
    data: {
      type: Object,
      default: () => {
        return {
          selectall: true,
        }
      },
    },
  },*/
  setup() {
    const store = useStore()
    const downloadPdf_loading = ref(true)
    let selectall = ref(true)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])

    store.dispatch('checkControls/GET_ALL', {
      payload: {
        system_id: selectedSystem.value,
        framework_id: 1,
        pageNumber: 1,
        itemsPerPage: 200,
        framework: selectedFramework.value,
        sortKey:'number'
      },
    })

    const loading = computed(() => store.getters['setting/setting'].loading)
    store.dispatch('setting/GET_ALL', {})
    const ssp = computed(() => store.getters['ssp/ssp'].ssp)
    let all_custom = computed(() => store.getters['checkControls/checkControls'].list_custom_all)
    let all_framework = computed(
      () => store.getters['checkControls/checkControls'].list_framework_all,
    )

    const settingList = computed(() => store.getters['setting/setting'].list)
    const visible = ref(false)
    let checkedKeys = ref(['1', '2', '3', '4','4.1','4.2','4.3', '5', '6','6.1','6.2','6.3', '7','7.1','7.2', '8', '9','9.1','9.2','9.3', '10', '11', '12', '13', '14', '15', '16', '16.1', '16.2', '17', '18'])

    const showModal = () => {
      visible.value = true
    }

    const confirm = () => {
      Modal.confirm({
        title: 'Confirm',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Bla bla ...',
        okText: '确认',
        cancelText: '取消',
      })
    }

    watch(selectedSystem, (selectedSystem) => {
      getData()
    })
    let filteredStories
    const getData = () => {
      filteredStories = computed(() =>
        store.getters['user/Systems'].filter((system) => {
          if (system.id == selectedSystem.value) {
            return system
          }
        }),
      )
    }

    const getReport = async () => {
      visible.value = false

      store.commit('ssp/SET_STATE', { SSPLoading: true })

      NProgress.start()
      let result = []
      chapters.forEach(function (chapter) {
        var children = []
        
        if (checkedKeys.value.includes(chapter.key)) {
          result.push(chapter)
        } else if (chapter.children) {
          chapter.children.forEach(function (a) {
            if (checkedKeys.value.includes(a.key)) {
              children.push(a)
            }
          })

          if (children.length) {
            chapter.children = children
            result.push(chapter)
          }
        }
      })
      downloadPdf_loading.value = true
      var ssp_data = Object.assign(ssp.value, {})
      var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
      let devices_list = computed(() => store.getters['compliance/compliance'].devices)
      let compliance_list = computed(() => store.getters['compliance/compliance'].list)
      let compliance_type = computed(() => store.getters['compliance/compliance'].type)
      if(!checkedKeys.value.includes('16')) {
        if (checkedKeys.value.includes('16.2')) {
          checkedKeys.value.push('16')
        }
        if (checkedKeys.value.includes('16.1')) {
          checkedKeys.value.push('16')
        }
      }
      ssp_data = Object.assign(ssp_data, { info_system: filteredStories.value })
      ssp_data = Object.assign(ssp_data, { NIST_controls: all_framework.value })
      ssp_data = Object.assign(ssp_data, { custom_controls: all_custom.value })
      ssp_data = Object.assign(ssp_data, { devices_list: devices_list.value })
      ssp_data = Object.assign(ssp_data, { chapters: result.sort((a, b) => collator.compare) })
      ssp_data = Object.assign(ssp_data, { chapter_keys: checkedKeys })
      ssp_data = Object.assign(ssp_data, { compliance_type: compliance_type.value })
      ssp_data = Object.assign(ssp_data, { compliance_list: compliance_list.value })
      ssp_data = Object.assign(ssp_data, { selectedFramework: selectedFramework.value })

      console.log("ssp_data: ", all_framework.value);
      var data = {
        template: {
          shortid: 'S1g2mhreON',
        },
        data: ssp_data,

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
        .post('http://localhost:3331/api/v1/ssp/report/ssp', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + accessToken
          } 
        })
        .then((response) => {
          store.commit('ssp/SET_STATE', { SSPLoading: false })
          downloadPdf_loading.value = false
          NProgress.done()
          if(response.data.statusCode == 200) {
            downloadPdf_loading.value = false
            const blob = new Blob([response.data.result], { type: 'text/html' })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            const d = new Date()
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            link.download = `${filteredStories.value[0].name.replace(
              ' ',
              '-',
            )}-ssp-${da}-${mo}-${ye}.html`
            link.click()
          } else {
            alert("Export failed");
          }
        })
        .catch((error) => {
          downloadPdf_loading.value = false
          store.commit('ssp/SET_STATE', { SSPLoading: false })

          NProgress.done()
        })
    }

    getData()

    const expandedKeys = ref([])
    const autoExpandParent = ref(true)

    const onExpand = (keys) => {
      expandedKeys.value = keys
      autoExpandParent.value = false
    }

    const check = (checkedArray, e) => {
      checkedKeys.value = checkedArray
    }
   const onCheck = (e) => {
      if(e.target.checked){
        checkedKeys.value = ['1', '2', '3', '4','4.1','4.2','4.3', '5', '6','6.1','6.2','6.3', '7','7.1','7.2', '8', '9','9.1','9.2','9.3', '10', '11', '12', '13', '14', '15', '16', '16.1', '16.2', '17', '18']
      }else{
        checkedKeys.value = []
      }
    }
    return {
      check,
      onCheck,
      checkedKeys,
      autoExpandParent,
      expandedKeys,
      onExpand,
      chapters,
      visible,
      showModal,
      confirm,
      getReport,
      filteredStories,
      loading,
      settingList,
      selectall
    }
  },

  methods: {},
}
</script>
