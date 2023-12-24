<template>
    <div class="row">
      <div class="col-lg-12 col-md-12">
          <div class="card card-top card-top-primary" >
            <div class="card-header py-0">
              <vb-headers-card-header-3 :loading="loading" :data="{ title: 'POA&Ms' }" @search="search($event)" />
            </div>
             <div class="card-body">
             <template v-if="loading">
                  <a-skeleton active />
                  <a-skeleton active />
             </template>
             <template  v-else>
              <vb-tables-antd-2
                :data="data"  :columns="columns" 
                :events="{
                  delete:'delete-record'
                }"  @delete-record="deleteRecord" @sort="sort($event)" />
              <pagination :total="total" :page-number="pageNumber" :items-per-page="itemsPerPage" @changePagination="changePagination($event)" />
             </template>
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
import { encryptStorage } from '@/utils'

export default {
  name: 'POAMs',
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
    let data = computed(() => store.getters['checkControls/checkControls'].list_pomas)
    const total = computed(() => store.getters['checkControls/checkControls'].count_pomas )
    let selectedSystem = computed(() => store.getters['user/selectedSystem']);
    let selectedFramework = computed(() => store.getters['user/selectedFramework']);

    const getData = () => {
        store.dispatch('checkControls/GET_POAMS',{ payload: { framework:selectedFramework.value,system_id:selectedSystem.value,pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort}})
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
    const deleteRecord = (data = null) => {


      store.dispatch(`${props.model}/DELETE`, {
              payload: {
                id: data.record.id
              }
            })
      getData();
    }
    const sort = (data) => {
          sortKey = data.sortKey
          descSort = data.descSort
          order = data.order
          getData();
    }

 
        
    getData()

    watch(selectedSystem, selectedSystem => {
      getData();
    })
    watch(selectedFramework, selectedFramework => {
      getData();
    })

    return {
      search,
      sort,
      deleteRecord,
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
          title: 'Weakness name',
          dataIndex: 'weak_name',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          
        },
        {
          title: 'idnt',
          dataIndex: 'idnt',
          sorter: true,
          sortDirections: ['ascend', 'descend', 'ascend'],
          
        },{
          title: 'Action',
          dataIndex: 'action',
           customRender: (value, row, index) => {
            //  const view = (record) => {
            //   this.$router.push( record )   
            //   }
             let id, extra = null
            if(value.record.NIST800171R2CheckControl){
              extra = `?control_number=${value.record.NIST800171R2CheckControl.control_number}`
              id = value.record.NIST800171R2CheckControl ? value.record.NIST800171R2CheckControl.id : null
              extra += value.record.NIST800171R2CheckControl ?  `&NIST80053r4_controls=${value.record.NIST80053r4_controls}` : ''

            }else if(value.record.NIST80053R4CheckControl){
                            extra = `?control_number=${value.record.NIST80053R4CheckControl.control_number}`

              id = value.record.NIST80053R4CheckControl ? value.record.NIST80053R4CheckControl.id : null
            }else if(value.record.NIST80053R5CheckControl){
                            extra = `?control_number=${value.record.NIST80053R5CheckControl.control_number}`

              id = value.record.NIST80053R5CheckControl ? value.record.NIST80053R5CheckControl.id : null
            }
               
                      //  

               
               return h('a', {class:'btn btn-sm btn-light m-1','data-path':`/framework-controls/profile/${id}`+(extra || ''),
                 onClick: $event => this.$router.push( $event.srcElement.dataset.path)
               }, 'View' );

          }
          
        }]
    };
  },
  mounted(){

  }
 
}
</script>
