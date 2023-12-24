<template>
  <template v-if="SSPLoading">
    <a-skeleton active />
    <a-skeleton active />
  </template>
  <template v-else>
    <a-row>
      <a-col :span="24" class="mt-3" id="information-system-operational-status">
        <!-- <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Information system operational status
              </strong>
            </div>
          </h5>
        </div>
        <br /> -->
        <p>
          The system is currently in the life-cycle phase shown in Table 7 1 System Status that
          follows. (Only operational systems can be granted an ATO).
        </p>
        <br />
        <a-card title="System status">
          <a-checkbox-group
            style="display:block"
            @change="onSystemStatusChange"
            v-model:value="SSPData.operational_status.status"
          >
            <!-- 1 -->
            <div class="row mt-2">
              <div class="col-lg-4">
                <a-checkbox value="Operation">
                  Operation
                </a-checkbox>
              </div>
              <div class="col-lg-8">
                The system is operating and in production.
              </div>
            </div>
            <hr />
            <!-- 2 -->
            <div class="row mt-2">
              <div class="col-lg-4">
                <a-checkbox value="Under development">
                  Under development
                </a-checkbox>
              </div>
              <div class="col-lg-8">
                The system is being designed, developed, or implemented
              </div>
            </div>
            <hr />
            <!-- 3 -->
            <div class="row mt-2">
              <div class="col-lg-4">
                <a-checkbox value="Major modification">
                  Major modification
                </a-checkbox>
              </div>
              <div class="col-lg-8">
                The system is undergoing a major change, development, or transition.
              </div>
            </div>
            <hr />
            <!-- 4 -->
            <div class="row mt-2">
              <div class="col-lg-4">
                <a-checkbox value="Retired">
                  Retired
                </a-checkbox>
              </div>
              <div class="col-lg-8">
                The system is Retired.
              </div>
            </div>
            <hr />
            <!-- 5 -->
            <div class="row mt-2">
              <div class="col-lg-4">
                <a-checkbox value="other">
                  Other - explained
                </a-checkbox>
              </div>
              <div class="col-lg-8">
                <a-input
                  v-model:value="SSPData.operational_status.explain"
                  placeholder="Explain."
                  :disabled="otherSystem"
                />
              </div>
            </div>
          </a-checkbox-group>
        </a-card>
      </a-col>

    </a-row>
  </template>
</template>

<script>
import useEmitter from '@/composables/useEmitter'

import { useStore } from 'vuex'
import { computed, ref } from 'vue'

export default {
  namespaced: '',
  components: { },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    systemName: {
      type: String,
      default: 'System default name',
    },
  },
  setup() {
    const store = useStore()
    const emitter = useEmitter()

    const options = [
      { label: 'Operational', value: 'Operational' },
      { label: 'Under development', value: 'Under development' },
      { label: 'Major modication', value: 'Major modification' },
      { label: 'Retired', value: 'Retired' },
    ]

    let SSPData = computed(() => store.getters['ssp/ssp'].ssp)
    let SSPLoading = computed(() => store.getters['ssp/SSPLoading'])

    let data = [
      {
        title: 'virtual_machine',
        question: 'Does the system use virtual machines?',
        answer: SSPData.value.system_is_cloud.virtual_machine,
        conclusion: 'A no response means that system is most likely not a cloud.',
      },
      {
        title: 'expand_capacity',
        question:
          'Does the system have the ability to expand its capacity to meet customer demand?',
        answer: SSPData.value.system_is_cloud.expand_capacity,
        conclusion: 'A no response means that the system is most likely not a cloud.',
      },
      {
        title: 'consumer_build',
        question: 'Does the system allow the consumer to build anything other than servers?',
        answer: SSPData.value.system_is_cloud.consumer_build,
        conclusion:
          'A no response means that the system is an IaaS. A yes response means that the system is either a PaaS or a SaaS.',
      },
      {
        title: 'create_databases',
        question: 'Does the system offer the ability to create databases?',
        answer: SSPData.value.system_is_cloud.create_databases,
        conclusion: 'A yes response means that the system is a PaaS.',
      },
      {
        title: 'developer_toolkits',
        question: 'Does the system offer various developer toolkits and APIs?',
        answer: SSPData.value.system_is_cloud.developer_toolkits,
        conclusion: 'A yes response means that the system is a PaaS.',
      },
      {
        title: 'obtaining_login',
        question:
          'Does the system offer only applications that are available by obtaining a login?',
        answer: SSPData.value.system_is_cloud.obtaining_login,
        conclusion:
          'A yes response means that system is a SaaS. A no response means that the system is either a PaaS or an IaaS.',
      },
    ]

    const columns = [
      {
        title: 'Quest',
        dataIndex: 'question',
        key: 'question',
      },
      {
        title: 'Answer (Yes/No)',
        dataIndex: 'answer',
        slots: { customRender: 'actionView' },
        key: 'answer',
      },
      {
        title: 'Conclusion',
        dataIndex: 'conclusion',
        key: 'conclusion',
      },
    ]

    emitter.on('ssp-system_is_cloud', payload => {
      SSPData.value.system_is_cloud[payload.name] = payload.value
    })

    const otherSystem = SSPData.value.operational_status.explain == '' ? ref(true) : ref(false)
    const otherService = SSPData.value.sp_architecture_layers.explain == '' ? ref(true) : ref(false)
    const otherModel = SSPData.value.sp_deployment_model.explain == '' ? ref(true) : ref(false)

    const onSystemStatusChange = checkedValues => {
      otherSystem.value = !checkedValues.includes('other')
      if (otherSystem.value) {
        SSPData.value.operational_status.explain = ''
      }

      SSPData.value.operational_status.status = checkedValues
    }
    const onServiceChange = checkedValues => {
      otherService.value = !checkedValues.includes('other')
      if (otherService.value) {
        SSPData.value.sp_architecture_layers.explain = ''
      }

      SSPData.value.sp_architecture_layers.layers = checkedValues
    }
    const onModelChange = checkedValues => {
      otherModel.value = !checkedValues.includes('hybrid')
      if (otherModel.value) {
        SSPData.value.sp_deployment_model.explain = ''
      }

      SSPData.value.sp_deployment_model.model = checkedValues
    }

    return {
      onSystemStatusChange,
      onServiceChange,
      onModelChange,
      otherSystem,
      otherService,
      otherModel,
      SSPData,
      SSPLoading,
      columns,
      data,
      options,
    }
  },
}
</script>
