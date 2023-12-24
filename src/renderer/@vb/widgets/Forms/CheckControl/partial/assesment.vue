<template>
  <div class="col-md-12 col-sm-12 col-xs-12 mb-3 mt-4" v-if="audit.length > 0">
    <div v-if="!audit_loading">
      <div v-if="hideOther">
        <div class="card bg-light border-blue mb-3">
          <div class="card-header border-bottom pt-3 pb-3">
            <div class="text-uppercase text-dark font-weight-bold">
              <div class="vb__utils__heading">
                <strong> Assessment : </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4 mt-4">
          <a-form-item label="Reviewer :">
            <a-input
              :disabled="disabled"
              v-model:value="reviewerData.user_name"
              placeholder="Reviewer"
            />
          </a-form-item>
        </div>
        <div class="col-lg-4 mt-4">
          <a-form-item label=" Review date :">
            <a-date-picker
              v-model:value="reviewerData.date"
              class="w-100"
              :default-value="reviewerData.date"
              :disabled="disabled"
              placeholder="Review Date"
            />
          </a-form-item>
        </div>
        <div class="col-lg-4 mt-4">
          <a-form-item label=" Assessment status :">
            <a-tag
              class="p-1 pb-2 w-100 text-center"
              key="00"
              :color="
                reviewerData.status == 'COMPLIANT'
                  ? 'green'
                  : reviewerData.status == 'NON-COMPLIANT'
                  ? 'orange'
                  : 'gray'
              "
            >
              {{ reviewerData.status || 'Not applicable' }}
            </a-tag>
          </a-form-item>
        </div>
      </div>
      <template v-for="(a, a0) in audit" :key="a0">
        <div
          class="d-flex flex-column flex-grow-1 justify-content-center ml-1 mb-4 mt-4"
          v-if="hideOther"
        >
          <h6>
            <div class="vb__utils__heading">{{ a.parent }} Assessment history</div>
          </h6>
        </div>
        <a-table
          v-if="hideOther"
          :columns="audit_history_columns"
          :data-source="framework=='NIST80053R5'?a.AuditR5Controls:a.AuditControls"
          :pagination="false"
        >
          <template #version="{ record }">
            <a-tag
              class="m-1 w-100 text-center"
              key="00"
              @click="update_audit_data(record)"
              :color="
                record.version == reviewerData.version
                  ? 'green'
                  : record.is_draft
                  ? 'orange'
                  : 'gray'
              "
            >
              {{ record.version || 'Draft' }}
            </a-tag>
          </template>
        </a-table>
        <div class="d-flex flex-column flex-grow-1 justify-content-center ml-1 mb-4 mt-3">
          <h6>
            <div class="vb__utils__heading">{{ a.parent }} Assessment objective</div>
          </h6>
        </div>
        <a-collapse>
          <a-collapse-panel key="000">
            <template #header>
              <a-typography-title :level="5" class="m-0">
                {{ audit_data(a, framework).data.number }}
                <a-typography-text class="float-right" type="secondary">{{
                  audit_data(a, framework).data.title
                }}</a-typography-text>
              </a-typography-title>
            </template>
            <a-typography-title :level="5">{{ audit_data(a, framework).data.decision }}</a-typography-title>
            <template v-if="audit_data(a, framework).data.childrens.length > 0">
              <a-collapse class="mb-2">
                <a-collapse-panel
                  v-for="(i0, in0) in audit_data(a, framework).data.childrens"
                  :key="in0"
                  :header="i0.number"
                >
                  <a-typography-title :level="5">{{ i0.decision }}</a-typography-title>
                  <template v-if="i0.childrens.length > 0">
                    <a-collapse>
                      <a-collapse-panel
                        v-for="(i1, in1) in i0.childrens"
                        :key="in1"
                        :header="i1.number"
                      >
                        <a-typography-title :level="5">{{ i1.decision }}</a-typography-title>
                        <template v-if="i1.childrens.length > 0">
                          <a-collapse>
                            <a-collapse-panel
                              v-for="(i2, in2) in i1.childrens"
                              :key="in2"
                              :header="i2.number"
                            >
                              <a-typography-title :level="5">{{ i2.decision }}</a-typography-title>
                              <template v-if="i2.childrens.length > 0">
                                <a-collapse>
                                  <a-collapse-panel
                                    v-for="(i3, in3) in i2.childrens"
                                    :key="in3"
                                    :header="i3.number"
                                  >
                                    <a-typography-title :level="5">{{
                                      i3.decision
                                    }}</a-typography-title>
                                    <template v-if="i3.childrens.length > 0">
                                      <a-collapse>
                                        <a-collapse-panel
                                          v-for="(i4, in4) in i3.childrens"
                                          :key="in4"
                                          :header="i4.number"
                                        >
                                        </a-collapse-panel>
                                      </a-collapse>
                                    </template>
                                    <a-from v-else>
                                      <a-form-item label="Status">
                                        <a-select
                                          :disabled="disabled"
                                          :default-value="item"
                                          v-model:value="i3.policeStatusSelected"
                                          placeholder="Status"
                                          style="width: 100% !important"
                                        >
                                          <a-select-option value="NOT_ASSESSED" selected>
                                            Not Assessed
                                          </a-select-option>
                                          <a-select-option value="COMPLIANT">
                                            Compliant
                                          </a-select-option>
                                          <a-select-option value="NON-COMPLIANT">
                                            Non-Compliant
                                          </a-select-option>
                                          <a-select-option value="NOT-APPLICABLE">
                                            Not Applicable
                                          </a-select-option>
                                        </a-select>
                                      </a-form-item>
                                      <a-form-item label="Note">
                                        <a-textarea
                                          :rows="3"
                                          v-model:value="i3.description"
                                          :disabled="disabled"
                                          placeholder="Note"
                                        />
                                      </a-form-item>
                                    </a-from>
                                  </a-collapse-panel>
                                </a-collapse>
                              </template>
                              <a-from v-else>
                                <a-form-item label="Status">
                                  <a-select
                                    :disabled="disabled"
                                    :default-value="i2.policeStatusSelected"
                                    v-model:value="i2.policeStatusSelected"
                                    placeholder="Status"
                                    style="width: 100% !important"
                                  >
                                    <a-select-option value="COMPLIANT"> Compliant </a-select-option>
                                    <a-select-option value="NON-COMPLIANT">
                                      Non-compliant
                                    </a-select-option>
                                    <a-select-option value="NOT-APPLICABLE">
                                      Not-applicable
                                    </a-select-option>
                                  </a-select>
                                </a-form-item>
                                <a-form-item label="Note">
                                  <a-textarea
                                    v-model:value="i2.description"
                                    :rows="3"
                                    :disabled="disabled"
                                    placeholder="Note"
                                  />
                                </a-form-item>
                              </a-from>
                            </a-collapse-panel>
                          </a-collapse>
                        </template>
                        <a-from v-else>
                          <a-form-item label="Status">
                            <a-select
                              :disabled="disabled"
                              :default-value="i1.policeStatusSelected"
                              v-model:value="i1.policeStatusSelected"
                              placeholder="Status"
                              style="width: 100% !important"
                            >
                              <a-select-option value="NOT_ASSESSED" selected>
                                Not Assessed
                              </a-select-option>
                              <a-select-option value="COMPLIANT"> Compliant </a-select-option>
                              <a-select-option value="NON-COMPLIANT">
                                Non-Compliant
                              </a-select-option>
                              <a-select-option value="NOT-APPLICABLE">
                                Not Applicable
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-form-item label="Note">
                            <a-textarea
                              :rows="3"
                              v-model:value="i1.description"
                              :disabled="disabled"
                              placeholder="Note"
                            />
                          </a-form-item>
                        </a-from>
                      </a-collapse-panel>
                    </a-collapse>
                  </template>
                  <a-from v-else>
                    <a-form-item label="Status">
                      <a-select
                        :disabled="disabled"
                        :default-value="i0.policeStatusSelected"
                        v-model:value="i0.policeStatusSelected"
                        placeholder="Status"
                        style="width: 100% !important"
                      >
                        <a-select-option value="NOT_ASSESSED" selected> Not Assessed </a-select-option>
                        <a-select-option value="COMPLIANT"> Compliant </a-select-option>
                        <a-select-option value="NON-COMPLIANT"> Non-Compliant </a-select-option>
                        <a-select-option value="NOT-APPLICABLE"> Not Applicable </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="Note">
                      <a-textarea
                        :rows="3"
                        v-model:value="i0.description"
                        :disabled="disabled"
                        placeholder="Note"
                      />
                    </a-form-item>
                  </a-from>
                </a-collapse-panel>
              </a-collapse>
            </template>

            <template v-for="(item, index) in audit_data(a, framework).data.potentialAssessments" :key="index">
              <a-form-item v-if="item.name!=''" class="mb-2" :label="item.name">
                <a-select
                  :disabled="disabled"
                  :placeholder="item.name"
                  :default-value="item[index]"
                  v-model:value="item[index]"
                  :style="{ width: '100% !important' }"
                >
                  <a-select-option v-for="i in item.data" :key="i">{{ i }}</a-select-option>
                  <a-select-option key="Others">Others</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                v-if="item[index] == 'Others'"
                label="Other explanation"
                class="mt-1 mb-2"
              >
                <a-textarea
                  :rows="2"
                  :disabled="disabled"
                  v-model:value="item.others_explanation"
                  placeholder="Other explanation"
                />
              </a-form-item>
            </template>

            <div class="card-footer m-1 mt-3" v-if="hideOther">
              <button
                type="button"
                :disabled="disabled"
                @click="save_audit(a, false, framework)"
                class="btn btn-primary px-5 ml-2 pull-right"
                style="margin-top: -10px"
              >
                Save
              </button>
              <button
                type="button"
                :disabled="disabled"
                @click="save_audit(a, true, framework)"
                class="btn btn-warning px-5 pull-right"
                style="margin-top: -10px"
              >
                Save as draft
              </button>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </template>
    </div>
    <template v-if="audit_loading">
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />
    </template>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { toRefs, computed, reactive, ref, getCurrentInstance } from 'vue'
