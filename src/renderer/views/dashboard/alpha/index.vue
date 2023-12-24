<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card-placeholder">
          <div class="card-header">
            <div class="vb__utils__heading">
              <strong>
                Statistics
                <span>
                  <a-popconfirm
                    title="Are you sure you want reset compliance?" @confirm="resetCompliance" ok-text="Yes"
                    cancel-text="No">
                    <a-tooltip placement="bottom">
                      <template #title>
                        <span> reset compliance for demo </span>
                      </template>
                      <a href="javascript: void(0);">
                        <i class="fas fa-sync-alt mx-2 fa-xs" />
                      </a>
                    </a-tooltip>
                  </a-popconfirm>
                </span>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-md-12">
        <div class="card card-top card-top-primary cursor-pointer">
          <div class="card-header"><b>NIST Controls</b></div>
          <div class="card-body p-4">
            <chart1 />
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <div class="card card-top card-top-primary cursor-pointer">
          <div class="card-header"><b>Controls Compliance</b></div>
          <div class="card-body p-4">
            <chart2 />
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <div class="card card-top card-top-primary cursor-pointer">
          <div class="card-header"><b>Target(s) Compliance</b></div>
          <div class="card-body p-4">
            <chart3 />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import chart1 from '@/components/chart1'
import chart2 from '@/components/chart2'
import chart3 from '@/components/chart3'
import { useStore } from 'vuex'

export default {
  name: 'VbDashboardAlpha',
  components: {
    chart1,
    chart2,
    chart3,
  },
  setup() {
    let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://code.highcharts.com/highcharts.js')
      document.head.appendChild(recaptchaScript)
    
    let recaptchaScript1 = document.createElement('script')
      recaptchaScript1.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js')
      document.head.appendChild(recaptchaScript1)
    
    const store = useStore()

  },
  data: function () {
    return {
      series2: [55, 41, 17],
      chartOptions2: {
        chart: {
          type: 'pie',
        },
        labels: ["INCOMPLETE", "COMPLIANT", "NONCOMPLIANT"],
        theme: {
          monochrome: {
            enabled: true,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -17,
            },
          },
        },

        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          },
        },
        legend: {
          show: false,
        },
      },
      series1: [13, 43, 22],
      chartOptions1: {
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -2,
            },
          },
        },
        chart: {
          type: 'pie',
        },
        labels: ["INCOMPLETE", "COMPLIANT", "NONCOMPLIANT"],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
      },


      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },

        xaxis: {
          categories: ["INCOMPLETE", "COMPLIANT", "NONCOMPLIANT"],
        },
      },
      series: [{
        name: 'series-1',
        data: [60, 70, 91],
      }],
    }
  },
  // created() {
  //   this.resetCompliance();
  // },
  methods: {
    resetCompliance() {
      this.$store.dispatch('compliance/RESET_COMPLIANCE', {});
    },
  },
}
</script>


<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
