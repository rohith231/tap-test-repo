<script>
import { defineComponent, computed, watch, toRefs } from 'vue'
import { Pie } from 'vue3-chart-v2'
import { encryptStorage } from '@/utils'

import { useStore } from 'vuex'
export default defineComponent({
  name: 'Pie',
  extends: Pie,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
      default: () => { },
    },
  },
  data() {
    return {
      timeout: null,
    }
  },
  mounted() {
    const store = useStore()
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])

    const GET_CHARTS_AUDIT_CONTROLLERS = computed(
      () => store.getters['dashboard/dashboard'].GET_CHARTS_AUDIT_CONTROLLERS,
    )
    watch(selectedSystem, selectedSystem => {
      this.getData()
    })
    watch(selectedFramework, selectedFramework => {
      this.getData()
    })
    this.getData()
    watch(GET_CHARTS_AUDIT_CONTROLLERS, GET_CHARTS_AUDIT_CONTROLLERS => {

      const chartData = {
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['COMPLIANT', 'NON-COMPLIANT', 'INCOMPLETE'],
        datasets: [
          {
            data: [
              GET_CHARTS_AUDIT_CONTROLLERS.num_of_COMPLIANT,
              GET_CHARTS_AUDIT_CONTROLLERS.num_of_NONCOMPLIANT,
              GET_CHARTS_AUDIT_CONTROLLERS.num_of_WAITING,
            ],
            backgroundColor: ['#186A3B', '#C70039', '#A1A1C2'],
          },
        ],
       
      };
      const chartOptions = {
        ...this.chartOptions,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var currentValue = dataset.data[tooltipItem.index];
              return `${data.labels[tooltipItem.index]}: ${currentValue} %`;
            },
          },
        },
      };

      if (this.isNoData(chartData.datasets[0].data)) {
        chartData.datasets[0].data = [100]; // Assign a dummy value of 100 when there is no data
        chartData.datasets[0].backgroundColor = ['#A1A1C2']; // Assign a dummy value of 100 when there is no data
        chartData.labels = ['No target[s] connected']; // Change the label to 'No Data'
        chartData.label ='There'
        chartOptions.tooltips = {
          callbacks: {
            label: (tooltipItem, data) => {
              return `${data.labels[tooltipItem.index]}: 0 %`;
            },
                

          },
        };
      };

      this.renderChart(chartData, chartOptions);
    })
    this.renderChart(this.chartData, {
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var currentValue = dataset.data[tooltipItem.index];
            return `${data.labels[tooltipItem.index]}: ${currentValue} %`;
          }
        }
      }
    })
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
  },
})
</script>
