<template>
    <template v-if="SSPLoading">
      <a-skeleton active />
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row>
        
        <!-- Information System Type -->
        <a-col :span="24" class="mt-3" id="information-system-type">
          <!-- <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong>
                  Information system type
                </strong>
              </div>
            </h5>
          </div>
          <br /> -->
          <p>
            The <strong>(Abbreviation Test) </strong>makes use of unique managed service provider
            architecture layer(s)
          </p>
        </a-col>
  
        <!-- Service Models -->
          <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-4">
              <div class="vb__utils__heading">
                <strong>
                  Service Models
                </strong>
              </div>
            </h5>
          </div>
          <br />
        <a-card>
          <p>
            Information systems, particularly those based on cloud architecture models, are made up of
            different service layers. Below are some questions that help the system owner determine if
            their system is a cloud followed by specific questions to help the system owner determine
            the type of cloud.
          </p>
          <br />
          <ServiceModel :columns="columns" :data="data" />
          <br />
          <p>
            The layers of the <strong>({{ systemName }})</strong> defined in this SSP are indicated in
            Table 8 1 Service Layers Represented in this SSP that follows.
          </p>
        </a-card>
  
        <a-col :span="24" class="mt-3" id="cloud-deployment-models">
          <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong>
                  Cloud Deployment Models
                </strong>
              </div>
            </h5>
          </div>
          <br />
          <p>
            Information systems are made up of different deployment models. The deployment models of
            the <strong>({{ systemName }})</strong> that are defined in this SSP and are not leveraged
            by any other FedRAMP Authorizations, are indicated in Table 8 2 Cloud Deployment Model
            Represented in this SSP that follows.
          </p>
          <br />
          <blockquote class="blockquote">
            <p class="mb-0">
              <strong>Instruction :</strong>
              Check all layers that apply.
            </p>
          </blockquote>
          <br />
          <a-card title="Service providor cloud deployment model">
            <a-checkbox-group
              style="display:block"
              @change="onModelChange"
              v-model:value="SSPData.sp_deployment_model.model"
            >
              <!-- 1 -->
              <div class="row mt-2">
                <div class="col-lg-3">
                  <a-checkbox value="public">
                    public
                  </a-checkbox>
                </div>
                <div class="col-lg-9">
                  Cloud services and infrastructure supporting multiple organizations and agency
                  clients
                </div>
              </div>
              <hr />
              <!-- 2 -->
              <div class="row mt-2">
                <div class="col-lg-3">
                  <a-checkbox value="private">
                    Private
                  </a-checkbox>
                </div>
                <div class="col-lg-9">
                  Cloud services and infrastructure dedicated to a specific organization/agency and no
                  other clients
                </div>
              </div>
              <hr />
              <!-- 3 -->
              <div class="row mt-2">
                <div class="col-lg-3">
                  <a-checkbox value="goverment only community">
                    Goverment only community
                  </a-checkbox>
                </div>
                <div class="col-lg-9">
                  Cloud services and infrastructure shared by several organizations/agencies with same
                  policy and compliance considerations
                </div>
              </div>
              <hr />
              <div class="row mt-2">
                <div class="col-lg-3">
                  <a-checkbox value="hybrid">
                    Hybrid
                  </a-checkbox>
                </div>
                <div class="col-lg-9">
                  Explain: (e.g., cloud services and infrastructure that provides private cloud for
                  secured applications and data where required and public cloud for other applications
                  and data)
                  <a-input
                    v-model:value="SSPData.sp_deployment_model.explain"
                    placeholder="Explain."
                    :disabled="otherModel"
                  />
                </div>
              </div>
            </a-checkbox-group>
          </a-card>
        </a-col>
  
        <a-col :span="24" class="mt-3">
            <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong>
                    Service Provider Architecture Layers
                </strong>
              </div>
            </h5>
          </div>
          <br />
          <blockquote class="blockquote">
            <p class="mb-0">
              <strong>Instruction :</strong>
              Check all layers that apply.
            </p>
          </blockquote>
          <br />
          <a-card>
            <a-checkbox-group
              style="display:block"
              @change="onServiceChange"
              v-model:value="SSPData.sp_architecture_layers.layers"
            >
              <!-- 1 -->
              <div class="row mt-2">
                <div class="col-lg-4">
                  <a-checkbox value="saas">
                    Software as a service (SaaS)
                  </a-checkbox>
                </div>
                <div class="col-lg-8">
                  Major Application
                </div>
              </div>
              <hr />
              <!-- 2 -->
              <div class="row mt-2">
                <div class="col-lg-4">
                  <a-checkbox value="paas">
                    Platform as a service (PaaS)
                  </a-checkbox>
                </div>
                <div class="col-lg-8">
                  Major Application
                </div>
              </div>
              <hr />
              <!-- 3 -->
              <div class="row mt-2">
                <div class="col-lg-4">
                  <a-checkbox value="iaas">
                    Infastructure as a service (IaaS)
                  </a-checkbox>
                </div>
                <div class="col-lg-8">
                  General Support System
                </div>
              </div>
              <hr />
              <div class="row mt-2">
                <div class="col-lg-4">
                  <a-checkbox value="other">
                    Other - explained
                  </a-checkbox>
                </div>
                <div class="col-lg-8">
                  <a-input
                    v-model:value="SSPData.sp_architecture_layers.explain"
                    placeholder="Explain."
                    :disabled="otherService"
                  />
                </div>
              </div>
            </a-checkbox-group>
          </a-card>
          <br />
          <p>
            Note: Refer to NIST SP 800-145 for information on cloud computing architecture models.
          </p>
        </a-col>
  
      </a-row>
    </template>
  </template>
  
  <script>
  import ServiceModel from '../SystemOperationStatus/service'
  import useEmitter from '@/composables/useEmitter'
  
  import { useStore } from 'vuex'
  import { computed, ref } from 'vue'
  
  export default {
    namespaced: '',
    components: { ServiceModel },
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
  