<template>
  <div>
   
 
    <div class="row">
      <div class="col-lg-12 col-md-12">

        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <vb-headers-card-header-tabbed-5
              :data="{ title: 'Deviations' }"
              @data-type="getData" 
               @search="search" 
            />
          </div>
          <div class="card-body">
            <template v-if="loading">
                  <a-skeleton active />
                  <a-skeleton active />
             </template>
             <template  v-else>
              <vb-tables-antd-2  :data="data"  :columns="columns" model='deviations'  @sort="sort($event)" @delete-record="getData(selectedType)"/>
              <pagination :total="total" :page-number="pageNumber" :items-per-page="itemsPerPage" @changePagination="changePagination($event)" />
             </template>

          </div>
        </div>
      </div>
    </div>

 
    </div>
</template>

<script>
import VbHeadersCardHeaderTabbed5 from '@/@vb/widgets/Headers/CardHeaderTabbed5'
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, ref, h } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Deviations',
  components: {
    VbHeadersCardHeaderTabbed5,
    VbTablesAntd2,
    pagination,
  },
  setup() {
   
    let title = 'Deviations'
    let itemsPerPage = ref(10);
    let pageNumber = ref(1);
    let query_search = null, timeout, sortKey, descSort ,status = null, order = null;
    let selectedType = ref('deviations')
    const store = useStore()
    const columns_deviations = [       
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
        {
      title: 'Created On',
      dataIndex: 'createdAt',
      width: '35%',
      // sorter: (a, b) => a.title.length - b.title.length,
      
    },
    {
          title: 'Action',
          slots: { customRender: 'actionRemove' },
    }
    ]

    const columns_Vulnerabilities = [       
        {
      title: 'Set',
      dataIndex: 'done',
       width: '4%',
       customRender: (value, row, index) => {
         if(value.record.commands){
           if (value.record.commands.done) {
             return h('i', {class:'align-text-bottom fa fa-check-circle-o  text-success ml-2 font-size-24'} );
           }else{
             return h('i', {class:'align-text-bottom fa fa-times-circle-o text-danger ml-2 font-size-24'} );
           }
         }else{
             return h('i', {class:'align-text-bottom fa fa-times-circle-o text-danger ml-2 font-size-24'} );
           }

        }
      
    },
    {
      title: 'Vulnerability Number',
      dataIndex: 'vuln_num',
       width: '15%',

      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
       {
      title: 'Rule ID',
      dataIndex: 'rule_id',

      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
           {
      title: 'Severity',
      dataIndex: 'severity',
       width: '8%',

      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
            {
      title: 'IA Controls',
      dataIndex: 'ia_controls',
       width: '8%',

      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
             {
      title: 'CCI Ref',
      dataIndex: 'cci_ref',
       width: '10%',

      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
             {
      title: 'Group Title',
      dataIndex: 'group_title',
      // sorter: (a, b) => a.number.length - b.number.length,
      
    },
  
    {
          title: 'Action',
          slots: { customRender: 'commandDeviations' },
    }
    ]
    let columns = computed(() => eval(`columns_${selectedType.value}`) )

    const loading = computed(() => store.getters['deviations/deviations'].loading)
    const data = computed(() => store.getters['deviations/deviations'].list)
    const total = computed(() => store.getters['deviations/deviations'].count)



    const getData = (type = selectedType.value) => {
      selectedType.value = type
      columns = computed(() => eval(`columns_${selectedType.value}`) )
      if(type == 'deviations'){
        store.dispatch('deviations/GET',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort,status}})
      }else if (type == 'Vulnerabilities'){
        store.dispatch('deviations/GET_ALL_VULNERABILITIES',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort,status}})
      }
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
      selectedType,
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
