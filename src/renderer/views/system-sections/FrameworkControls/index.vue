<template>
  <div class="row">
    <div class="col-lg-12 col-md-12">
      <div class="card card-top card-top-primary">
        <div class="card-header py-0">
          <div class="card-header-flex align-items-center">
            <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
              <h5 class="mb-0">
                <div class="vb__utils__heading">
                  <strong> Framework Controls </strong>
                </div>
              </h5>
            </div>
            <div>
              <span>
                <a-input
                  class="mr-2 float-left"
                  placeholder="Search..."
                  v-model:value="value"
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
              model="framework-controls"
              @delete-record="getData"
              :has-extra="true"
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
</template>



<script>
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, h, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'FrameworkControls',
  components: {
    pagination,
    VbTablesAntd2,
  },
  setup() {
    const value = ref('')

    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    const store = useStore()
    let query_search,
      timeout,
      sortKey = 'number',
      descSort,
      order = null
    const loading = computed(() => store.getters['user/user'].loading)
    let data = computed(() => store.getters['checkControls/checkControls'].list_framework)
    const total = computed(() => store.getters['checkControls/checkControls'].count_framework)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    let q_search = ''

    const columns_NIST800171R2 = [
      {
        title: 'Number',
        dataIndex: 'number',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Description',
        dataIndex: 'title',
        width: '18%',

        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: (a, b) => a.title.length - b.title.length,
      },
      {
        title: 'Family',
        dataIndex: 'family',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: (a, b) => a.family.length - b.family.length,
      },
      {
        title: 'DoD Value',
        dataIndex: 'DoD_value',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'NIST 800-53 r4',
        dataIndex: 'NIST80053r4_controls',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        slots: { customRender: 'NIST80053r4_controls' },
      },
      {
        title: 'Validate',
        dataIndex: 'validate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST800171R2CheckControl &&
            value.record.NIST800171R2CheckControl.validate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'Remediate',
        dataIndex: 'remediate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST800171R2CheckControl &&
            value.record.NIST800171R2CheckControl.remediate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'View',
        slots: { customRender: 'actionView' },
      },
    ]
    const columns_NIST80053R4 = [
      {
        title: 'Number',
        dataIndex: 'number',
        defaultSortOrder: 'ascend',
        // sorter: (a, b) => a.number.length - b.number.length,
        // defaultSortOrder: order
        sorter: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: '18%',

        // sorter: (a, b) => a.title.length - b.title.length,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Family',
        dataIndex: 'family',
        // sorter: (a, b) => a.family.length - b.family.length,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Impact',
        dataIndex: 'baseline_impact',

        slots: { customRender: 'baseline_impact' },
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Validate',
        dataIndex: 'validate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST80053R4CheckControl &&
            value.record.NIST80053R4CheckControl.validate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'Remediate',
        dataIndex: 'remediate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST80053R4CheckControl &&
            value.record.NIST80053R4CheckControl.remediate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'View',
        slots: { customRender: 'actionView' },
      },
    ]
    const columns_NIST80053R5 = [
      {
        title: 'Number',
        dataIndex: 'number',
        defaultSortOrder: 'ascend',
        // sorter: (a, b) => a.number.length - b.number.length,
        // defaultSortOrder: order
        sorter: true,
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: '18%',

        // sorter: (a, b) => a.title.length - b.title.length,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Family',
        dataIndex: 'family',
        // sorter: (a, b) => a.family.length - b.family.length,
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Impact',
        dataIndex: 'baseline_impact',

        slots: { customRender: 'baseline_impact' },
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Validate',
        dataIndex: 'validate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST80053R5CheckControl &&
            value.record.NIST80053R5CheckControl.validate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'Remediate',
        dataIndex: 'remediate',
        customRender: (value, row, index) => {
          if (
            value.record.NIST80053R5CheckControl &&
            value.record.NIST80053R5CheckControl.remediate
          ) {
            return h(
              'a-badge',
              {},
              h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
            )
          } else {
            return h(
              'a-badge',
              {},
              h('i', {
                class: 'fas fa-exclamation-circle',
                style: 'color: #faad15;font-size: 16px;',
              }),
            )
          }
        },
      },
      {
        title: 'View',
        slots: { customRender: 'actionView' },
      },
    ]

    let columns = computed(() => eval(`columns_${selectedFramework.value}`))

    const getData = () => {
      store.dispatch('checkControls/GET_SUB', {
        payload: {
          system_id: selectedSystem.value,
          framework_id: 1,
          pageNumber: pageNumber.value,
          itemsPerPage: itemsPerPage.value,
          query_search,
          sortKey,
          descSort,
          framework: selectedFramework.value,
        },
      })
    }

    const changePagination = (data) => {
      itemsPerPage.value = data.itemsPerPage || itemsPerPage.value
      pageNumber.value = data.pageNumber || 1
      getData()
    }
    const search = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        query_search = value.value
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
    watch(selectedFramework, (selectedFramework) => {
      getData()
    })
    watch(q_search, (q_search) => {
      search(q_search)
    })

    getData()

    return {
      getData,
      columns,
      value,
      q_search,
      search,
      sort,
      changePagination,
      itemsPerPage,
      pageNumber,
      data,
      total,
      loading,
    }
  },
  data() {
    return {
      form: {
        subnet: '',
        description: '',
        status: true,
      },
      btnloading: false,
      visible: false,
    }
  },
  methods: {
    sw() {
      // console.log("sw");
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.btnloading = true
      setTimeout(() => {
        this.visible = false
        this.btnloading = false
      }, 3000)
    },
    handleCancel(e) {
      this.visible = false
    },
  },
}
</script>


<style lang="scss" module>
@import './style.module.scss';
</style>
