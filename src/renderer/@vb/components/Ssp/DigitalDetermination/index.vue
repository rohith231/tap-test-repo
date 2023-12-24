<template>
  <template v-if="SSPLoading">
    <a-skeleton active />
    <a-skeleton active />
  </template>
  <template v-else>
    <a-row>

      <!-- Other designed contacts-->
      <a-col :span="24" class="mt-3" id="other-designated-contacts">
        <!-- <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Other designated contacts
              </strong>
            </div>
          </h5>
        </div>
        <br /> -->

        <blockquote class="blockquote">
          <p class="mb-0">
            <strong>Instruction :</strong>
            AOs should use the following section to identify points of contact that understand the
            technical implementations of the identified cloud system. AOs should edit, add, or
            modify the contacts in this section as they see fit.
          </p>
        </blockquote>

        <p>
          The following individual(s) identified below possess in-depth knowledge of this system
          and/or its functions and operation.
        </p>
      </a-col>

      <!-- Information System Management point of contact -->
      <a-col :span="24" class="mt-3" id="management-point-of-contact">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Management Point of Contact
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
                  v-model:value="SSPData.poc_mgmt.first_name"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Last Name">
                <a-input
                  :disabled="disabled"
                  placeholder="Last Name"
                  v-model:value="SSPData.poc_mgmt.last_name"
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
                  v-model:value="SSPData.poc_mgmt.title"
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
                  v-model:value="SSPData.poc_mgmt.organization"
                />
              </a-form-item>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <a-form-item label="Address">
                <a-input
                  :disabled="disabled"
                  placeholder="Street Address"
                  v-model:value="SSPData.poc_mgmt.address"
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
                  v-model:value="SSPData.poc_mgmt.city"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="State">
                <a-input
                  :disabled="disabled"
                  placeholder="State"
                  v-model:value="SSPData.poc_mgmt.state"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Zip">
                <a-input
                  :disabled="disabled"
                  placeholder="Zip"
                  v-model:value="SSPData.poc_mgmt.zip"
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
                  v-model:value="SSPData.poc_mgmt.phone"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Email">
                <a-input
                  :disabled="disabled"
                  placeholder="Email"
                  v-model:value="SSPData.poc_mgmt.email"
                />
              </a-form-item>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Information system technical point of contact -->
      <a-col :span="24" class="mt-3" id="technical-point-of-contact">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Technical Point of Contact
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
                  v-model:value="SSPData.poc_tech.first_name"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Last Name">
                <a-input
                  :disabled="disabled"
                  placeholder="Last Name"
                  v-model:value="SSPData.poc_tech.last_name"
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
                  v-model:value="SSPData.poc_tech.title"
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
                  v-model:value="SSPData.poc_tech.organization"
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
                  v-model:value="SSPData.poc_tech.address"
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
                  v-model:value="SSPData.poc_tech.city"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="State">
                <a-input
                  :disabled="disabled"
                  placeholder="State"
                  v-model:value="SSPData.poc_tech.state"
                />
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Zip">
                <a-input
                  :disabled="disabled"
                  placeholder="Zip"
                  v-model:value="SSPData.poc_tech.zip"
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
                  v-model:value="SSPData.poc_tech.phone"
                />
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item label="Email">
                <a-input
                  :disabled="disabled"
                  placeholder="Email"
                  v-model:value="SSPData.poc_tech.email"
                />
              </a-form-item>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- <a-col :span="24" class="mt-3">
        <blockquote class="blockquote">
          <p class="mb-0">
            <strong>Instruction :</strong>
            Add more tables as needed.
          </p>
        </blockquote>
      </a-col> -->

      <!-- Point of contact -->
      <a-col :span="24" class="mt-3" id="point-of-contact">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Other Contacts
              </strong>
            </div>
          </h5>
        </div>
        <br />
        <a-card>
          <template #extra>
            <button
              @click="addContacts"
              type="button"
              class="btn btn-sm btn-primary px-5 ml-2 pull-right mb-4"
              :disabled="disabled"
            >
              Add point of contact
            </button>
          </template>
          <br />
          <a-col :span="24" class="mt-3">
            <a-collapse v-for="(contact, index) in SSPData.contacts" :key="index" class="mb-3">
              <a-collapse-panel
                :header="contact.title != '' ? contact.title : 'Title'"
                :key="index"
              >
                <template #extra>
                  <a-button
                    type="danger"
                    size="small"
                    class="mr-3 mb-3 pull-right"
                    @click="removeContacts(index)"
                    ><i class="fe fe-trash mr-1" /> Remove</a-button
                  ></template
                >
                <a-col :span="24" class="mt-3">
                  <div class="row">
                    <div class="col-lg-6">
                      <a-form-item label="First Name">
                        <a-input
                          :disabled="disabled"
                          placeholder="First Name"
                          v-model:value="contact.first_name"
                        />
                      </a-form-item>
                    </div>
                    <div class="col-lg-6">
                      <a-form-item label="Last Name">
                        <a-input
                          :disabled="disabled"
                          placeholder="Last Name"
                          v-model:value="contact.last_name"
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
                          v-model:value="contact.title"
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
                          v-model:value="contact.organization"
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
                          v-model:value="contact.address"
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
                          v-model:value="contact.city"
                        />
                      </a-form-item>
                    </div>
                    <div class="col-lg-4">
                      <a-form-item label="State">
                        <a-input
                          :disabled="disabled"
                          placeholder="State"
                          v-model:value="contact.state"
                        />
                      </a-form-item>
                    </div>
                    <div class="col-lg-4">
                      <a-form-item label="Zip">
                        <a-input
                          :disabled="disabled"
                          placeholder="Zip"
                          v-model:value="contact.zip"
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
                          v-model:value="contact.phone"
                        />
                      </a-form-item>
                    </div>
                    <div class="col-lg-6">
                      <a-form-item label="Email">
                        <a-input
                          :disabled="disabled"
                          placeholder="Email"
                          v-model:value="contact.email"
                        />
                      </a-form-item>
                    </div>
                  </div>
                </a-col>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
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
@import './style.module.scss';
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
