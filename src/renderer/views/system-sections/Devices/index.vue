<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <vb-headers-card-header-3
              :loading="loading"
              :data="{ title: 'Target(s)' }"
              @search="search($event)"
            />
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
                model="device"
                @delete-record="getData"
                :has-extra-target="true"
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
  </div>
</template>

<script>
import VbHeadersCardHeader3 from '@/@vb/widgets/Headers/CardHeader3'
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, h, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Target(s)',
  components: {
    pagination,
    VbHeadersCardHeader3,
    VbTablesAntd2,
  },
  setup() {
    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    const store = useStore()
    let query_search,catquery_search,
      timeout,
      sortKey,
      descSort,
      order = null
    const loading = computed(() => store.getters['user/user'].loading)
    let data = computed(() => store.getters['device/device'].list)
    const total = computed(() => store.getters['device/device'].count)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    const getData = () => {
      store.dispatch('device/GET_ALL', {
        payload: {
          system_id: selectedSystem.value,
          pageNumber: pageNumber.value,
          itemsPerPage: itemsPerPage.value,
          query_search,
          catquery_search,
          sortKey,
          descSort
        },
      })

    }

    const changePagination = (data) => {
      console.log("data: ",data);
      itemsPerPage.value = data.sortKey || itemsPerPage.value
      pageNumber.value = data.pageNumber || 1
      getData()
    }
    const search = (value) => {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        catquery_search = value
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
    console.log("data: ", data);
    })
    getData()
    return {
      getData,
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
      columns: [
        {
          title: 'Target(s) Type',
          dataIndex: 'name',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        // {
        //   title: 'Host',
        //   dataIndex: 'host_name',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        // },
        // {
        //   title: 'OS',
        //   dataIndex: 'os_type',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        // },
        // {
        //   title: 'Mac Address',
        //   dataIndex: 'mac_address',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        // },
        // {
        //   title: 'Status',
        //   dataIndex: 'connectable',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        //   customRender: (value, row, index) => {
        //     if (value.record.connectable) {
        //       return h('span', { class: 'badge badge-success' }, 'CONNECTED')
        //     } else if (value.record.touched_at == null) {
        //       return h('span', { class: 'badge badge-light' }, 'WAITING')
        //     } else {
        //       return h('span', { class: 'badge badge-danger' }, 'FAILED CONNECTION')
        //     }
        //   },
        // },
        // {
        //   title: 'Validate',
        //   dataIndex: 'validate',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        //   customRender: (value, row, index) => {
        //     if (value.record.validate) {
        //       return h(
        //         'a-badge',
        //         {},
        //         h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
        //       )
        //     } else {
        //       return h(
        //         'a-badge',
        //         {},
        //         h('i', {
        //           class: 'fas fa-exclamation-circle',
        //           style: 'color: #faad15;font-size: 16px;',
        //         }),
        //       )
        //     }
        //   },
        // },

        // {
        //   title: 'Remediate',
        //   dataIndex: 'remediate',
        //   sorter: true,
        //   sortDirections: ['ascend', 'descend', 'ascend'],
        //   customRender: (value, row, index) => {
        //     if (value.record.remediate) {
        //       return h(
        //         'a-badge',
        //         {},
        //         h('i', { class: 'fas fa-check-circle', style: 'color: green;font-size: 16px;' }),
        //       )
        //     } else {
        //       return h(
        //         'a-badge',
        //         {},
        //         h('i', {
        //           class: 'fas fa-exclamation-circle',
        //           style: 'color: #faad15;font-size: 16px;',
        //         }),
        //       )
        //     }
        //   },
        // },
        {
          title: 'Action',
          slots: { customRender: 'action' },
        },
      ],
    }
  },
  mounted() {},
}
</script>
<style scoped>
.anticon svg {
  display: inline-block;
  height: 14px;
}
</style>