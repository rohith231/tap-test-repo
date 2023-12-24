

<template>
  <a-skeleton active v-show="GET_CHARTS_COMPLIANCE_DEVICES_LOADING" />
  <div id="container2" style="height: 400px"></div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { encryptStorage } from '@/utils'

function createChart() {
  return Highcharts.chart('container2', {
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

    const GET_CHARTS_COMPLIANCE_DEVICES_LOADING = computed(
      () => store.getters['dashboard/dashboard'].GET_CHARTS_COMPLIANCE_DEVICES_LOADING,
    )
    const GET_CHARTS_COMPLIANCE_DEVICES = computed(
      () => store.getters['dashboard/dashboard'].GET_CHARTS_COMPLIANCE_DEVICES
    )
     const getData= () =>{
    store.dispatch('dashboard/GET_CHARTS_COMPLIANCE_DEVICES', {
        payload: {
          system_id: encryptStorage.getItem(`selectedSystem`),
          framework: encryptStorage.getItem(`selectedFramework`),
        },
      })
     }
 watch(GET_CHARTS_COMPLIANCE_DEVICES, GET_CHARTS_COMPLIANCE_DEVICES => {
   // console.log(GET_CHARTS_COMPLIANCE_DEVICES)   
     this.chart = createChart()
     if(GET_CHARTS_COMPLIANCE_DEVICES.num_of_COMPLIANT!='0'||GET_CHARTS_COMPLIANCE_DEVICES.num_of_NONCOMPLIANT!='0'|| GET_CHARTS_COMPLIANCE_DEVICES.num_of_WAITING!='0'){
    this.chart.series[0].setData([
        {
            name: 'COMPLIANT',
            y: Number(GET_CHARTS_COMPLIANCE_DEVICES.num_of_COMPLIANT),
            color: '#186A3B'
        },
        {
            name: 'NON-COMPLIANT',
            y: Number(GET_CHARTS_COMPLIANCE_DEVICES.num_of_NONCOMPLIANT),
            color: '#C70039'
        },
         {
            name: 'INCOMPLETE',
            y: Number(GET_CHARTS_COMPLIANCE_DEVICES.num_of_WAITING),
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
      this.$store.dispatch('dashboard/GET_CHARTS_COMPLIANCE_DEVICES', {
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
