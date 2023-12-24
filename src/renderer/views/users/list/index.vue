<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <vb-headers-card-header-3
              :loading="loading"
              :data="{ title: 'Users' }"
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
                model="users"
                @sort="sort($event)"
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
</template>

<script>
import VbHeadersCardHeader3 from '@/@vb/widgets/Headers/CardHeader3'
import VbTablesAntd2 from '@/@vb/widgets/TablesAntd/2'
import pagination from '@/@vb/components/Pagination'
import { computed, ref, h } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Users',
  components: {
    pagination,
    VbHeadersCardHeader3,
    VbTablesAntd2,
  },
  setup() {
    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    let query_search,
      timeout,
      sortKey,
      descSort,
      order = null
    const store = useStore()
    const loading = computed(() => store.getters['user/user'].loading)
    const data = computed(() => store.getters['users/users'].list)
    const total = computed(() => store.getters['users/users'].total)

    const getData = () => {
      store.dispatch('users/GET_USERS', {
        payload: {
          pageNumber: pageNumber.value,
          itemsPerPage: itemsPerPage.value,
          query_search,
          sortKey,
          descSort,
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
        query_search = value
        ;(itemsPerPage.value = 10), (pageNumber.value = 1), getData()
      }, 1000)
    }
    const sort = (data) => {
      sortKey = data.sortKey
      descSort = data.descSort
      order = data.order

      getData()
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
      loading,
    }
  },
  data() {
    return {
      columns: [
        {
          title: 'First Name',
          dataIndex: 'first_name',
          width: '15%',
          sorter: (a, b) => a.first_name.length - b.first_name.length,
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name',
          width: '15%',
          sorter: (a, b) => a.last_name.length - b.last_name.length,
          onFilter: (value, record) => record.customer.toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: 'Username',
          dataIndex: 'user_name',
          sorter: (a, b) => a.user_name - b.user_name,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          sorter: (a, b) => a.email - b.email,
        },
        {
          title: 'Roles',
          dataIndex: 'Roles',
          customRender: (value, row, index) => {
            var array = []
            // console.log(value.record);
            if (value.record.Roles.length) {
              value.record.Roles.forEach((role) => {
                array.push(
                  h(
                    'span',
                    {
                      class: 'ant-tag ant-tag-geekblue',
                      key: role,
                    },
                    role.name,
                  ),
                )
              })
            } else {
              array.push(h('span', '---'))
            }
            return h('div', array)
          },
        },
        {
          title: 'Action',
          slots: {
            customRender: 'action',
          },
          width: '20%',
        },
      ],
    }
  },
}
</script>
