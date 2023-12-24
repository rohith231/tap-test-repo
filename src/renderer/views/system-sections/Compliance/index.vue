<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card card-top card-top-primary">
          <div class="card-header py-0">
            <HeaderComponent
              :data="{ title: 'Compliance Overview' }"
              @search="search($event)"
              @data-type="getData"
            />
          </div>
          <div class="card-body">
            <template v-if="loading">
              <a-skeleton active />
              <a-skeleton active />
              <a-skeleton active />
            </template>
            <template v-else>
              <vb-tables-antd-2 :data="data" :columns="columns" @sort="sort($event)" 
                :has-extra-control="true"/>
              <pagination
                :total="total"
                :page-number="pageNumber"
                :items-per-page="itemsPerPage"
                @changePagination="changePagination($event)"
              />

              <div class="mt-4 text-center" v-if="selectedType === 'Controls'">
                <span class="badge badge-green mr-2 m-l-75">VALIDATION PASSED</span>
                <span class="badge badge-red mr-2">VALIDATION FAILED</span>
                <span class="badge badge-secondary mr-2">MANUAL VALIDATION REQUIRED</span>
                <span class="badge badge-yellow mr-2">MANUAL REMEDIATION REQUIRED</span>
              </div>
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
import HeaderComponent from './header'

import pagination from '@/@vb/components/Pagination'
import { computed, h, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'POAMs',
  components: {
    HeaderComponent,
    VbTablesAntd2,
  },
  setup() {
    // console.log('setup')

    let itemsPerPage = ref(10)
    let pageNumber = ref(1)
    const store = useStore()
    let query_search,
      timeout,
      sortKey,
      descSort,
      order = null
    const loading = computed(() => store.getters['compliance/compliance'].loading)
    let data = computed(() => store.getters['compliance/compliance'].list)
    const total = computed(() => store.getters['compliance/compliance'].count)
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    let columns_Target = [
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
        customRender: (value, row, index) => {
          if (value.record.status == 'COMPLIANT') {
            // return h('span', { class: 'badge badge-success' }, 'COMPLIANT')
            return h(
              'div',
              {class:'progress',style:'width:250px;height:1.5rem'},
              h('div', { class: 'progress-bar', style:`background-color: #5cb85c; width:${value.record.passPercentage}%`},Math.round(value.record.passPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #d9534f;width:${value.record.failPercentage}%` },Math.round(value.record.failPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #f0ad4e;width:${value.record.otherPercentage}%` },Math.round(value.record.otherPercentage*100)/100+'%'),
            )
          } else if (value.record.status == 'NON-COMPLIANT') {
            // return h('span', { class: 'badge badge-danger' }, 'NON-COMPLIANT')
            return h(
              'div',
              {class:'progress',style:'width:250px;height:1.5rem'},
              h('div', { class: 'progress-bar', style:`background-color: #5cb85c; width:${value.record.passPercentage}%`},Math.round(value.record.passPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #d9534f;width:${value.record.failPercentage}%` },Math.round(value.record.failPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #f0ad4e;width:${value.record.otherPercentage}%` },Math.round(value.record.otherPercentage*100)/100+'%'),
            )
          } else {
            return h('span', { class: 'badge badge-light' }, 'WAITING')
          }
        },
      },
      {
        title: 'IP',
        dataIndex: 'ip_addr',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Mac address',
        dataIndex: 'mac_address',
        sorter: true,
        sortDirections: ['ascend', 'descend', 'ascend'],
      },

      {
        title: 'Report',
        slots: { customRender: 'download_report' },
      },
    ]
    let columns_Controls = [
      {
        title: 'Status',
        dataIndex: 'status',
        customRender: (value, row, index) => {
          if (value.record.status == 'COMPLIANT' || value.record.status == 'NON-COMPLIANT' || value.record.status == 'NOT-APPLICABLE') {
            // return h('span', { class: 'badge badge-success' }, 'COMPLIANT')
            return h(
              'div',
              {class:'progress',style:'width:250px;height:1.5rem'},
              h('div', { class: 'progress-bar', style:`background-color: #5cb85c; width:${value.record.passPercentage}%`},Math.round(value.record.passPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #d9534f;width:${value.record.failPercentage}%` },Math.round(value.record.failPercentage*100)/100+'%'),
              h('div', { class: 'progress-bar',style:`background-color: #f0ad4e;width:${value.record.otherPercentage}%` },Math.round(value.record.otherPercentage*100)/100+'%'),
            )
          // } else if (value.record.status == 'NON-COMPLIANT') {
          //   return h('span', { class: 'badge badge-danger' }, 'NON-COMPLIANT')
          // } else if (value.record.status == 'NOT-APPLICABLE') {
          //   return h('span', { class: 'badge badge-light' }, 'NOT-APPLICABLE')
          } else {
            return h('span', { class: 'badge badge-light' }, 'WAITING')
          }
        },
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Validation Controls',
        dataIndex: 'vulnerabilities',
        slots: { customRender: 'vulnerabilities' },
      },
      {
        title: 'Download Report',
        slots: { customRender: 'download_report' },
      },
    ]
    let selectedType = ref('Target')

    var columns = (columns = computed(() => eval(`columns_${selectedType.value}`)))
    const getData = (type = 'Target') => {
      selectedType.value = type
      if (type == 'Target') {
        store.dispatch('compliance/GET_DEVICES', {
          payload: {
            system_id: selectedSystem.value,
            framework: selectedFramework.value,
            pageNumber: pageNumber.value,
            itemsPerPage: itemsPerPage.value,
            query_search,
            sortKey,
            descSort,
          },
        })
      } else {
        store.dispatch('compliance/GET_CONTROLLERS', {
          payload: {
            system_id: selectedSystem.value,
            framework: selectedFramework.value,
            pageNumber: pageNumber.value,
            itemsPerPage: itemsPerPage.value,
            query_search,
            sortKey,
            descSort,
          },
        })
      }
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

    onMounted(() => {
      getData()
    })
    return {
      columns,
      search,
      getData,
      sort,
      changePagination,
      itemsPerPage,
      pageNumber,
      data,
      total,
      loading,
      selectedType,
    }
  },
  data() {
    return {}
  },
}
</script>
<style scoped>
.badge-yellow {
  background-color: #f9cb9c;
  color: white;
}
.progress {
  overflow: hidden;
  width: 250px;
  height: 1.5rem;
  margin: 10px 0;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1)
}
.progress-bar {
  float: left;
  width: 0%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width .6s ease;
  -o-transition: width .6s ease;
  transition: width .6s ease
}
.badge-red {
  background: #fff1f0;
  border-color: #ffa39e;
      border: 0.5px solid;
  color: #cf1322;
}

.badge-green {
  background: #f6ffed;
  border-color:  #b7eb8f;
  color: #389e0d;
  border: 0.5px solid;
}

.m-l-75 {
  margin-left: 75px;
}
</style>
