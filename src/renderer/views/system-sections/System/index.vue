<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
          <div class="card card-top card-top-primary" >
            <div class="card-header py-0">
              <vb-headers-card-header-3 :loading="loading" :data="{ title: 'Systems' }" @search="search($event)" />
            </div>
             <div class="card-body">
             <template v-if="loading">
                  <a-skeleton active />
                  <a-skeleton active />
             </template>
             <template  v-else>
              <vb-tables-antd-2 :data="data" :columns="columns"  @sort="sort($event)" model='systems'  @delete-record="getData"/>
              <pagination :total="total" :page-number="pageNumber" :items-per-page="itemsPerPage" @changePagination="changePagination($event)" />
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
import { computed, h,  ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Systems',
  components: {
    pagination,
    VbHeadersCardHeader3,
    VbTablesAntd2,
  },
  setup() {
    let itemsPerPage = ref(10);
    let pageNumber = ref(1);
    const store = useStore()
    let query_search, timeout, sortKey, descSort, order = null;
    const loading = computed(() => store.getters['user/user'].loading)
    let data = computed(() => store.getters['systems/systems'].list)
    const total = computed(() => store.getters['systems/systems'].count )

    const getData = () => {

      store.dispatch('systems/GET_ALL',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort}})
    }

    const changePagination = (data) => {
      itemsPerPage.value = data.itemsPerPage || itemsPerPage.value
      pageNumber.value = data.pageNumber || 1
      getData()

    }
    const search = (value) => {
      clearTimeout(timeout);

      timeout = setTimeout(() =>{
            query_search = value
            itemsPerPage.value = 10,
            pageNumber.value = 1,
            getData();
        },1300);
    }
    const sort = (data) => {
          sortKey = data.sortKey
          descSort = data.descSort
          order = data.order
          
          getData();
    }
 
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
      loading
    }
  },

  data() {
    return {
      columns: [       
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          
        },
        {
          title: 'Abbreviation',
          dataIndex: 'abbreviation',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          
        },
                {
          title: 'Identifier',
          dataIndex: 'identifier',
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
              return h('span', { class: 'badge badge-success' }, 'Active');
            } else if (value.record.touched_at == null) {
              return h('span', { class: 'badge badge-light' }, 'InActive');
            }

          }
          
        },
       
        {
          title: 'Action',
          slots: { customRender: 'action' },
        }]
    };
  },
  mounted(){

  }
 
}
</script>
<style scoped>
.anticon svg {
    display: inline-block;
    height: 14px;
}
</style>