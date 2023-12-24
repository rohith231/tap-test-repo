<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
          <div class="card card-top card-top-primary" >
            <div class="card-header py-0">
              <vb-headers-card-header-3 :loading="loading" :data="{ title: title }" @search="search($event)" />
            </div>
            <div class="card-body">
             <template v-if="loading">
                  <a-skeleton active />
                  <a-skeleton active />
             </template>
             <template  v-else>
              <vb-tables-antd-2  :data="data"  :columns="columns"  @sort="sort($event)" />
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
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
export default {
  name: 'NISTControls',
  components: {
    pagination,
    VbHeadersCardHeader3,
    VbTablesAntd2,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    let itemsPerPage = ref(10);
    let pageNumber = ref(1);
    let query_search, timeout, sortKey, descSort, order = null;
    const framework = computed(() => route.params.framework)

    const columns_NIST800171R2 = [       
    {
      title: 'Number',
      dataIndex: 'number',
      width: '11%',
      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
        {
      title: 'Description',
      dataIndex: 'title',
      width: '35%',
      // sorter: (a, b) => a.title.length - b.title.length,
      
    },
              {
      title: 'Family',
      dataIndex: 'family',
      width: '20%',
      // sorter: (a, b) => a.family.length - b.family.length,
      
    },
              {
      title: 'DoD Value',
      dataIndex: 'DoD_value',
      width: '8%',

      
    },
   {
      title: 'NIST 800-53 r4 Controls',
      dataIndex: 'NIST80053r4_controls',
      slots: { customRender: 'NIST80053r4_controls' },

    }]
    const columns_NIST80053R4 = [       
    {
      title: 'Number',
      dataIndex: 'number',
      width: '14%',
      // sorter: (a, b) => a.number.length - b.number.length,
      // defaultSortOrder: order
      sorter:false
    },
        {
      title: 'Title',
      dataIndex: 'title',
      width: '33%',
      // sorter: (a, b) => a.title.length - b.title.length,
      sorter:false

      
    },
    {
      title: 'Family',
      dataIndex: 'family',
      width: '18%',
      // sorter: (a, b) => a.family.length - b.family.length,
      sorter:false
      
    },
              {
      title: 'Impact',
      dataIndex: 'baseline_impact',
      width: '20%',

      slots: { customRender: 'baseline_impact' },
      sorter:false
      
    },
            {
      title: 'Priority',
      dataIndex: 'priority',
      width: '8%',
      
    }]
    const columns_NIST80053R5 = [       
    {
      title: 'Number',
      dataIndex: 'number',
      width: '14%',
      // sorter: (a, b) => a.number.length - b.number.length,
      // defaultSortOrder: order
      sorter:false
    },
        {
      title: 'Title',
      dataIndex: 'title',
      width: '33%',
      // sorter: (a, b) => a.title.length - b.title.length,
      sorter:false

      
    },
    {
      title: 'Family',
      dataIndex: 'family',
      width: '18%',
      // sorter: (a, b) => a.family.length - b.family.length,
      sorter:false
      
    },
              {
      title: 'Impact',
      dataIndex: 'baseline_impact',
      width: '20%',

      slots: { customRender: 'baseline_impact' },
      sorter:false
      
    },
            {
      title: 'Priority',
      dataIndex: 'priority',
      width: '8%',
      
    }]
    const loading = computed(() => store.getters['controls/loading'])
    let title = computed(() => framework.value == 'NIST800171R2' ? 'NIST 800-171 r2' : (framework.value == 'NIST80053R4' ? 'NIST 800-53 r4' : 'NIST 800-53 r5'))
    let columns = computed(() => eval(`columns_${framework.value}`) )
    let data = computed(() => store.getters['controls/controls'][`list_${framework.value}`] )
    let total = computed(() => store.getters['controls/controls'][`count_${framework.value}`] )
    watch(framework, framework => {
         itemsPerPage.value = 10
            pageNumber.value = 1
            query_search = ''
            if(framework){
              getData()
            }

      })
 

    const getData = () => {
      store.dispatch('controls/GET_CONTROLS',{ payload: {framework: framework.value, pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort}})
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
      search,
      sort,
      changePagination,
      itemsPerPage,
      pageNumber,
      title,
      data,
      total,
      loading,
      columns
    }
  },

  
 
}
</script>
