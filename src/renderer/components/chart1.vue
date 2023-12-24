

<template>
  <a-skeleton active v-show="GET_CHARTS_AUDIT_CONTROLLERS_LOADING" />
  <div id="container" style="height: 400px"></div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { encryptStorage } from '@/utils'

function createChart() {
  return Highcharts.chart('container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: '',
        align: 'left'
    },
    tooltip: {
       pointFormat: '{series.name} <b>{point.percentage:.1f}%</b>'
    },
    /*accessibility: {
        point: {
            valueSuffix: '%'
        }
    },*/
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
      name:'',
      data: []
    }]
  })
}
export default defineComponent({
  name: 'App',
  components: {

  },
  data() {
    chartData: []
  },
  watch: {
    chartData(data) {
      this.chart.series[0].setData(data)
      this.chart.redraw()
    }
  },
  mounted() {
    
    const store = useStore()
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])

    const GET_CHARTS_AUDIT_CONTROLLERS_LOADING = computed(
      () => store.getters['dashboard/dashboard'].GET_CHARTS_AUDIT_CONTROLLERS_LOADING,
    )
    const GET_CHARTS_AUDIT_CONTROLLERS = computed(
      () => store.getters['dashboard/dashboard'].GET_CHARTS_AUDIT_CONTROLLERS
    )
     const getData= () =>{
    store.dispatch('dashboard/GET_CHARTS_AUDIT_CONTROLLERS', {
        payload: {
          system_id: encryptStorage.getItem(`selectedSystem`),
          framework: encryptStorage.getItem(`selectedFramework`),
        },
      })
     }
 watch(GET_CHARTS_AUDIT_CONTROLLERS, GET_CHARTS_AUDIT_CONTROLLERS => {
    //console.log(GET_CHARTS_AUDIT_CONTROLLERS)   
     this.chart = createChart()
     if(GET_CHARTS_AUDIT_CONTROLLERS.num_of_COMPLIANT!='0'||GET_CHARTS_AUDIT_CONTROLLERS.num_of_NONCOMPLIANT!='0'|| GET_CHARTS_AUDIT_CONTROLLERS.num_of_WAITING!='0'){
    this.chart.series[0].setData([
        {
            name: 'COMPLIANT',
            y: Number(GET_CHARTS_AUDIT_CONTROLLERS.num_of_COMPLIANT),
            color: '#186A3B'
        },
        {
            name: 'NON-COMPLIANT',
            y: Number(GET_CHARTS_AUDIT_CONTROLLERS.num_of_NONCOMPLIANT),
            color: '#C70039'
        },
         {
            name: 'INCOMPLETE',
            y: Number(GET_CHARTS_AUDIT_CONTROLLERS.num_of_WAITING),
            color: '#A1A1C2'
        },
        ]);
     }else{
      this.chart.series[0].setData([
        {
            name: 'No target[s] connected',
            y: 1,
            color: '#d9d9e6'
        },
      ]
      )
     }
        this.chart.redraw()
    })
    watch(selectedSystem, selectedSystem => {
      getData()
    })
    watch(selectedFramework, selectedFramework => {
      getData()
    })
    getData()

  },
  methods: {
    getData() {
      this.$store.dispatch('dashboard/GET_CHARTS_AUDIT_CONTROLLERS', {
        payload: {
          system_id: encryptStorage.getItem(`selectedSystem`),
          framework: encryptStorage.getItem(`selectedFramework`),
        },
      })
    },
    isNoData(data) {
      return data.every((value) => value === 0); // Check if all values are zero
    },
    setData(data){
      this.chartData = data
    }
  }
})
</script>
<style>
.highcharts-credits{
  display:none
}
</style>
