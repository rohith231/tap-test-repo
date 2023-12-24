<template>
    <template v-if="SSPLoading">
      <a-skeleton active />
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row>
        <!-- CSP Name Internal ISSO (or equivalent) point of contact -->
      <a-col :span="24" class="mt-3" id="csp-name-internal-isso--or-equivalent--point-of-contact">
        <!-- <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Assignment of security responsibility
              </strong>
            </div>
          </h5>
        </div>
        <br /> -->
        <p>
          The information system security officers (ISSO), or their equivalent, identified below,
          have been appointed in writing and are deemed to have significant cyber and operational
          role responsibilities.
        </p>
        <br />
          <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong>
                  CSP Name Internal ISSO (or equivalent) Point of Contact
                </strong>
              </div>
            </h5>
          </div>
          <br />
        <a-card>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item label="First Name">
                <a-input
                  :disabled="disabled"
                  placeholder="First Name"
                  v-model:value="SSPData.poc_isso.first_name"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Last Name">
                <a-input
                  :disabled="disabled"
                  placeholder="Last Name"
                  v-model:value="SSPData.poc_isso.last_name"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Title">
                <a-input
                  :disabled="disabled"
                  placeholder="Title"
                  v-model:value="SSPData.poc_isso.title"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Organization / Company">
                <a-input
                  :disabled="disabled"
                  placeholder="Organization / Company"
                  v-model:value="SSPData.poc_isso.organization"
                />
              </a-form-item>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Street Address">
                <a-input
                  :disabled="disabled"
                  placeholder="Street Address"
                  v-model:value="SSPData.poc_isso.address"
                />
              </a-form-item>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-4">
              <a-form-item label="City">
                <a-input
                  :disabled="disabled"
                  placeholder="City"
                  v-model:value="SSPData.poc_isso.city"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="State">
                <a-input
                  :disabled="disabled"
                  placeholder="State"
                  v-model:value="SSPData.poc_isso.state"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Zip">
                <a-input
                  :disabled="disabled"
                  placeholder="Zip"
                  v-model:value="SSPData.poc_isso.zip"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item label="Phone">
                <a-input
                  :disabled="disabled"
                  placeholder="Phone"
                  v-model:value="SSPData.poc_isso.phone"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Email">
                <a-input
                  :disabled="disabled"
                  placeholder="Email"
                  v-model:value="SSPData.poc_isso.email"
                />
              </a-form-item>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- AO point of contact -->
      <a-col :span="24" class="mt-3" id="ao-point-of-contact">
          <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                AO Point of Contact
              </strong>
            </div>
          </h5>
        </div>
        <br />
        <a-card>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item label="First Name">
                <a-input
                  :disabled="disabled"
                  placeholder="First Name"
                  v-model:value="SSPData.poc_ao.first_name"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Last Name">
                <a-input
                  :disabled="disabled"
                  placeholder="Last Name"
                  v-model:value="SSPData.poc_ao.last_name"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Title">
                <a-input
                  :disabled="disabled"
                  placeholder="Title"
                  v-model:value="SSPData.poc_ao.title"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Organization / Company">
                <a-input
                  :disabled="disabled"
                  placeholder="Organization"
                  v-model:value="SSPData.poc_ao.organization"
                />
              </a-form-item>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Street Address">
                <a-input
                  :disabled="disabled"
                  placeholder="Street Address"
                  v-model:value="SSPData.poc_ao.address"
                />
              </a-form-item>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-4">
              <a-form-item label="City">
                <a-input
                  :disabled="disabled"
                  placeholder="City"
                  v-model:value="SSPData.poc_ao.city"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="State">
                <a-input
                  :disabled="disabled"
                  placeholder="State"
                  v-model:value="SSPData.poc_ao.state"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Zip">
                <a-input
                  :disabled="disabled"
                  placeholder="Zip"
                  v-model:value="SSPData.poc_ao.zip"
                />
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item label="Phone">
                <a-input
                  :disabled="disabled"
                  placeholder="Phone"
                  v-model:value="SSPData.poc_ao.phone"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Email">
                <a-input
                  :disabled="disabled"
                  placeholder="Email"
                  v-model:value="SSPData.poc_ao.email"
                />
              </a-form-item>
            </div>
          </div>
        </a-card>
      </a-col>

      </a-row>
    </template>
  </template>
  
  <script>
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  
  export default {
    namespaced: '',
    components: {},
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const store = useStore()
  
      let SSPData = computed(() => store.getters['ssp/ssp'].ssp)
      let SSPLoading = computed(() => store.getters['ssp/SSPLoading'])
  
      const addContacts = () => {
        SSPData.value.contacts.push({
          first_name: '',
          last_name: '',
          title: '',
          organization: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: '',
        })
      }
  
      const removeContacts = index => {
        SSPData.value.contacts.splice(index, 1)
      }
  
      const digIdntLevels = [
        { digValue: '', digText: 'N/A' },
        { digValue: 'LEVEL1 : AAL1, IAL1, FAL1', digText: 'LEVEL1 : AAL1, IAL1, FAL1' },
        { digValue: 'LEVEL2 : AAL2, IAL2, FAL2', digText: 'LEVEL2 : AAL2, IAL2, FAL2' },
        { digValue: 'LEVEL3 : AAL3, IAL3, FAL3', digText: 'LEVEL3 : AAL3, IAL3, FAL3' },
      ]
  
      return {
        addContacts,
        removeContacts,
        SSPData,
        SSPLoading,
        digIdntLevels,
      }
    },
  }
  </script>
  
  <style lang="scss" module>
  @import '../DigitalDetermination/style.module.scss';
  </style>
  
  <style scoped>
  .ant-advanced {
    padding: 24px;
    padding-bottom: 0 !important;
    padding-top: 15px !important;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .ant-form-item {
    margin-bottom: 8px;
  }
  </style>
  
  <style>
  .ant-collapse-content {
    overflow: unset !important;
  }
  
  .ant-table-placeholder {
    min-height: 100px;
  }
  
  .ant-select {
    width: 96px !important;
  }
  </style>
  