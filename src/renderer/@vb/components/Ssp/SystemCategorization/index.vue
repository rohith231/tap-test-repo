<template>
  <template v-if="SSPLoading">
    <a-skeleton active />
    <a-skeleton active />
  </template>
  <template v-else>
    <a-row>
      <a-col :span="24" class="mt-3" v-if="system.id">
        <h3 class="sysH1" v-if="data.system_id != 'new'">Information System Categorization</h3>
        <template v-else>
          <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
            <h5 class="mb-0">
              <div class="vb__utils__heading">
                <strong> System Categorization </strong>
              </div>
            </h5>
          </div>
        </template>
      </a-col>
      <a-col :span="24" class="mt-3" id="system-sensitivity-level">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>System Sensitivity Level</strong>
            </div>
          </h5>
        </div>
      </a-col>
      <a-col :span="24" class="mt-3">
        <a-typography-text type="secondary">
          The overall information system sensitivity categorization is recorded in Table 2 1 Security
          Categorization that follows. Directions for attaching the FIPS 199 document may be found in
          the following section: ATTACHMENT 10 - FIPS 199.
        </a-typography-text>
      </a-col>
      <a-row class="ant-advanced w-100">
        <div class="col-lg-12">
          <a-form-item label="System Sensitivity Level">
            <a-select
              :disabled="disabled"
              v-model:value="SSPData.sensitivity_level"
              :default-value="SSPData.sensitivity_level"
              style="min-width: 100%"
            >
              <a-select-option
                v-for="item in senLevels"
                :key="item.senValue"
                :value="item.senValue"
              >
                {{ item.senText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </a-row>

      <a-col :span="24" class="mt-3">
        <button
          @click="addItem"
          type="button"
          class="btn btn-sm btn-primary px-5 ml-2 pull-right mb-2"
          :disabled="disabled"
        >
          Add information type
        </button>
      </a-col>
      <a-row class="w-100 overflow-auto">
        <a-col :span="24" class="mt-3">
          <div>
            <a-table :columns="columns" :data-source="SSPData.sensitivity_cat" :pagination="false">
              <template #type="{ record, index }">
                <a-form-item>
                  <a-select
                    :disabled="disabled"
                    style="min-width: 100%"
                    @change="setInformationTypes(index, record.type)"
                    v-model:value="record.type"
                    :default-value="record.type"
                    :key="index"
                    :show-search="true"
                  >
                    <a-select-opt-group
                      v-for="item in InformationTypes.filter(
                        (type) => type.header != '' && typeof type.header === 'string',
                      )"
                      :key="item.header"
                      :label="item.header"
                    >
                      <a-select-option
                        v-for="itemOption in InformationTypes.filter(
                          (type) => type.group === item.header,
                        )"
                        :key="itemOption.name"
                        :value="itemOption.name"
                      >
                        {{ itemOption.name }}
                      </a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </a-form-item>
              </template>

              <template #idnt="{ record }">
                <a-form-item>
                  <a-input
                    v-model:value="record.idnt"
                    :disabled="true"
                    placeholder="NIST 800-60 identifier for Associated Information Type"
                  />
                </a-form-item>
              </template>
              <template #confidentiality="{ record }">
                <a-form-item>
                  <a-select
                    style="min-width: 100%"
                    :disabled="disabled"
                    @change="sensitivity_cat_update()"
                    v-model:value="record.confidentiality"
                    :default-value="record.confidentiality"
                  >
                    <a-select-option
                      v-for="item in senLevels"
                      :key="item.senValue"
                      :value="item.senValue"
                    >
                      {{ item.senText }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <template #integrity="{ record }">
                <a-form-item>
                  <a-select
                    :disabled="disabled"
                    @change="sensitivity_cat_update()"
                    v-model:value="record.integrity"
                    :default-value="record.integrity"
                    style="min-width: 100%"
                  >
                    <a-select-option
                      v-for="item in senLevels"
                      :key="item.senValue"
                      :value="item.senValue"
                    >
                      {{ item.senText }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <template #availability="{ record }">
                <a-form-item>
                  <a-select
                    :disabled="disabled"
                    @change="sensitivity_cat_update()"
                    v-model:value="record.availability"
                    :default-value="record.availability"
                    style="min-width: 100%"
                  >
                    <a-select-option
                      v-for="item in senLevels"
                      :key="item.senValue"
                      :value="item.senValue"
                    >
                      {{ item.senText }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <template #action="{ index }">
                <a-form-item>
                  <a-popconfirm
                    title="Are you sure delete this?"
                    @confirm="removeItem(index)"
                    ok-text="Yes"
                    cancel-text="No"
                  >
                    <a
                      :disabled="disabled"
                      href="javascript: void(0);"
                      class="btn btn-sm btn-light m-1"
                      style="width: 95px"
                    >
                      <small>
                        <i class="far fa-trash-alt"></i>
                      </small>
                      Remove
                    </a>
                  </a-popconfirm>
                </a-form-item>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>

      <a-col :span="24" class="mt-3" id="security-objectives-categorization">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>Security Objectives Categorization (FIPS 199)</strong>
            </div>
          </h5>
        </div>
      </a-col>

      <a-col :span="24" class="mt-3">
        <a-typography-text type="secondary">
          Based on the information provided in Table 2 2 Sensitivity Categorization of Information
          Types, for the
          <strong>({{ systemName }})</strong>, default to the high-water mark for the Information
          Types as identified in Table 2 3 Security Impact Level below.
        </a-typography-text>
        <a-spin
          :spinning="updateSecurityObjectives"
          size="large"
          :delay="1000"
          tip="Update security objectives categorization..."
        >
          <a-row class="ant-advanced">
            <div class="col-lg-4">
              <a-form-item label="Confidentiality">
                <a-select
                  :disabled="disabled"
                  style="min-width: 100%"
                  v-model:value="SSPData.security_objectives_cat.confidentiality"
                  :default-value="SSPData.security_objectives_cat.confidentiality"
                >
                  <a-select-option
                    v-for="item in senLevels"
                    :key="item.senValue"
                    :value="item.senValue"
                  >
                    {{ item.senText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Integrity">
                <a-select
                  style="min-width: 100%"
                  :disabled="disabled"
                  v-model:value="SSPData.security_objectives_cat.integrity"
                  :default-value="SSPData.security_objectives_cat.integrity"
                >
                  <a-select-option
                    v-for="item in senLevels"
                    :key="item.senValue"
                    :value="item.senValue"
                  >
                    {{ item.senText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="col-lg-4">
              <a-form-item label="Availability ">
                <a-select
                  style="min-width: 100%"
                  :disabled="disabled"
                  v-model:value="SSPData.security_objectives_cat.availability"
                  :default-value="SSPData.security_objectives_cat.availability"
                >
                  <a-select-option
                    v-for="item in senLevels"
                    :key="item.senValue"
                    :value="item.senValue"
                  >
                    {{ item.senText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-row>
        </a-spin>
        <a-typography-text type="secondary" class="mt-3">
          Through review and analysis, it has been determined that the baseline security
          categorization for the
          <strong>({{ systemName }})</strong> system is listed in the Table 2 4 Baseline Security
          Configuration that follows.
        </a-typography-text>
      </a-col>

      <a-col :span="24" class="ant-advanced">
        <div class="col-lg-12">
          <a-form-item label="Security categorization">
            <a-select
              style="min-width: 100%"
              :disabled="disabled"
              v-model:value="SSPData.baseline_security_cat"
              :default-value="SSPData.baseline_security_cat"
            >
              <a-select-option
                v-for="item in senLevels"
                :key="item.senValue"
                :value="item.senValue"
              >
                {{ item.senText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </a-col>
      <a-typography-text type="secondary">
        Using this categorization, in conjunction with the risk assessment and any unique security
        requirements, we have established the security controls for this system, as detailed in this
        SSP.
      </a-typography-text>

      <a-col :span="24" class="mt-3" id="digital-identity-determination">
        <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
          <h5 class="mb-0">
            <div class="vb__utils__heading">
              <strong>
                Digital Identity Determination
              </strong>
            </div>
          </h5>
        </div>
        <br />
        <a-typography-text type="secondary">
          The digital identity information may be found in attachment 3 – digital identity worksheet
          Note: NIST SP 800-63-3, digital identity guidelines, does not recognize the four levels of
          assurance model previously used by federal agencies and described in OMB M-04-04, instead
          requiring agencies to individually select levels corresponding to each function being
          performed.
        </a-typography-text>
      </a-col>

      <a-row class="ant-advanced w-100" id="digital-identity-level">
        <div class="col-lg-12">
          <a-form-item label="Digital identity level">
            <a-select
              :disabled="disabled"
              v-model:value="SSPData.digital_identity_level"
              label="Digital identity level"
              style="min-width: 100%;"
            >
              <a-select-option
                v-for="item in digIdntLevels"
                :key="item.digValue"
                :value="item.digValue"
              >
                {{ item.digText }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </a-row>

      <p>
        Additional digital identity information can be found in Section 15 attachments digital
        identity level selection.
      </p>
    </a-row>
  </template>
</template>


<script>
import { computed, ref, toRaw } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    system: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    systemName: {
      type: String,
      default: 'Default system name',
    },
  },
  setup(props, { emit }) {
    const store = useStore()

    let columns = [
      {
        title:
          'Information Type (Use only information types from NIST SP 800-60, Volumes I and II as amended) ',
        dataIndex: 'type',
        slots: {
          customRender: 'type',
        },
        key: 'type',
      },
      {
        title: 'NIST 800-60 identifier for Associated Information Type',
        dataIndex: 'idnt',
        slots: {
          customRender: 'idnt',
        },
        key: 'idnt',
      },
      {
        title: 'Confidentiality',
        dataIndex: 'confidentiality',
        slots: {
          customRender: 'confidentiality',
        },
        key: 'confidentiality',
      },
      {
        title: 'Integrity',
        dataIndex: 'integrity',
        slots: {
          customRender: 'integrity',
        },
        key: 'integrity',
      },
      {
        title: 'Availability',
        dataIndex: 'availability',
        slots: {
          customRender: 'availability',
        },
        key: 'availability',
      },
      {
        title: 'Actions',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        key: 'action',
      },
    ]
    let SSPData = computed(() => store.getters['ssp/ssp'].ssp)
    let SSPLoading = computed(() => store.getters['ssp/SSPLoading'])
    let updateSecurityObjectives = ref(false)
    var senLevels = [
      {
        senValue: 'high',
        senText: 'High',
      },
      {
        senValue: 'moderate',
        senText: 'Moderate',
      },
      {
        senValue: 'low',
        senText: 'Low',
      },
      {
        senValue: 'n/a',
        senText: 'N/A',
      },
    ]

    var InformationTypes = [
      {
        header: 'Controls and Oversight',
      },
      {
        name: 'Corrective Action',
        group: 'Controls and Oversight',
        idnt: 'C.2.5.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'corrective',
      },
      {
        name: 'Program Evaluation',
        group: 'Controls and Oversight',
        idnt: 'C.2.1.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c212',
      },
      {
        name: 'Program Monitoring',
        group: 'Controls and Oversight',
        idnt: 'C.2.1.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c253',
      },

      {
        header: 'Regulatory Development',
      },
      {
        name: 'Policy and Guidance Development',
        group: 'Regulatory Development',
        idnt: 'C.2.2.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c221',
      },
      {
        name: 'Public Comment Tracking',
        group: 'Regulatory Development',
        idnt: 'C.2.2.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c222',
      },
      {
        name: 'Regulatory Creation',
        group: 'Regulatory Development',
        idnt: 'C.2.2.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c223',
      },
      {
        name: 'Rule Publication',
        group: 'Regulatory Development',
        idnt: 'C.2.2.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c224',
      },

      {
        header: 'Planning and Budgeting',
      },
      {
        name: 'Budget Formulation',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c231',
      },
      {
        name: 'Capital Planning',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c232',
      },
      {
        name: 'Enterprise Architecture',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c233',
      },
      {
        name: 'Strategic Planning',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
      },
      {
        name: 'Budget Execution',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c235',
      },
      {
        name: 'Workforce Planning',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.6',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c236',
      },
      {
        name: 'Management Improvement',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.7',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c237',
      },
      {
        name: 'Budget and Performance Integration',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.8',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c238',
      },
      {
        name: 'Tax and Fiscal Policy',
        group: 'Planning and Budgeting',
        idnt: 'C.2.3.9',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c239',
      },

      {
        header: 'Internal Risk Management and Mitigation',
      },
      {
        name: 'Contingency Planning',
        group: 'Internal Risk Management and Mitigation',
        idnt: 'C.2.4.1',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c241',
      },
      {
        name: 'Continuity of Operations',
        group: 'Internal Risk Management and Mitigation',
        idnt: 'C.2.4.2',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c242',
      },
      {
        name: 'Service Recovery',
        group: 'Internal Risk Management and Mitigation',
        idnt: 'C.2.4.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c243',
      },

      {
        header: 'Revenue Collection',
      },
      {
        name: 'Debt Collection',
        group: 'Revenue Collection',
        idnt: 'C.2.5.1',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'c251',
      },
      {
        name: 'User Fee Collection',
        group: 'Revenue Collection',
        idnt: 'C.2.5.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Moderate',
        key: 'c252',
      },
      {
        name: 'Federal Asset Sales',
        group: 'Revenue Collection',
        idnt: 'C.2.5.3',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c253',
      },

      {
        header: 'Public Affairs',
      },
      {
        name: 'Customer Services',
        group: 'Public Affairs',
        idnt: 'C.2.6.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c261',
      },
      {
        name: 'Official Information Dissemination',
        group: 'Public Affairs',
        idnt: 'C.2.6.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c262',
      },
      {
        name: 'Product Outreach',
        group: 'Public Affairs',
        idnt: 'C.2.6.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c263',
      },
      {
        name: 'Public Relations',
        group: 'Public Affairs',
        idnt: 'C.2.6.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c264',
      },

      {
        header: 'Legislative Relations',
      },
      {
        name: 'Legislation Tracking',
        group: 'Legislative Relations',
        idnt: 'C.2.7.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c271',
      },
      {
        name: 'Legislation Testimony',
        group: 'Legislative Relations',
        idnt: 'C.2.7.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c272',
      },
      {
        name: 'Proposal Development',
        group: 'Legislative Relations',
        idnt: 'C.2.7.3',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'c273',
      },
      {
        name: 'Congressional Liason Operations',
        group: 'Legislative Relations',
        idnt: 'C.2.7.4',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'c274',
      },

      {
        header: 'General Government',
      },
      {
        name: 'Central Fiscal Operations',
        group: 'General Government',
        idnt: 'C.2.8.1',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'c281',
      },
      {
        name: 'Legislative Functions',
        group: 'General Government',
        idnt: 'C.2.8.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c282',
      },
      {
        name: 'Executive Functions',
        group: 'General Government',
        idnt: 'C.2.8.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c283',
      },
      {
        name: 'Central Property Management',
        group: 'General Government',
        idnt: 'C.2.8.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c284',
      },
      {
        name: 'Central Personnel Management',
        group: 'General Government',
        idnt: 'C.2.8.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c285',
      },
      {
        name: 'Taxation Management',
        group: 'General Government',
        idnt: 'C.2.8.6',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c286',
      },
      {
        name: 'Central Records and Statistics Management',
        group: 'General Government',
        idnt: 'C.2.8.7',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'c287',
      },
      {
        name: 'Income Information',
        group: 'General Government',
        idnt: 'C.2.8.8',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c288',
      },
      {
        name: 'Personal Identity and Authentication',
        group: 'General Government',
        idnt: 'C.2.8.9',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c289',
      },
      {
        name: 'Entitlement Event Information',
        group: 'General Government',
        idnt: 'C.2.8.10',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c2810',
      },
      {
        name: 'Representative Payee Information',
        group: 'General Government',
        idnt: 'C.2.8.11',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'c2811',
      },
      {
        name: 'General Information',
        group: 'General Government',
        idnt: 'C.2.8.12',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c2812',
      },

      {
        header: 'Administrative Management',
      },
      {
        name: 'Facilities, Fleet, and Equipment Management',
        group: 'Administrative Management',
        idnt: 'C.3.1.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c311',
      },
      {
        name: 'Help Desk Services',
        group: 'Administrative Management',
        idnt: 'C.3.1.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c312',
      },
      {
        name: 'Security Management',
        group: 'Administrative Management',
        idnt: 'C.3.1.3',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c313',
      },
      {
        name: 'Travel',
        group: 'Administrative Management',
        idnt: 'C.3.1.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c314',
      },
      {
        name: 'Workplace Policy Development and Management (Intra-Agency Only)',
        group: 'Administrative Management',
        idnt: 'C.3.1.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c315',
      },

      {
        header: 'Financial Management',
      },
      {
        name: 'Assets and Liability Management',
        group: 'Financial Management',
        idnt: 'C.3.2.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c321',
      },
      {
        name: 'Reporting and Information',
        group: 'Financial Management',
        idnt: 'C.3.2.2',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c322',
      },
      {
        name: 'Funds Control',
        group: 'Financial Management',
        idnt: 'C.3.2.3',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c323',
      },
      {
        name: 'Accounting',
        group: 'Financial Management',
        idnt: 'C.3.2.4',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c324',
      },
      {
        name: 'Payments',
        group: 'Financial Management',
        idnt: 'C.3.2.5',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c325',
      },
      {
        name: 'Collections and Receivable',
        group: 'Financial Management',
        idnt: 'C.3.2.6',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c326',
      },
      {
        name: 'Cost Accounting/ Performance Measuremen',
        group: 'Financial Management',
        idnt: 'C.3.2.7',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c327',
      },

      {
        header: 'Human Resource Management',
      },
      {
        name: 'HR Strateg',
        group: 'Human Resource Management',
        idnt: 'C.3.3.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c331',
      },
      {
        name: 'Staff Acquisition',
        group: 'Human Resource Management',
        idnt: 'C.3.3.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c332',
      },
      {
        name: 'Organization & Position Management',
        group: 'Human Resource Management',
        idnt: 'C.3.3.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c333',
      },
      {
        name: 'Compensation Management',
        group: 'Human Resource Management',
        idnt: 'C.3.3.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c334',
      },
      {
        name: 'Benefits Management',
        group: 'Human Resource Management',
        idnt: 'C.3.3.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c335',
      },
      {
        name: 'Employee Performance Management',
        group: 'Human Resource Management',
        idnt: 'C.3.3.6',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c336',
      },
      {
        name: 'Employee Relations',
        group: 'Human Resource Management',
        idnt: 'C.3.3.7',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c337',
      },
      {
        name: 'Labor Relations',
        group: 'Human Resource Management',
        idnt: 'C.3.3.8',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c338',
      },
      {
        name: 'Separation Management',
        group: 'Human Resource Management',
        idnt: 'C.3.3.9',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c339',
      },
      {
        name: 'Human Resources Development',
        group: 'Human Resource Management',
        idnt: 'C.3.3.10',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c3310',
      },

      {
        header: 'Supply Chain Management',
      },
      {
        name: 'Goods Acquisition',
        group: 'Supply Chain Management',
        idnt: 'C.3.4.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c341',
      },
      {
        name: 'Inventory Control',
        group: 'Supply Chain Management',
        idnt: 'C.3.4.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c342',
      },
      {
        name: 'Logistics Management',
        group: 'Supply Chain Management',
        idnt: 'C.3.4.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c343',
      },
      {
        name: 'Services Acquisition',
        group: 'Supply Chain Management',
        idnt: 'C.3.4.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c344',
      },

      {
        header: 'Information and Technology Management',
      },
      {
        name: 'System Development',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c351',
      },
      {
        name: 'Lifecycle/Change Management',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.2',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c352',
      },
      {
        name: 'System Maintenance',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.3',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c353',
      },
      {
        name: 'Infrastructure Maintenance',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c354',
      },
      {
        name: 'Information Security',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.5',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c355',
      },
      {
        name: 'Record Retention',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.6',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'c356',
      },
      {
        name: 'Information Management',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.7',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c357',
      },
      {
        name: 'System and Network Monitoring',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.8',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'c358',
      },
      {
        name: 'Information Sharing',
        group: 'Information and Technology Management',
        idnt: 'C.3.5.9',
        confidentiality: 'N/A',
        integrity: 'N/A',
        availability: 'N/A',
        key: 'c359',
      },

      {
        header: 'Homeland Security',
      },
      {
        name: 'Border and Transportation Security',
        group: 'Homeland Security',
        idnt: 'D.2.1',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'd21',
      },
      {
        name: 'Key Asset and Critical Infrastructure Protection',
        group: 'Homeland Security',
        idnt: 'D.2.2',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'High',
        key: 'd22',
      },
      {
        name: 'Catastrophic Defense',
        group: 'Homeland Security',
        idnt: 'D.2.3',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'High',
        key: 'd23',
      },
      {
        name: 'Executive Functions of the Executive Office of the President (EOP)',
        group: 'Homeland Security',
        idnt: 'D.2.4',
        confidentiality: 'High',
        integrity: 'Moderate',
        availability: 'High',
        key: 'd24',
      },

      {
        header: 'Intelligence Operations',
      },
      {
        name: 'Intelligence Operation',
        group: 'Intelligence Operations',
        idnt: 'D.3',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'High',
        key: 'd3',
      },

      {
        header: 'Disaster Management',
      },
      {
        name: 'Disaster Monitoring and Prediction',
        group: 'Disaster Management',
        idnt: 'D.4.1',
        confidentiality: 'Low',
        integrity: 'High',
        availability: 'High',
        key: 'd41',
      },
      {
        name: 'Disaster Preparedness and Planning',
        group: 'Disaster Management',
        idnt: 'D.4.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd42',
      },
      {
        name: 'Disaster Repair and Restoration',
        group: 'Disaster Management',
        idnt: 'D.4.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd43',
      },
      {
        name: 'Emergency Response',
        group: 'Disaster Management',
        idnt: 'D.4.4',
        confidentiality: 'Low',
        integrity: 'High',
        availability: 'High',
        key: 'd44',
      },

      {
        header: 'International Affairs and Commerce',
      },
      {
        name: 'Foreign Affairs',
        group: 'International Affairs and Commerce',
        idnt: 'D.5.1',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'Moderate',
        key: 'd51',
      },
      {
        name: 'International Development and Humanitarian Aid',
        group: 'International Affairs and Commerce',
        idnt: 'D.5.2',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd52',
      },
      {
        name: 'Global Trade',
        group: 'International Affairs and Commerce',
        idnt: 'D.5.3',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'High',
        key: 'd53',
      },

      {
        header: 'Natural Resources',
      },
      {
        name: 'Water Resource Management',
        group: 'Natural Resources',
        idnt: 'D.6.1',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'Moderate',
        key: 'd61',
      },
      {
        name: 'Conservation, Marine and Land Management',
        group: 'Natural Resources',
        idnt: 'D.6.2',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd62',
      },
      {
        name: 'Recreational Resource Management and Tourism',
        group: 'Natural Resources',
        idnt: 'D.6.3',
        confidentiality: 'High',
        integrity: 'High',
        availability: 'High',
        key: 'd63',
      },
      {
        name: 'Agricultural Innovation and Services',
        group: 'Natural Resources',
        idnt: 'D.6.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd64',
      },

      {
        header: 'Energy',
      },
      {
        name: 'Energy Supply',
        group: 'Energy',
        idnt: 'D.7.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Moderate',
        key: 'd71',
      },
      {
        name: 'Energy Conservation and Preparedness',
        group: 'Energy',
        idnt: 'D.7.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd72',
      },
      {
        name: 'Energy Resource Management',
        group: 'Energy',
        idnt: 'D.7.3',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd73',
      },
      {
        name: 'Energy Production',
        group: 'Energy',
        idnt: 'D.7.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd74',
      },

      {
        header: 'Environmental Management',
      },
      {
        name: 'Environmental Monitoring and Forecasting',
        group: 'Environmental Management',
        idnt: 'D.8.1',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'd81',
      },
      {
        name: 'Environmental Remediation',
        group: 'Environmental Management',
        idnt: 'D.8.2',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd82',
      },
      {
        name: 'Pollution Prevention and Control',
        group: 'Environmental Management',
        idnt: 'D.8.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd83',
      },

      {
        header: 'Economic Development',
      },
      {
        name: 'Business and Industry Development',
        group: 'Economic Development',
        idnt: 'D.9.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd91',
      },
      {
        name: 'Intellectual Property Protection',
        group: 'Economic Development',
        idnt: 'D.9.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd92',
      },
      {
        name: 'Financial Sector Oversight',
        group: 'Economic Development',
        idnt: 'D.9.3',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd93',
      },
      {
        name: 'Industry Sector Income Stabilization',
        group: 'Economic Development',
        idnt: 'D.9.4',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'd94',
      },

      {
        header: 'Community and Social Services',
      },
      {
        name: 'Homeownership Promotion',
        group: 'Community and Social Services',
        idnt: 'D.10.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd101',
      },
      {
        name: 'Community and Regional Development',
        group: 'Community and Social Services',
        idnt: 'D.10.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd102',
      },
      {
        name: 'Social Services',
        group: 'Community and Social Services',
        idnt: 'D.10.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd103',
      },
      {
        name: 'Postal Services',
        group: 'Community and Social Services',
        idnt: 'D.10.4',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'd104',
      },

      {
        header: 'Transportation',
      },
      {
        name: 'Ground Transportation',
        group: 'Transportation',
        idnt: 'D.11.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd111',
      },
      {
        name: 'Water Transportation',
        group: 'Transportation',
        idnt: 'D.11.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd112',
      },
      {
        name: 'Air Transportation',
        group: 'Transportation',
        idnt: 'D.11.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd113',
      },
      {
        name: 'Space Operations',
        group: 'Transportation',
        idnt: 'D.11.4',
        confidentiality: 'Low',
        integrity: 'High',
        availability: 'High',
        key: 'd114',
      },
      {
        header: 'Education',
      },
      {
        name: 'Elementary, Secondary, and Vocational Education',
        group: 'Education',
        idnt: 'D.12.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd121',
      },
      {
        name: 'Higher Education',
        group: 'Education',
        idnt: 'D.12.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd122',
      },
      {
        name: 'Cultural and Historic Preservation',
        group: 'Education',
        idnt: 'D.12.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd123',
      },
      {
        name: 'Cultural and Historic Exhibition',
        group: 'Education',
        idnt: 'D.12.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd124',
      },

      {
        header: 'Workforce Management',
      },
      {
        name: 'Training and Employment',
        group: 'Workforce Management',
        idnt: 'D.13.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd131',
      },
      {
        name: 'Labor Rights Management',
        group: 'Workforce Management',
        idnt: 'D.13.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd132',
      },
      {
        name: 'Worker Safety',
        group: 'Workforce Management',
        idnt: 'D.13.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd133',
      },

      {
        header: 'Health',
      },
      {
        name: 'Access to Care',
        group: 'Health',
        idnt: 'D.13.1',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'd131123',
      },
      {
        name: 'Population Health Management and Consumer Safety',
        group: 'Health',
        idnt: 'D.13.2',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'd1322222',
      },
      {
        name: 'Health Care Administration',
        group: 'Health',
        idnt: 'D.13.3',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'd133333',
      },
      {
        name: 'Health Care Delivery Services',
        group: 'Health',
        idnt: 'D.13.4',
        confidentiality: 'Low',
        integrity: 'High',
        availability: 'Low',
        key: 'd13444',
      },
      {
        name: 'Health Care Research and Practitioner Education',
        group: 'Health',
        idnt: 'D.13.5',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'd135',
      },

      {
        header: 'Income Security',
      },
      {
        name: 'General Retirement and Disability',
        group: 'Income Security',
        idnt: 'D.14.1',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'd1411',
      },
      {
        name: 'Unemployment Compensation',
        group: 'Income Security',
        idnt: 'D.14.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd1412',
      },
      {
        name: 'Housing Assistance',
        group: 'Income Security',
        idnt: 'D.14.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd1413',
      },
      {
        name: 'Food and Nutrition Assistance',
        group: 'Income Security',
        idnt: 'D.14.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'd1414',
      },
      {
        name: 'Survivor Compensation',
        group: 'Income Security',
        idnt: 'D.14.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a0',
      },

      {
        header: 'Law Enforcement',
      },
      {
        name: 'Criminal Apprehension',
        group: 'Law Enforcement',
        idnt: 'D.15.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Moderate',
        key: 'dd0a1',
      },
      {
        name: 'Criminal Investigation and Surveillance',
        group: 'Law Enforcement',
        idnt: 'D.15.2',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a2',
      },
      {
        name: 'Citizen Protection',
        group: 'Law Enforcement',
        idnt: 'D.15.3',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a3',
      },
      {
        name: 'Leadership Protection',
        group: 'Law Enforcement',
        idnt: 'D.15.4',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a4',
      },
      {
        name: 'Property Protection',
        group: 'Law Enforcement',
        idnt: 'D.15.5',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a5',
      },
      {
        name: 'Substance Control',
        group: 'Law Enforcement',
        idnt: 'D.15.6',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a6',
      },
      {
        name: 'Crime Prevention',
        group: 'Law Enforcement',
        idnt: 'D.15.7',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a7',
      },
      {
        name: 'Trade Law Enforcement',
        group: 'Law Enforcement',
        idnt: 'D.15.8',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a8',
      },

      {
        header: 'Litigation and Judicial Activities',
      },
      {
        name: 'Judicial Hearings',
        group: 'Litigation and Judicial Activities',
        idnt: 'D.16.1',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a9',
      },
      {
        name: 'Legal Defense',
        group: 'Litigation and Judicial Activities',
        idnt: 'D.16.2',
        confidentiality: 'Moderate',
        integrity: 'High',
        availability: 'Low',
        key: 'dd0a10',
      },
      {
        name: 'Legal Investigation',
        group: 'Litigation and Judicial Activities',
        idnt: 'D.16.3',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a11',
      },
      {
        name: 'Legal Prosecution and Litigation',
        group: 'Litigation and Judicial Activities',
        idnt: 'D.16.4',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Moderate',
        key: 'dd0a11',
      },
      {
        name: 'Resolution Facilitation',
        group: 'Litigation and Judicial Activities',
        idnt: 'D.16.5',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a11',
      },

      {
        header: 'Federal Correctional Activities',
      },
      {
        name: 'Criminal Incarceration',
        group: 'Federal Correctional Activities',
        idnt: 'D.17.1',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'dd0a12',
      },
      {
        name: 'Criminal Rehabilitation',
        group: 'Federal Correctional Activities',
        idnt: 'D.17.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a13',
      },

      {
        header: 'General Science and Innovation',
      },
      {
        name: 'Scientific and Technological Research and Innovation',
        group: 'General Science and Innovation',
        idnt: 'D.18.1',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'dd0a13',
      },
      {
        name: 'Space Exploration and Innovation',
        group: 'General Science and Innovation',
        idnt: 'D.18.2',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'dd0a14',
      },

      {
        header: 'Knowledge Creation and Management',
      },
      {
        name: 'Research and Development',
        group: 'Knowledge Creation and Management',
        idnt: 'D.19.1',
        confidentiality: 'Low',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'dd0a15',
      },
      {
        name: 'General Purpose Data and Statistics',
        group: 'Knowledge Creation and Management',
        idnt: 'D.19.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a16',
      },
      {
        name: 'Advising and Consulting',
        group: 'Knowledge Creation and Management',
        idnt: 'D.19.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a17',
      },
      {
        name: 'Knowledge Dissemination',
        group: 'Knowledge Creation and Management',
        idnt: 'D.19.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a18',
      },

      {
        header: 'Regulatory Compliance and Enforcement',
      },
      {
        name: 'Inspections and Auditing',
        group: 'Regulatory Compliance and Enforcement',
        idnt: 'D.20.1',
        confidentiality: 'Moderate',
        integrity: 'Moderate',
        availability: 'Low',
        key: 'dd0a19',
      },
      {
        name: 'Standards Setting/ Reporting Guideline Development',
        group: 'Regulatory Compliance and Enforcement',
        idnt: 'D.20.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a20',
      },
      {
        name: 'Permits and Licensing',
        group: 'Regulatory Compliance and Enforcement',
        idnt: 'D.20.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a21',
      },

      {
        header: 'Public Goods Creation and Management',
      },
      {
        name: 'Manufacturing',
        group: 'Public Goods Creation and Management',
        idnt: 'D.21.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a22',
      },
      {
        name: 'Construction',
        group: 'Public Goods Creation and Management',
        idnt: 'D.21.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a23',
      },
      {
        name: 'Public Resources, Facility, and Infrastructure Management',
        group: 'Public Goods Creation and Management',
        idnt: 'D.21.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a24',
      },
      {
        name: 'Information Infrastructure Management',
        group: 'Public Goods Creation and Management',
        idnt: 'D.21.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a25',
      },

      {
        header: 'Federal Financial Assistance',
      },
      {
        name: 'Federal Grants (Non-State)',
        group: 'Federal Financial Assistance',
        idnt: 'D.22.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a26',
      },
      {
        name: 'Direct Transfers to Individuals',
        group: 'Federal Financial Assistance',
        idnt: 'D.22.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a27',
      },
      {
        name: 'Subsidies',
        group: 'Federal Financial Assistance',
        idnt: 'D.22.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a28',
      },
      {
        name: 'Tax Credits',
        group: 'Federal Financial Assistance',
        idnt: 'D.22.4',
        confidentiality: 'Moderate',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a29',
      },

      {
        header: 'Credits and Insurance',
      },
      {
        name: 'Direct Loans',
        group: 'Credits and Insurance',
        idnt: 'D.23.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a30',
      },
      {
        name: 'Loan Guarantees',
        group: 'Credits and Insurance',
        idnt: 'D.23.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a31',
      },
      {
        name: 'General Insurance',
        group: 'Credits and Insurance',
        idnt: 'D.23.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a32',
      },

      {
        header: 'Transfers to State/Local Governments',
      },
      {
        name: 'Formula Grants',
        group: 'Transfers to State/Local Governments',
        idnt: 'D.24.1',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a33',
      },
      {
        name: 'Project/Competitive Grants',
        group: 'Transfers to State/Local Governments',
        idnt: 'D.24.2',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a34',
      },
      {
        name: 'Earmarked Grants',
        group: 'Transfers to State/Local Governments',
        idnt: 'D.24.3',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a35',
      },
      {
        name: 'State Loans',
        group: 'Transfers to State/Local Governments',
        idnt: 'D.24.4',
        confidentiality: 'Low',
        integrity: 'Low',
        availability: 'Low',
        key: 'dd0a36',
      },

      {
        header: 'Direct Services for Citizens',
      },
      {
        name: 'Military Operations',
        group: 'Direct Services for Citizens',
        idnt: 'D.25.1',
        confidentiality: 'N/A',
        integrity: 'N/A',
        availability: 'N/A',
        key: 'dd0a37',
      },
      {
        name: 'Civilian Operations',
        group: 'Direct Services for Citizens',
        idnt: 'D.25.2',
        confidentiality: 'N/A',
        integrity: 'N/A',
        availability: 'N/A',
        key: 'dd0a38',
      },
    ]

    let sensitivity_cat_object = {
      confidentiality_high: 0,
      confidentiality_moderate: 0,
      confidentiality_low: 0,
      integrity_high: 0,
      integrity_moderate: 0,
      integrity_low: 0,
      availability_high: 0,
      availability_moderate: 0,
      availability_low: 0,
    }
    const sensitivity_cat_length = () => {
      sensitivity_cat_object = {
        confidentiality_high: 0,
        confidentiality_moderate: 0,
        confidentiality_low: 0,
        integrity_high: 0,
        integrity_moderate: 0,
        integrity_low: 0,
        availability_high: 0,
        availability_moderate: 0,
        availability_low: 0,
      }

      SSPData.value.sensitivity_cat.filter(function (sensitivity_cat) {
        switch (sensitivity_cat.confidentiality.toLowerCase()) {
          case 'high':
            sensitivity_cat_object.confidentiality_high++
            break
          case 'moderate':
            sensitivity_cat_object.confidentiality_moderate++
            break
          case 'low':
            sensitivity_cat_object.confidentiality_low++
            break
          default:
            break
        }

        switch (sensitivity_cat.integrity.toLowerCase()) {
          case 'high':
            sensitivity_cat_object.integrity_high++
            break
          case 'moderate':
            sensitivity_cat_object.integrity_moderate++
            break
          case 'low':
            sensitivity_cat_object.integrity_low++
            break
          default:
            break
        }

        switch (sensitivity_cat.availability.toLowerCase()) {
          case 'high':
            sensitivity_cat_object.availability_high++
            break
          case 'moderate':
            sensitivity_cat_object.availability_moderate++
            break
          case 'low':
            sensitivity_cat_object.availability_low++
            break
          default:
            break
        }
        return
      })
    }
    const sensitivity_cat_update = () => {
      updateSecurityObjectives = ref(true)
      setTimeout(() => {
        sensitivity_cat_length()

        if (sensitivity_cat_object.confidentiality_high > 0) {
          SSPData.value.security_objectives_cat.confidentiality = 'high'
        } else if (sensitivity_cat_object.confidentiality_moderate > 0) {
          SSPData.value.security_objectives_cat.confidentiality = 'moderate'
        } else {
          SSPData.value.security_objectives_cat.confidentiality = 'low'
        }

        if (sensitivity_cat_object.integrity_high > 0) {
          SSPData.value.security_objectives_cat.integrity = 'high'
        } else if (sensitivity_cat_object.integrity_moderate > 0) {
          SSPData.value.security_objectives_cat.integrity = 'moderate'
        } else {
          SSPData.value.security_objectives_cat.integrity = 'low'
        }

        if (sensitivity_cat_object.availability_high > 0) {
          SSPData.value.security_objectives_cat.availability = 'high'
        } else if (sensitivity_cat_object.availability_moderate > 0) {
          SSPData.value.security_objectives_cat.availability = 'moderate'
        } else {
          SSPData.value.security_objectives_cat.availability = 'low'
        }

        sensitivity_level_update()
      }, 1000)
    }
    const sensitivity_level_update = () => {
      sensitivity_cat_length()

      if (
        SSPData.value.security_objectives_cat.integrity == 'high' ||
        SSPData.value.security_objectives_cat.integrity == 'high' ||
        SSPData.value.security_objectives_cat.availability == 'high'
      ) {
        SSPData.value.sensitivity_level = SSPData.value.baseline_security_cat = 'high'
      } else if (
        SSPData.value.security_objectives_cat.integrity == 'moderate' ||
        SSPData.value.security_objectives_cat.integrity == 'moderate' ||
        SSPData.value.security_objectives_cat.availability == 'moderate'
      ) {
        SSPData.value.sensitivity_level = SSPData.value.baseline_security_cat = 'moderate'
      } else {
        SSPData.value.sensitivity_level = SSPData.value.baseline_security_cat = 'low'
      }

      updateSecurityObjectives = false
    }
    const addItem = () => {
      SSPData.value.sensitivity_cat.push({
        type: '',
        idnt: '',
        confidentiality: '',
        integrity: '',
        availability: '',
      })
    }
    const removeItem = (index) => {
      SSPData.value.sensitivity_cat.splice(index, 1)

      sensitivity_cat_update()
    }
    const setInformationTypes = (index, selectedType) => {
      var selectedItem = InformationTypes.filter((type) => type.name == selectedType)
      if (selectedItem[0] && selectedItem[0].idnt) {
        SSPData.value.sensitivity_cat[index].idnt = selectedItem[0].idnt
        SSPData.value.sensitivity_cat[index].confidentiality = selectedItem[0].confidentiality
        SSPData.value.sensitivity_cat[index].integrity = selectedItem[0].integrity
        SSPData.value.sensitivity_cat[index].availability = selectedItem[0].availability
      }
      sensitivity_cat_update()
    }

    const setFrameworks = () => {
      // console.log('This method was not set yet!')
    }

    return {
      sensitivity_cat_update,
      removeItem,
      addItem,
      setInformationTypes,
      setFrameworks,
      updateSecurityObjectives,
      InformationTypes,
      SSPData,
      SSPLoading,
      columns,
      senLevels,
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {},
    }
  },
  data: function () {
    return {}
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

<style >
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
