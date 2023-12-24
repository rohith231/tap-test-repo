<template>
  <div>


    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <vb-headers-card-header-tabbed-5
              :data="{ title: 'STIGs' }"
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
              <vb-tables-antd-2  :data="data"  :columns="columns" model='STIGs' @sort="sort($event)"  @delete-record="getData(selectedType)"/>
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
  name: 'STIGs',
  components: {
    VbHeadersCardHeaderTabbed5,
    VbTablesAntd2,
    pagination,
  },
  setup() {
    let title = 'STIGs'
    let itemsPerPage = ref(10);
    let pageNumber = ref(1);
    let query_search = null, timeout, sortKey, descSort ,status = null, order = null;
    let selectedType = ref('STIGs')

    const store = useStore()
//  [
//       {text: 'Name', align: 'left', sortable: true, value: 'name', allwaysVisible: true},
//       {text: 'Created On', align: 'left', sortable: true, value: 'createdAt', allwaysVisible: true},
//       {text: 'Status', align: 'left', sortable: false, value: 'status'},
//       {text: 'Count', align: 'left', sortable: false, value: 'Vulnerabilities', allwaysVisible: true},
//       {text: 'Actions', align: 'left', sortable: false, value: 'action', allwaysVisible: true},
//     ]
    const columns_STIGs = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      // sorter: (a, b) => a.number.length - b.number.length,

    },
    {
      title: 'STIG Reference',
      dataIndex: 'stigref',
      width: '35%',
      // sorter: (a, b) => a.title.length - b.title.length,

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
      key:'done',
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
      sorter: true,
       width: '15%',
       key:'vuln_num'

      // sorter: (a, b) => a.number.length - b.number.length,

    },
       {
      title: 'Rule ID',
      dataIndex: 'rule_id',
      key:'rule_id'

      // sorter: (a, b) => a.number.length - b.number.length,

    },
           {
      title: 'Severity',
      dataIndex: 'severity',
       width: '8%',
       key:'severity',
       sorter: true

      // sorter: (a, b) => a.number.length - b.number.length,

    },
            {
      title: 'IA Controls',
      dataIndex: 'ia_controls',
      key:'ia_controls',
       width: '8%',

      // sorter: (a, b) => a.number.length - b.number.length,

    },
             {
      title: 'CCI Ref',
      dataIndex: 'cci_ref',
      key:'cci_ref',
       width: '10%',

      // sorter: (a, b) => a.number.length - b.number.length,

    },
             {
      title: 'Group Title',
      dataIndex: 'group_title',
      key:'group_title'
      // sorter: (a, b) => a.number.length - b.number.length,

    },

    {
          title: 'Action',
          key:'action',
          slots: { customRender: 'commandSTIGs' },
    }
    ]
    let columns = computed(() => eval(`columns_${selectedType.value}`) )

    const loading = computed(() => store.getters['STIGs/STIGs'].loading)
    const data = computed(() => store.getters['STIGs/STIGs'].list)
    const total = computed(() => store.getters['STIGs/STIGs'].count)



    const getData = (type = selectedType.value) => {
      selectedType.value = type
      columns = computed(() => eval(`columns_${selectedType.value}`) )
      if(type == 'STIGs'){
        store.dispatch('STIGs/GET',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort,status}})
      }else if (type == 'Vulnerabilities'){
        store.dispatch('STIGs/GET_ALL_VULNERABILITIES',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort,status}})
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
          order = order===null ? 'asc' : order==='asc' && sortKey === data.sortKey ? 'desc' : 'asc'
          sortKey = data.sortKey
          descSort = order === 'desc'
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
