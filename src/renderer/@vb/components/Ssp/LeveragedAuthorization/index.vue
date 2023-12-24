<template>
    <template v-if="SSPLoading">
      <a-skeleton active />
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row>
        <a-col :span="24" class="mt-3" id="leveraged-authorizations">
          <!-- <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong>
                  Leveraged authorizations
                </strong>
              </div>
            </h5>
          </div>
          <br /> -->
          <blockquote class="blockquote">
            <p class="mb-0">
              <strong>Instruction :</strong>
              The FedRAMP program qualifies different service layers for authorizations. One or
              multiple service layers can be qualified in one system security plan. If a lower level
              layer has been granted an authorization and another higher-level layer represented by
              this SSP plans to leverage a lower layer’s authorization, this system security plan must
              clearly state that intention. If an information system does not leverage any
              pre-existing authorizations, write “None” in the first column of the table that follows.
              Add as many rows as necessary in the table that follows.
            </p>
          </blockquote>
          <br />
          <p>
            The <strong>({{ systemName }})</strong> leverages a pre-existing FedRAMP authorization.
            FedRAMP authorizations leveraged by this <strong>({{ systemName }})</strong> are listed in
            Table 8 3 leveraged authorizations that follows.
          </p>
          <br />
  
          <a-card title="Information system management point of contact">
            <template #extra>
              <a-button
                type="primary"
                size="small"
                class="mr-3 mb-3 pull-right"
                @click="addLeveraged"
                ><i class="fe fe-plus mr-1" /> Add</a-button
              >
            </template>
            <br />
            <a-col
              :span="24"
              class="mt-3"
              v-for="(item, index) in SSPData.leveraged_systems"
              :key="index"
            >
              <div class="row">
                <div class="col-lg-3">
                  <a-form-item label="Name">
                    <a-input placeholder="Name" v-model:value="item.name"/>
                  </a-form-item>
                </div>
                <div class="col-lg-3">
                  <a-form-item label="Owner">
                    <a-input placeholder="Owner" v-model:value="item.owner"/>
                  </a-form-item>
                </div>
                <div class="col-lg-3">
                  <a-form-item label="Date">
                    <a-date-picker placeholder="Date" v-model:value="item.date_granted"/>
                  </a-form-item>
                </div>
                <div class="col-lg-3">
                  <a-button
                    type="danger"
                    size="small"
                    class="mr-3 mb-3 pull-right"
                    @click="removeLeveraged(index)"
                    ><i class="fe fe-trash mr-1" /> Remove</a-button>
                </div>
              </div>
              <hr/>
            </a-col>
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
  
  
      const addLeveraged = () => {
        SSPData.value.leveraged_systems.push({
          name: '',
          owner: '',
          date_granted: null,
        })
      }
  
      const removeLeveraged = (index) => {
        SSPData.value.leveraged_systems.splice(index, 1)
      }
  
      return {
        addLeveraged,
        removeLeveraged,
        SSPData,
        SSPLoading,
        columns,
        data,
        options,
      }
    },
  }
  </script>
  