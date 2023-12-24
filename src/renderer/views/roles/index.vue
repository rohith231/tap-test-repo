<template>
  <div>
   
 
    <div class="row">
      <div class="col-lg-12 col-md-12">
          <div class="card card-top card-top-primary" >
            <div class="card-header py-0">
              <vb-headers-card-header-3 :loading="loading" :data="{ title: 'Roles' }" @search="search($event)" />

            </div>
             <div class="card-body">
             <template v-if="loading">
                  <a-skeleton active />
                  <a-skeleton active />
             </template>
             <template  v-else>
              <vb-tables-antd-2  :data="data"  :columns="columns"  @sort="sort($event)"  model='roles'  @delete-record="getData" />
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
  name: 'Users',
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
    let data = computed(() => store.getters['roles/roles'].list)
    const total = computed(() => store.getters['roles/roles'][`count`] )

    const getData = () => {
      
      store.dispatch('roles/GET_ROLES',{ payload: { pageNumber:pageNumber.value,itemsPerPage:itemsPerPage.value,query_search,sortKey, descSort}})
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
          sorter: (a, b) => a.name.length - b.name.length,
          
        },
        // {
        //   title: 'Users',
        //   dataIndex: 'users', // antd v4
        //   key: 'users',
        //   customRender: (value, row, index) => {
        //     var array = [];    
        //     if (value.record.users.length) {
        //         value.record.users.forEach(user => {
        //         array.push(h('a-tooltip',{placement:"top", title:user.display_name},h("div", { class: "vb__utils__avatar vb__utils__avatar--size46 vb__utils__avatar--rounded" }, h("a-avatar",  { size: "small",shape: "square" }, h("span", { class: " font-size-24 " },user.display_name.charAt(0) ? user.display_name.charAt(0).toUpperCase() : '') ))))
        //       });
        //   }
            
        //     return h('div', {class:'vb__utils__avatarGroup flex-shrink-0'},h('span',{ class: "font-weight-bold mr-4" } ,value.record.users.length == 0 ? '--------' : ''), array);

        //     }  
        // },
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
