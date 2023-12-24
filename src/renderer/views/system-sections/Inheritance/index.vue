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
                    <strong> Inheritance </strong>
                  </div>
                </h5>
              </div>
              <div></div>
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
                @delete-record="getData"
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

  <!-- model -->

  <a-modal v-model:visible="visible" title="Title">
    <template #footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" :loading="btnloading" @click="handleOk">
        Save
      </a-button>
    </template>
    <a-form ref="ruleForm" :model="form" :label-col="{ span: 5 }">
      <a-form-item ref="subnet" label="Subnet">
        <a-input v-model="form.name" />
      </a-form-item>
      <a-form-item label="Description" ref="description">
        <a-textarea :rows="3" />
      </a-form-item>

      <a-form-item v-bind="form.sleep" label="Switch">
        <a-switch />
      </a-form-item>
      <!-- <a-switch    @change="sw"  v-decorator="['switch', { valuePropName: 'checked' }]"  checked-children="Active" un-checked-children="Inactive" /> -->
    </a-form>
  </a-modal>
</template>



<script>
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, h, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'CustomControls',
  components: {
    pagination,
    VbTablesAntd2,
  },
  setup() {
    let itemsPerPage = ref(50)
    let pageNumber = ref(1)
    const store = useStore()
    let query_search,
      timeout,
      sortKey,
      descSort,
      order = null
    const loading = computed(() => store.getters['user/user'].loading)
    let data = computed(() => store.getters['checkControls/checkControls'].list)
    const total = computed(() => store.getters['checkControls/checkControls'].count)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    let q_search = ''
    const getData = () => {
      store.dispatch('checkControls/GET_INHERITANCE', {
        payload: {
          system_id: selectedSystem.value,
          framework_id: -1,
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
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'System',
          dataIndex: 'system',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'Inheritor',
          dataIndex: 'sensitivity_level',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'Created',
          dataIndex: 'createdAt',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
          title: 'Validation Controls',
          dataIndex: 'validation_controls',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          slots: { customRender: 'NIST80053r4_controls' },
        },
        {
          title: 'Type',
          dataIndex: 'control_type',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
      ],
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