import moment from 'moment';

export default {
  components: {},
  props: {
    audit: {
      type: Array,
      default: () => {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    framework: {
      type: String,
      default() {
        return "NIST80053R4"
      }
    },
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()

    const { emit } = getCurrentInstance()
    const hideOther = ref(route.fullPath.includes('framework-controls/profile'))

    var audit_data = (audit_data, framework) => {
      if(framework=='NIST80053R5') {
        if (audit_data.AuditR5Controls && audit_data.AuditR5Controls.length > 0) {
          audit_data.AuditR5Controls[0].new_version = (
            parseInt(audit_data.AuditR5Controls[0].version) + 1.0
          ).toFixed(1)
          audit_data.AuditR5Controls[0].is_draft_id = audit_data.AuditR5Controls[0].id
          return audit_data.AuditR5Controls[0]
        }
      } else{
      if (audit_data.AuditControls && audit_data.AuditControls.length > 0) {
        audit_data.AuditControls[0].new_version = (
          parseInt(audit_data.AuditControls[0].version) + 1.0
        ).toFixed(1)
        audit_data.AuditControls[0].is_draft_id = audit_data.AuditControls[0].id
        return audit_data.AuditControls[0]
      }
    }
      audit_data.new_version = (1.0).toFixed(1)
      return audit_data
    }

    let reviewerData = computed(() => {
      if (props.audit[0].AuditControls && props.audit[0].AuditControls.length > 0) {
        // console.log("props.audit: ", props.audit)
        return reactive({
          date: moment(props.audit[0].AuditControls[0].date).format('yyyy-MM-DD'),
          user_name: props.audit[0].AuditControls[0].user_name,
          version: props.audit[0].AuditControls[0].version,
        })
      }
      if (props.audit[0].AuditR5Controls && props.audit[0].AuditR5Controls.length > 0) {
        return reactive({
          date: moment(props.audit[0].AuditR5Controls[0].date).format('yyyy-MM-DD'),
          user_name: props.audit[0].AuditR5Controls[0].user_name,
          version: props.audit[0].AuditR5Controls[0].version,
        })
      }
      return reactive({
         date: moment(new Date()).format('yyyy-MM-DD'),
         user_name: store.getters['user/user'].display_name,
         user_id: store.getters['user/user'].id,
         version: null,
      })
    })
//console.log("reviewerData", reviewerData)
    const update_audit_data = (data) => {
      audit_data = computed(() => data.data)

      reviewerData.value = reactive({
        date: new Date(data.date).toLocaleDateString(),
        user_name: data.user_name,
        version: data.version,
      })
    }

    const save_audit = (a, draft, framework) => {
      emit('save', {
        audit_data: audit_data(a, framework),
        reviewerData: reviewerData,
        is_draft: draft,
      })
    }

    const audit_history_columns = [
      {
        title: 'Name',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'Date',
        key: 'date',
        customRender: (value, row, index) => {
          return new Date(value.record.date).toLocaleDateString()
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Tags',
        key: 'version',
        slots: { customRender: 'version' },
      },
    ]

    const capitalizeFLetter = (string) => {
      console.log(string[0].toUpperCase() +
        string.slice(1));
    }

    return {
      hideOther,
      audit_history_columns,
      audit_data,
      reviewerData,
      update_audit_data,
      save_audit,
      capitalizeFLetter,
    }
  },
}
</script>
