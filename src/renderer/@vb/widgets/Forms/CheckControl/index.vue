<template>
  <a-form :rules="rules" :model="control" label-align="left" layout="vertical" @finish="onSubmit">
    <div class="row">
      <div class="col-lg-2 mt-4">
        <a-form-item>
          <a-checkbox v-model:checked="control.remediate" :disabled="disabled"
            >Remediate</a-checkbox
          >
        </a-form-item>
      </div>
      <div class="col-lg-3 mt-4">
        <a-form-item>
          <a-checkbox v-model:checked="control.validate" :disabled="disabled">Validate</a-checkbox>
        </a-form-item>
      </div>
      <div class="col-lg-3 mt-4">
        <a-form-item>
          <a-checkbox v-model:checked="control.inheritable" :disabled="disabled"
            >Inheritable</a-checkbox
          >
        </a-form-item>
      </div>

      <div class="col-lg-4">
        <a-form-item label="Status">
          <a-select
            v-model:value="control.compliance_status"
            :default-value="control.compliance_status"
            :disabled="disabled"
            placeholder="Status"
            style="width: 100% !important"
          >
            <a-select-option value="AUTOMATED" selected>Automated</a-select-option>
            <a-select-option value="COMPLIANT">Compliant</a-select-option>
            <a-select-option value="NON-COMPLIANT">Non-Compliant</a-select-option>
            <a-select-option value="NOT-APPLICABLE">Not Applicable</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="card bg-light border-blue">
          <div class="card-header border-bottom pt-3 pb-3">
            <div class="text-uppercase text-dark font-weight-bold">
              <div class="vb__utils__heading">
                <strong> Type of Control : </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <a-form-item>
          <a-radio-group
            v-model:value="control.control_type.type"
            :default-value="control.control_type.type"
            :disabled="disabled"
          >
            <a-radio :disabled="control.inheritable" value="specific">System-Specific</a-radio>
            <a-radio :disabled="control.inheritable" value="common">Common Control</a-radio>
            <a-radio :disabled="control.inheritable" value="hybrid">Hybrid Control</a-radio>
            <a-radio :disabled="control.inheritable" value="N/A">N/A</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>

      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="card bg-light border-blue">
          <div class="card-header border-bottom pt-3 pb-3">
            <div class="text-uppercase text-dark font-weight-bold">
              <div class="vb__utils__heading">
                <strong> Implementation : </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body pt-0 pb-3">
        Summary of Control Implementation <br />
        Implementation Status (check all that apply): <br />
        <a-checkbox-group
          v-model:value="control.implementation.status"
          :default-value="control.implementation.status"
          class="mt-3"
          style="width: 108%"
        >
          <div class="row">
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="internally" :disabled="disabled"
                  >Implemented (internally controlled)</a-checkbox
                >
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="outsourced" :disabled="disabled"
                  >Implemented (outsourced execution of control)
                </a-checkbox>
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="partially" :disabled="disabled"
                  >Partially Implemented (Identified in POA&M)
                </a-checkbox>
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="planned" :disabled="disabled"
                  >Planned (Identified in POA&M)</a-checkbox
                >
              </a-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="alternative" :disabled="disabled"
                  >Alternative Implementation (Compensating Controls)
                </a-checkbox>
              </a-form-item>
            </div>
            <div class="col-lg-6">
              <a-form-item>
                <a-checkbox value="na" :disabled="disabled">Not applicable</a-checkbox>
              </a-form-item>
            </div>
          </div>
        </a-checkbox-group>
        <div class="row">
          <div class="col-lg-6">
                <div class="row mb-2">
                   <div style="width: 120px;">
                    Process Owner
                   </div>
                   <div class="help-icon">
                     <a-tooltip placement="right">
                       <template #title>
                         <span> name of the individual or team accountable for the procedure being performed </span>
                       </template>
                       <i class="fas fa-info-circle" />
                     </a-tooltip>
                   </div>
                </div>
                <a-form-item>
                  <a-input
                    v-model:value="control.implementation.owner"
                    :disabled="disabled"
                    placeholder="Process Owner"
                  />
                </a-form-item>
          </div>
          <div class="col-lg-6">
            <div class="row mb-2">
              <div style="width: 135px;">
               Process Operator
              </div>
              <div class="help-icon">
                <a-tooltip placement="right">
                  <template #title>
                    <span> name of the individual or team responsible to perform the procedure’s tasks </span>
                  </template>
                  <i class="fas fa-info-circle" />
                </a-tooltip>
              </div>
            </div>
            <a-form-item>
              <a-input
                v-model:value="control.implementation.operator"
                :disabled="disabled"
                placeholder="Process Operator"
              />
            </a-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="row mb-2">
              <div style="width: 100px;">
                Occurrence
              </div>
              <div class="help-icon">
                <a-tooltip placement="right">
                  <template #title>
                    <span> how often the procedure need is performed </span>
                  </template>
                  <i class="fas fa-info-circle" />
                </a-tooltip>
              </div>
            </div>
            <a-form-item>
              <a-input
                v-model:value="control.implementation.occurrence"
                :disabled="disabled"
                placeholder="Occurrence"
              />
            </a-form-item>
          </div>
          <div class="col-lg-6">
            <div class="row mb-2">
              <div style="width: 265px;">
                Location of Additional Documentation
              </div>
              <div class="help-icon">
                <a-tooltip placement="right">
                  <template #title>
                    <span> location where additional documentation can be found, e.g., policies, standards, procedures and other evidence </span>
                  </template>
                  <i class="fas fa-info-circle" />
                </a-tooltip>
              </div>
            </div>
            <a-form-item>
              <a-input
                v-model:value="control.implementation.docs"
                :disabled="disabled"
                placeholder="Location of Additional Documentation"
              />
            </a-form-item>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="row mb-2">
              <div style="width: 140px;">
                Technology in Use
              </div>
              <div class="help-icon">
                <a-tooltip placement="right">
                  <template #title>
                    <span> if applicable, the name of the application/system/service used to perform the procedure </span>
                  </template>
                  <i class="fas fa-info-circle" />
                </a-tooltip>
              </div>
            </div>
            <a-form-item>
              <a-input
                v-model:value="control.implementation.technology"
                :disabled="disabled"
                placeholder="Technology in Use"
              />
            </a-form-item>
          </div>
          <div class="col-lg-6">
            <div class="row mb-2">
              <div style="width: 270px;">
                Description of Control Implementation
              </div>
              <div class="help-icon">
                <a-tooltip placement="right">
                  <template #title>
                    <span> describe the solution and how it is implemented </span>
                  </template>
                  <i class="fas fa-info-circle" />
                </a-tooltip>
              </div>
            </div>
            <a-form-item>
              <a-input
                v-model:value="control.implementation.desc"
                :disabled="disabled"
                placeholder="Description of Control Implementation"
              />
            </a-form-item>
          </div>
        </div>
      </div>

      <!-- Assessment -->
      <vb-assesment :audit="audit" :framework="selectedFramework" :disabled="disabled" @save="audit_save" />

      <!-- STIGs -->
      <template v-if="data.checkControl_id && data.checkControl_id != 'null'">
        <div class="col-md-12 col-sm-12 col-xs-12 mb-1 mt-4">
          <div class="card bg-light border-blue mb-3">
            <div class="card-header border-bottom pt-3 pb-3">
              <div class="text-uppercase text-dark font-weight-bold">
                <div class="vb__utils__heading">
                  <strong> STIGs : </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12 mb-3 mt-2 text-center">
          <a-typography-title v-if="SITG_list.length == 0" :level="5"
            >No applicable STIGs available for this control</a-typography-title
          >
          <a-form-item label="STIG List" v-else>
            <a-select
              :disabled="disabled"
              style="width: 100% !important"
              placeholder="Please select"
              option-label-prop="label"
              :options="
                SITG_list.map((STIG) => {
                  return { value: STIG.id, label: STIG.name }
                })
              "
              @change="get_vluns"
            >
            </a-select>
          </a-form-item>

          <template v-if="loading_vluns">
            <a-skeleton active />
          </template>
          <template v-else-if="sitg_vulnerabilities.length">
            <div class="row">
              <div class="col-9" style="margin-top: 35px">
                <a-form-item label="Vulnerabilities list">
                  <a-select
                    v-model:value="vulnerabilities_ids"
                    :disabled="disabled"
                    style="width: 100% !important"
                    placeholder="Please select"
                    option-label-prop="label"
                    mode="multiple"
                    :options="getStigList()"
                  >
                  </a-select>
                </a-form-item>
              </div>
              <div class="col-3">
                <button
                  type="button"
                  :disabled="disabled"
                  style="width: 100%; margin-top: 66px"
                  @click="add_vlun(control)"
                  class="btn btn-outline-info btn-sm pull-right mb-2"
                >
                  <i class="fas fa-plus-square"></i>
                  Add
                </button>
              </div>
            </div>
          </template>
      <div
        v-for="(item1, index1) in control.validation_controls1"
        :key="index1" style="margin-bottom:40px;">
        <a-collapse accordion style="margin-bottom:10px;" :key="index1">
          <a-collapse-panel
              :header="
                item1.stig_ref
              "
              :key="index1"
            >
            <template #extra>
         <a-button
                  type="danger"
                  size="small"
                  class="mr-3 pull-right"
                  :disabled="true" v-if="item1.validation_controls.length>0"><i class="fe fe-trash mr-1" />Remove</a-button>
         <a-button
                  type="danger"
                  size="small"
                  class="mr-3 pull-right"
                  :disabled="false" 
                  @click="remove_stig(item1, index1)"
                  v-if="item1.validation_controls.length==0"><i class="fe fe-trash mr-1" /> Remove</a-button>
                </template>
        <a-collapse
            accordion
            v-for="(item, index) in item1.validation_controls"
            class="w-100 mb-1 text-left"
            :key="index"
           >
            <a-collapse-panel
              :header="
                item.vuln_num +
                ' ' +
                (item.rule_title.length > 70
                  ? item.rule_title.substring(0, 70) + '...'
                  : item.rule_title)
              "
              :key="index"
            >
              <template #extra>
                <i
                  v-if="
                    item.commands == null ||
                    item.commands.done == false ||
                    item.commands.done == null
                  "
                  class="align-text-bottom fa fa-times-circle-o text-danger mx-2 font-size-24"
                /><i
                  v-else
                  class="align-text-bottom fa fa-check-circle-o text-success mx-2 font-size-24"
                />
                <a-button
                  type="danger"
                  size="small"
                  class="mr-3 pull-right"
                  :disabled="disabled"
                  @click="remove_validation_controls(item, index)"
                  ><i class="fe fe-trash mr-1" /> Remove</a-button
                ></template
              >
              {{ item.rule_title }}
              <div class="row">
                <div class="col-8">
                  <a-form-item class="mt-4">
                    <a-checkbox
                      v-model:checked="control.validation_controls[index].is_deviation"
                      :disabled="disabled"
                      >Deviation</a-checkbox
                    >
                  </a-form-item>
                </div>
                <div class="col-4">
                  <a-form-item label="Status">
                    <a-select
                      v-model:value="control.validation_controls[index].compliance_status"
                      :default-value="control.validation_controls[index].compliance_status"
                      :disabled="disabled"
                      placeholder="Status"
                      style="width: 100% !important"
                    >
                      <a-select-option value="AUTOMATED" selected>Automated</a-select-option>
                      <a-select-option value="COMPLIANT">Compliant</a-select-option>
                      <a-select-option value="NON-COMPLIANT">Non-Compliant</a-select-option>
                      <a-select-option value="NOT-APPLICABLE">Not Applicable</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <a-typography-title v-if="Deviation_list.length == 0" :level="5"
                >No applicable deviation available for this control</a-typography-title
              >
              <a-form-item
                label="Deviation List"
                v-else-if="control.validation_controls[index].is_deviation"
              >
                <a-select
                  :disabled="disabled"
                  style="width: 100% !important"
                  v-model:value="control.validation_controls[index].deviation_id"
                  placeholder="Please select"
                  option-label-prop="label"
                  :options="
                    Deviation_list.map((deviation) => {
                      return { value: deviation.id, label: deviation.name }
                    })
                  "
                >
                </a-select>
              </a-form-item>
              <div class="row" v-if="control.validation_controls[index].is_deviation">
                <div class="col-lg-12">
                  <a-form-item label="Deviation Description">
                    <a-textarea
                      placeholder="Deviation Description..."
                      v-model:value="control.validation_controls[index].deviation_description"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Group Title">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].group_title"
                      placeholder="Group Title"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Vulnerability Number">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].vuln_num"
                      placeholder="Vulnerability Number"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Rule ID">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].rule_id"
                      placeholder="Rule ID"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Rule Ver">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].rule_ver"
                      placeholder="Rule Ver"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Severity">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].severity"
                      placeholder="Severity"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Status">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].status"
                      placeholder="Status"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Finding Details">
                    <a-textarea
                      placeholder="Finding Details..."
                      v-model:value="control.validation_controls[index].finding_details"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Comments">
                    <a-textarea
                      placeholder="Comments..."
                      v-model:value="control.validation_controls[index].comments"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Target Key">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].target_key"
                      placeholder="Target Key"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="CCI Ref">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].cci_ref"
                      placeholder="CCI Ref"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Check Content Ref">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].check_content_ref"
                      placeholder="Check Content Ref"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Rule Title">
                    <a-textarea
                      placeholder="Rule Title..."
                      v-model:value="control.validation_controls[index].rule_title"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Vulnerability Discuss">
                    <a-textarea
                      placeholder="Vulnerability Discuss..."
                      v-model:value="control.validation_controls[index].vuln_discuss"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Check Content">
                    <a-textarea
                      placeholder="Check Content..."
                      v-model:value="control.validation_controls[index].check_content"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Fix Text">
                    <a-textarea
                      placeholder="Fix Text..."
                      v-model:value="control.validation_controls[index].fix_text"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      </a-collapse>
      </div>
          <!--<a-collapse
            accordion
            v-for="(item, index) in control.validation_controls"
            class="w-100 mb-1 text-left"
            :key="index"
           >
            <a-collapse-panel
              :header="
                item.vuln_num +
                ' ' +
                (item.rule_title.length > 70
                  ? item.rule_title.substring(0, 70) + '...'
                  : item.rule_title)
              "
              :key="index"
            >
              <template #extra>
                <i
                  v-if="
                    item.commands == null ||
                    item.commands.done == false ||
                    item.commands.done == null
                  "
                  class="align-text-bottom fa fa-times-circle-o text-danger mx-2 font-size-24"
                /><i
                  v-else
                  class="align-text-bottom fa fa-check-circle-o text-success mx-2 font-size-24"
                />
                <a-button
                  type="danger"
                  size="small"
                  class="mr-3 pull-right"
                  :disabled="disabled"
                  @click="remove_validation_controls(item, index)"
                  ><i class="fe fe-trash mr-1" /> Remove</a-button
                ></template
              >
              {{ item.rule_title }}
              <div class="row">
                <div class="col-8">
                  <a-form-item class="mt-4">
                    <a-checkbox
                      v-model:checked="control.validation_controls[index].is_deviation"
                      :disabled="disabled"
                      >Deviation</a-checkbox
                    >
                  </a-form-item>
                </div>
                <div class="col-4">
                  <a-form-item label="Status">
                    <a-select
                      v-model:value="control.validation_controls[index].compliance_status"
                      :default-value="control.validation_controls[index].compliance_status"
                      :disabled="disabled"
                      placeholder="Status"
                      style="width: 100% !important"
                    >
                      <a-select-option value="AUTOMATED" selected>Automated</a-select-option>
                      <a-select-option value="COMPLIANT">Compliant</a-select-option>
                      <a-select-option value="NON-COMPLIANT">Non-Compliant</a-select-option>
                      <a-select-option value="NOT-APPLICABLE">Not Applicable</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
              </div>
              <a-typography-title v-if="Deviation_list.length == 0" :level="5"
                >No applicable deviation available for this control</a-typography-title
              >
              <a-form-item
                label="Deviation List"
                v-else-if="control.validation_controls[index].is_deviation"
              >
                <a-select
                  :disabled="disabled"
                  style="width: 100% !important"
                  v-model:value="control.validation_controls[index].deviation_id"
                  placeholder="Please select"
                  option-label-prop="label"
                  :options="
                    Deviation_list.map((deviation) => {
                      return { value: deviation.id, label: deviation.name }
                    })
                  "
                >
                </a-select>
              </a-form-item>
              <div class="row" v-if="control.validation_controls[index].is_deviation">
                <div class="col-lg-12">
                  <a-form-item label="Deviation Description">
                    <a-textarea
                      placeholder="Deviation Description..."
                      v-model:value="control.validation_controls[index].deviation_description"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Group Title">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].group_title"
                      placeholder="Group Title"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Vulnerability Number">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].vuln_num"
                      placeholder="Vulnerability Number"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Rule ID">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].rule_id"
                      placeholder="Rule ID"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Rule Ver">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].rule_ver"
                      placeholder="Rule Ver"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Severity">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].severity"
                      placeholder="Severity"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Status">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].status"
                      placeholder="Status"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Finding Details">
                    <a-textarea
                      placeholder="Finding Details..."
                      v-model:value="control.validation_controls[index].finding_details"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Comments">
                    <a-textarea
                      placeholder="Comments..."
                      v-model:value="control.validation_controls[index].comments"
                      :rows="5"
                      :disabled="disabled"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <a-form-item label="Target Key">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].target_key"
                      placeholder="Target Key"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="CCI Ref">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].cci_ref"
                      placeholder="CCI Ref"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-4">
                  <a-form-item label="Check Content Ref">
                    <a-input
                      :disabled="true"
                      v-model:value="control.validation_controls[index].check_content_ref"
                      placeholder="Check Content Ref"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Rule Title">
                    <a-textarea
                      placeholder="Rule Title..."
                      v-model:value="control.validation_controls[index].rule_title"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Vulnerability Discuss">
                    <a-textarea
                      placeholder="Vulnerability Discuss..."
                      v-model:value="control.validation_controls[index].vuln_discuss"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Check Content">
                    <a-textarea
                      placeholder="Check Content..."
                      v-model:value="control.validation_controls[index].check_content"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Fix Text">
                    <a-textarea
                      placeholder="Fix Text..."
                      v-model:value="control.validation_controls[index].fix_text"
                      :rows="5"
                      :disabled="true"
                    />
                  </a-form-item>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>-->
        </div>
      </template>

      <!-- POA&Ms -->
      <div class="col-md-12 col-sm-12 col-xs-12 mb-3 mt-4">
        <div class="card bg-light border-blue mb-3">
          <div class="card-header border-bottom pt-3 pb-2">
            <div class="text-uppercase text-dark font-weight-bold">
              <div class="vb__utils__heading">
                <strong> POA&Ms : </strong>
                <button
                  type="button"
                  :disabled="disabled"
                  @click="add"
                  class="btn btn-outline-info btn-sm pull-right mb-2"
                >
                  <i class="fas fa-plus-square"></i>
                  Add new
                </button>
              </div>
            </div>
          </div>
        </div>
        <a-collapse
          accordion
          v-for="(item, index) in control.Poams"
          class="w-100 mb-1"
          :key="index"
        >
          <a-collapse-panel :header="item.idnt" :key="index">
            <template #extra>
              <a-button
                type="danger"
                size="small"
                class="mr-3 pull-right"
                :disabled="disabled"
                @click="remove(index)"
                ><i class="fe fe-trash mr-1" /> Remove</a-button
              ></template
            >
            <div class="row">
              <div class="col-lg-4">
                <a-form-item label="POAM ID">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].idnt"
                    placeholder="POAM ID"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="CSP">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].csp"
                    placeholder="CSP"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="Impact Level">
                  <a-select
                    v-model:value="control.Poams[index].system_impact_level"
                    :default-value="control.Poams[index].system_impact_level"
                    :disabled="disabled"
                    placeholder="Impact Level"
                    style="width: 100% !important"
                  >
                    <a-select-option value="low"> Low </a-select-option>
                    <a-select-option value="moderate"> Moderate </a-select-option>
                    <a-select-option value="high"> High </a-select-option>
                    <a-select-option value="na"> N/A </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-4">
                <a-form-item label="Control Number">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].control"
                    placeholder="Control Number"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="Point of Contact">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].poc"
                    placeholder="Point of Contact"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="POAM Date">
                  <a-date-picker
                    :disabled="disabled"
                    v-model:value="control.Poams[index].created_at"
                    placeholder="POAM Date"
                    class="w-100"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <a-form-item label="Weakness Name">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].weak_name"
                    placeholder="Weakness Name"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="Weakness Detector Source">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].weak_detector"
                    placeholder="Weakness Detector Source"
                  />
                </a-form-item>
              </div>
              <div class="col-lg-4">
                <a-form-item label="Weakness Source Identifier">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].weak_idnt"
                    placeholder="Weakness Source Identifier"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <a-form-item label="Weakness Description">
                  <a-textarea
                    placeholder="Weakness Description..."
                    v-model:value="control.Poams[index].weak_desc"
                    :rows="3"
                    :disabled="disabled"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <a-form-item label="Asset Identifier">
                  <a-input
                    :disabled="disabled"
                    v-model:value="control.Poams[index].asset_identifier"
                    placeholder="Asset Identifier"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <a-form-item label="Resources Required">
                  <a-textarea
                    placeholder="Resources Required..."
                    v-model:value="control.Poams[index].resources_required"
                    :rows="3"
                    :disabled="disabled"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <a-form-item label="Overall Remediation Plan">
                  <a-textarea
                    placeholder="Overall Remediation Plan..."
                    v-model:value="control.Poams[index].remediation_plan"
                    :rows="3"
                    :disabled="disabled"
                  />
                </a-form-item>
              </div>
            </div>
            <a-divider />
            <div class="col-lg-12 row mt-2">
              <div class="col-lg-6">
                <a-typography-title :level="5">Planned Milestones</a-typography-title>
              </div>

              <div class="col-lg-6">
                <button
                  type="button"
                  :disabled="disabled"
                  @click="add_milestones_planned(index)"
                  class="btn btn-outline-info btn-sm pull-right mb-2"
                >
                  <i class="fas fa-plus-square"></i>
                  Add new
                </button>
              </div>

              <template
                v-for="(documents, index_documents) in control.Poams[index].milestones_planned"
                :key="index_documents"
              >
                <div class="row">
                  <div class="col-lg-3" style="margin-top: 30px">
                    <button
                      type="button"
                      :disabled="disabled"
                      @click="add_milestones_planned_change(index, index_documents)"
                      class="btn btn-outline-info btn-sm pull-right mb-2"
                    >
                      <i class="fas fa-plus-square"></i>
                      Add change
                    </button>
                  </div>
                  <div class="col-lg-3">
                    <a-form-item label="Milestone date">
                      <a-date-picker
                        v-model:value="
                          control.Poams[index].milestones_planned[index_documents].date
                        "
                        class="w-100"
                        :default-value="
                          control.Poams[index].milestones_planned[index_documents].date
                        "
                        :disabled="disabled"
                        placeholder="Milestone date"
                      />
                    </a-form-item>
                  </div>
                  <div class="col-lg-3">
                    <a-form-item label="Milestone description">
                      <a-input
                        placeholder="Milestone description..."
                        v-model:value="
                          control.Poams[index].milestones_planned[index_documents].desc
                        "
                        :disabled="disabled"
                      />
                    </a-form-item>
                  </div>
                  <div class="col-lg-3" style="margin-top: 30px">
                    <a-button
                      type="danger"
                      size="small"
                      class="mr-3 pull-right"
                      :disabled="disabled"
                      @click="remove_milestones_planned(index, index_documents)"
                      ><i class="fe fe-trash mr-1" /> Remove
                    </a-button>
                  </div>

                  <div class="col-lg-12">
                    <template
                      v-for="(change, index_change) in control.Poams[index].milestones_planned[
                        index_documents
                      ].changes"
                      :key="index_change"
                    >
                      <div class="col-lg-12 row">
                        <div class="col-lg-3">
                          <a-form-item label="Change date">
                            <a-date-picker
                              v-model:value="
                                control.Poams[index].milestones_planned[index_documents].changes[
                                  index_change
                                ].date
                              "
                              class="w-100"
                              :default-value="
                                control.Poams[index].milestones_planned[index_documents].changes[
                                  index_change
                                ].date
                              "
                              :disabled="disabled"
                              placeholder="Change date"
                            />
                          </a-form-item>
                        </div>
                        <div class="col-lg-3">
                          <a-form-item label="Change date">
                            <a-date-picker
                              v-model:value="
                                control.Poams[index].milestones_planned[index_documents].changes[
                                  index_change
                                ].date
                              "
                              class="w-100"
                              :default-value="
                                control.Poams[index].milestones_planned[index_documents].changes[
                                  index_change
                                ].date
                              "
                              :disabled="disabled"
                              placeholder="Change date"
                            />
                          </a-form-item>
                        </div>
                        <div class="col-lg-3">
                          <a-form-item label="Change description">
                            <a-input
                              placeholder="Change description..."
                              v-model:value="
                                control.Poams[index].milestones_planned[index_documents].changes[
                                  index_change
                                ].desc
                              "
                              :disabled="disabled"
                            />
                          </a-form-item>
                        </div>
                        <div class="col-lg-3" style="margin-top: 30px">
                          <a-button
                            type="danger"
                            size="small"
                            class="mr-3 pull-right"
                            :disabled="disabled"
                            @click="remove_milestones_planned(index, index_change)"
                            ><i class="fe fe-trash mr-1" /> Remove
                          </a-button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>

            <a-divider />
            <div class="row mt-2">
              <div class="col-lg-6">
                <a-typography-title :level="5">Supporting Documents</a-typography-title>
              </div>

              <div class="col-lg-6">
                <button
                  type="button"
                  :disabled="disabled"
                  @click="add_supporting_documents(index)"
                  class="btn btn-outline-info btn-sm pull-right mb-2"
                >
                  <i class="fas fa-plus-square"></i>
                  Add new
                </button>
              </div>

              <template
                v-for="(documents, index_documents) in control.Poams[index].supporting_documents"
                :key="index_documents"
              >
                <div class="col-lg-12 row">
                  <div class="col-lg-5">
                    <a-form-item label="Document name">
                      <a-input
                        placeholder="Document Name..."
                        v-model:value="
                          control.Poams[index].supporting_documents[index_documents].name
                        "
                        :disabled="disabled"
                      />
                    </a-form-item>
                  </div>
                  <div class="col-lg-5">
                    <a-form-item label="Document location">
                      <a-input
                        placeholder="Document location..."
                        v-model:value="
                          control.Poams[index].supporting_documents[index_documents].location
                        "
                        :disabled="disabled"
                      />
                    </a-form-item>
                  </div>
                  <div class="col-lg-2" style="margin-top: 30px">
                    <a-button
                      type="danger"
                      size="small"
                      class="mr-3 pull-right"
                      :disabled="disabled"
                      @click="remove_supporting_documents(index, index_documents)"
                      ><i class="fe fe-trash mr-1" /> Remove</a-button
                    >
                  </div>
                </div>
              </template>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div class="card-footer">
      <button type="submit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button type="button" @click="$router.go(-1)" class="btn btn-light px-5 pull-right">
        Cancel
      </button>
    </div>
  </a-form>
</template>
<script>
import VbAssesment from '@/@vb/widgets/Forms/CheckControl/partial/assesment.vue'

import { toRefs, ref, toRaw, computed, reactive, h } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { notification, Modal } from 'ant-design-vue'
import { WarningOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'

export default {
  components: {
    // Audit
    VbAssesment,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  setup(props, { emit }) {

    let { data } = toRefs(props)
    const store = useStore()
    const router = useRouter()
    const vulnerabilities_ids = ref([])

    const route = useRoute()
    const routeDetails = computed(() => route)
    const loading_vluns = computed(() => store.getters['STIGs/STIGs'].loading_vluns)
    const sitg_vulnerabilities = computed(() => store.getters['STIGs/STIGs'].sitg_vulnerabilities)
    let control_number = computed(() => routeDetails.value.query.control_number)

    if (typeof control_number.value === 'undefined') {
      router.push({
        path: '/system-sections/framework-controls',
      })
    }

    const user_name = computed(() => store.getters['user/user'].display_name)
    let control = computed(() => store.getters['checkControls/checkControls'].control)
    let audit = computed(() => store.getters['audit/audit'].audit)
    let SITG_list = computed(() => store.getters['STIGs/STIGs'].SITG_list)
    let Deviation_list = computed(() => store.getters['deviations/deviations'].Deviation_list)
 
    var audit_data = (audit_data) => {
      if (audit_data.AuditControls && audit_data.AuditControls.length > 0) {
        audit_data.AuditControls[0].new_version = (
          parseInt(audit_data.AuditControls[0].version) + 1.0
        ).toFixed(1)
        audit_data.AuditControls[0].is_draft_id = audit_data.AuditControls[0].id
        return audit_data.AuditControls[0]
      }
      if (audit_data.AuditR5Controls && audit_data.AuditR5Controls.length > 0) {
        audit_data.AuditR5Controls[0].new_version = (
          parseInt(audit_data.AuditR5Controls[0].version) + 1.0
        ).toFixed(1)
        audit_data.AuditR5Controls[0].is_draft_id = audit_data.AuditR5Controls[0].id
        return audit_data.AuditR5Controls[0]
      }
      audit_data.new_version = (1.0).toFixed(1)
      return audit_data
    }

    let history = []

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

    let user_id = computed(() => store.getters['user/user'].id)
    let audit_loading = computed(() => store.getters['audit/audit'].audit_loading)

    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let checkControl_id = data.value.checkControl_id;
       store.dispatch('checkControls/GET_BY_ID', {
      payload: {
        id: data.value.checkControl_id,
        framework: selectedFramework.value,
        control_number: control_number.value,
        framework_id: 1,
      },
    })

    store.dispatch('audit/RESET')

    let buttonLable = computed(() => (data.value.checkControl_id == 'new' ? 'Save' : 'Update'))

    if (data.value.checkControl_id && data.value.checkControl_id != 'null') {
      if (selectedFramework.value == 'NIST80053R4') {
        var parent = computed(() => routeDetails.value.query.control_number)
        store.dispatch('STIGs/GET_SITG_LIST', {
          payload: {
            control_number: routeDetails.value.query.control_number,
          },
        })
        store.dispatch('deviations/GET_DEVIATION_LIST', {
          payload: {
            control_number: routeDetails.value.query.control_number,
          },
        })
      } else if (selectedFramework.value == 'NIST80053R5') {
        var parent = computed(() => routeDetails.value.query.control_number)
        store.dispatch('STIGs/GET_SITG_LIST', {
          payload: {
            control_number: routeDetails.value.query.control_number,
          },
        })
        store.dispatch('deviations/GET_DEVIATION_LIST', {
          payload: {
            control_number: routeDetails.value.query.control_number,
          },
        })
      } else {
        var parent = computed(() => routeDetails.value.query.NIST80053r4_controls)
      }
      checkControl_id = data.value.checkControl_id;
      store.dispatch('audit/GET_ALL', {
        payload: {
          control_id: data.value.checkControl_id,
          user_id: user_id.value,
          parent: parent.value,
          framework: selectedFramework.value,
        },
      })
    }

    const audit_history_data = (audit) => {
      return computed(() => selectedFramework.value == 'NIST80053R5' ? audit.AuditR5Controls : audit.AuditControls)
    }
    const onSubmit = () => {
      toRaw(control).value.system_id = selectedSystem.value
      toRaw(control).value.framework = selectedFramework.value
      toRaw(control).value.framework_id = 1
      toRaw(control).value.control_number = control_number.value
      toRaw(control).value.user_id = user_id.value
      if (!toRaw(control).value.is_new) {
        toRaw(control).value.controlId = toRaw(control).value.id
      }

      store.dispatch('checkControls/ADD', {
        payload: {
          controlData: toRaw(control).value,
          system_id: selectedSystem.value,
          control_number: control_number.value,
          framework: selectedFramework.value,
        },
      })
    }
    const add = () => {
      let id = control.value.Poams.length + 1

      var obj = {
        created_at: null,
        asset_identifier: null,
        auto_approve: null,
        comments: null,
        completed: true,
        completed_by: null,
        completion_date: null,
        control: null,
        control_id: null,
        csp: '',
        detection_date: null,
        deviation_rationale: null,
        false_positive: null,
        milestone_changes: null,
        operational_requirement: null,
        poc: null,
        remediation_plan: null,
        resources_required: null,
        risk_adjustment: null,
        risk_rating_adjust: null,
        risk_rating_org: null,
        status_date: null,
        supporting_documents: [],
        system_impact_level: null,
        vendor_checkin: null,
        vendor_dependency: null,
        vendor_productname: null,
        weak_desc: null,
        weak_detector: null,
        weak_idnt: null,
        idnt: 'POAM-0' + id,
        weak_name: 'NEW POAM-0' + id,
        milestones_planned: [],
        // supporting_documents: [],
      }

      obj.created_at = obj.created_at ? new Date().toISOString(obj.created_at).substr(0, 10) : null
      obj.detection_date = obj.detection_date
        ? new Date().toISOString(obj.detection_date).substr(0, 10)
        : null
      obj.status_date = obj.status_date
        ? new Date().toISOString(obj.status_date).substr(0, 10)
        : null
      obj.completion_date = obj.completion_date
        ? new Date().toISOString(obj.completion_date).substr(0, 10)
        : null

      obj[obj.idnt] = []

      control.value.Poams.push(obj)
    }

    const add_supporting_documents = (index) => {
      var obj = {
        name: '',
        location: '',
      }

      control.value.Poams[index].supporting_documents.push(obj)
    }
    const add_milestones_planned = (index) => {
      var obj = {
        desc: '',
        date: null,
        changes: [],
      }

      control.value.Poams[index].milestones_planned.push(obj)
    }

    const add_milestones_planned_change = (index, index_documents) => {
      var obj = {
        desc: '',
        date: null,
        type: '',
      }

      control.value.Poams[index].milestones_planned[index_documents].changes.push(obj)
    }

    const remove_milestones_planned_change = (index, index_documents) => {
      control.value.Poams[index].milestones_planned[index_documents].changes.splice(
        index_documents,
        1,
      )
    }
    const remove_supporting_documents = (index, index_documents) => {
      control.value.Poams[index].supporting_documents.splice(index_documents, 1)
    }

    const remove_milestones_planned = (index, index_documents) => {
      control.value.Poams[index].milestones_planned.splice(index_documents, 1)
    }
    let validationcontrols =[];
    const add_vlun = (controlObj) => {
      let vulArray = [], vulString = "";
      vulnerabilities_ids.value.forEach((element) => {
        var vulnerability = sitg_vulnerabilities.value.filter(function (array_el) {
          return element == array_el.id
        })

        if (vulnerability.length > 0) {
          if (controlObj.remediate == true && (controlObj.compliance_status == null || controlObj.compliance_status == 'Automated')) {
            // let vulObj=controlObj.validation_controls.rows.find(v => v.vuln_num == vulnerability[0].vuln_num);
            if (vulnerability[0].potential_impact != "" && vulnerability[0].potential_impact != null) {
              vulArray.push(vulnerability[0].vuln_num);
            }
          }
        }
      })
      if (vulArray.length > 0) {
        vulString = vulArray.join(', ');
      }
      if (vulString != "") {
        Modal.confirm({
          title: 'Warning',
          icon: createVNode(WarningOutlined),
          content: createVNode('div', { style: 'color:black;' },"Making changes to this control may disable access or cause other irreversible modifications. Are you sure you want to continue?"),
          okText: 'Continue',
          // okType: 'danger',
          okButtonProps: { style: { color: 'black', backgroundColor: 'white !important', borderColor:'#A9A9A9 !important'  } },
          cancelButtonProps:{ style: { color: 'black', borderColor:'#78a3ff' } },
          cancelText: 'Cancel',
          onOk() {
            
            // console.log('Ok: ', vulnerabilities_ids.value.length);
            vulnerabilities_ids.value.forEach((element) => {
              var vulnerability = sitg_vulnerabilities.value.filter(function (array_el) {
                return element == array_el.id
              })
              // console.log("Control: ", controlObj.remediate, controlObj.compliance_status, vulnerability[0]);

              if (vulnerability.length > 0) {
                if (!control.value.validation_controls) control.value['validation_controls'] = []

                control.value.validation_controls.push(vulnerability[0])
                control.value.validation_controls1 = [];

                var validation_controls = control.value.validation_controls;
                var validation_controls2 = control.value.validation_controls;

                const temp = validation_controls.reduce((acc, { stig_ref, stig_id }) => {
                  acc[stig_ref] = acc[stig_ref] || { stig_ref, stig_id };
                  return acc;
                }, {});

                const results = Object.values(temp).map(({ stig_ref, stig_id }) => ({ stig_ref, stig_id: stig_id, validation_controls: [] }));
                results.forEach((v) => {
                  validation_controls2.forEach((v1) => {
                    if (v.stig_ref == v1.stig_ref) {
                      v.validation_controls.push(v1)
                    }
                  })
                })
                control.value.validation_controls1 = results;
              }
            })

            vulnerabilities_ids.value = []
          },
          onCancel() {
          },
        })

      } else {
        vulnerabilities_ids.value.forEach((element) => {
          var vulnerability = sitg_vulnerabilities.value.filter(function (array_el) {
            return element == array_el.id
          })
          
          if (vulnerability.length > 0) {
            if (!control.value.validation_controls) control.value['validation_controls'] = []
            /*var validationcontrols = control.value.validation_controls1;            
                var Vulnerability =[];
            for(let i=0; i<control.value.validation_controls1.length; i++){
              if(control.value.validation_controls1[i].stig_ref == vulnerability[0].stig_ref){
               control.value.validation_controls1[i].validation_controls.push(vulnerability[0])
               break;
              }
          control.value.validation_controls.push(vulnerability[0])
            }*/
            control.value.validation_controls.push(vulnerability[0])
            control.value.validation_controls1=[];

            var validation_controls = control.value.validation_controls;
            var validation_controls2 = control.value.validation_controls;

            const temp = validation_controls.reduce((acc, { stig_ref, stig_id }) => {
            acc[stig_ref] = acc[stig_ref] || { stig_ref, stig_id };
            return acc;
         }, {});
             
            const results = Object.values(temp).map(({ stig_ref, stig_id }) => ({ stig_ref, stig_id: stig_id, validation_controls: [] }));
         results.forEach((v) => {
          validation_controls2.forEach((v1) => {
           if(v.stig_ref == v1.stig_ref){
            v.validation_controls.push(v1)
           }
          })
         })
          control.value.validation_controls1 = results;
          }
        })

      vulnerabilities_ids.value = []
      }
    }

    const remove = (index) => {
      control.value.Poams.splice(index, 1)
    }

    const remove_validation_controls = (item, index) => {
      for(let i=0; i<control.value.validation_controls1.length; i++){
        if(control.value.validation_controls1[i].stig_ref == item.stig_ref){
         for(let j=0; j<control.value.validation_controls1[i].validation_controls.length; j++){
          if(control.value.validation_controls1[i].validation_controls[j].vuln_num == item.vuln_num){
            control.value.validation_controls1[i].validation_controls.splice(j, 1);
          }
         }
        }
      }
      for(let k=0; k<control.value.validation_controls.length; k++){
        if(control.value.validation_controls[k].stig_ref == item.stig_ref && control.value.validation_controls[k].vuln_num == item.vuln_num){
          control.value.validation_controls.splice(k, 1)
        }
      }
     // control.value.validation_controls.splice(index, 1)
    }
    const remove_stig = (item, index) =>{
     control.value.validation_controls1.splice(index, 1)
    }

    const handleCancel = () => {
      this.previewVisible = false
    }

    const onExecute = () => {
      store
        .dispatch('STIGs/EXECUTE_COMMAND', {
          payload: {
            ip: toRaw(control).value.validation_ip,
            cmd: toRaw(control).value.validation_cmd,
          },
        })
        .then(() => {
          toRaw(control).value.validation_result = computed(
            () => store.getters['STIGs/STIGs'].commandExecuteResult,
          )
          notification.success({
            message: 'Execute command',
            description: 'Command successfully executed!',
          })
        })
    }

    const get_vluns = (e) => {
      var stiginfo = SITG_list.value.filter(function (array_el) {
        return e == array_el.id
      })
      console.log("e: ", e);
      var OSAlreadyExist = false;
      if (stiginfo[0].stigref != null) {
        
        for (let i = 0; i < control.value.validation_controls1.length; i++) {

          // console.log("control.validation_controls1: ", control.value.validation_controls1[i].stig_id);
          if ((control.value.validation_controls1[i].stig_ref == stiginfo[0].stigref) && (control.value.validation_controls1[i].stig_id != stiginfo[0].id) ) {
            OSAlreadyExist = true
          }
        }
        // console.log("OSAlreadyExist: ", OSAlreadyExist);
      }
      if(OSAlreadyExist){
        // this.sitg_vulnerabilities = [];
        Modal.confirm({
          title: 'Warning',
          icon: h(WarningOutlined),
          content: h('div', { style: 'color:black;' },"There is already a control in place from another STIG: "+stiginfo[0].stigref+". Please remove the existing controls from this STIG before adding controls from another version of this STIG."),
          okText: 'Ok',
          okButtonProps: { style: { color: 'black', backgroundColor: 'white !important'  } },
          cancelButtonProps:{ style: { display:'none' } },
          // cancelText: 'Cancel',
          onOk() {
            store.dispatch('STIGs/GET_SITG_VULN1', {})
          },
          onCancel() {
          },
        })
      }else {
        store.dispatch('STIGs/GET_SITG_VULN', {
          payload: {
            control_number: routeDetails.value.query.control_number,
            stig_id: e,
            system_id: selectedSystem.value,
            framework: selectedFramework.value,
          },
        })
      }
    }

    const audit_save = (data) => {
      let reviewerData = data.reviewerData
      let policiesData = data.audit_data
      let rawData=[];
      policiesData.data.potentialAssessments.forEach((element) => {
        let elementLength=Object.keys(element).length;
        let obj =element
        if(elementLength>2){
          var result = obj[Object.keys(obj)[0]];
          obj.title=result
        }
        rawData.push(obj);
      })
      policiesData.data.potentialAssessments = rawData;
      // 
      // console.log('policiesData', policiesData.data);
      let is_draft = data.is_draft
      let user_id = computed(() => store.getters['user/user'].id)
      console.log("selectedFramework.value: ", selectedFramework.value);
      store
        .dispatch('audit/ADD_CONTROL', {
          payload: {
            id: policiesData.is_draft_id ? policiesData.is_draft_id : '',
            audit_owner: policiesData.user_id ? policiesData.user_id : '',
            is_draft: is_draft,
            control_number: policiesData.parent || policiesData.control_number,
            data: policiesData.data,
            user_id: user_id.value,
            user_name: reviewerData.value.user_name,
            version:
              policiesData.new_version && !is_draft
                ? policiesData.new_version
                : is_draft
                ? null
                : 1.0,
            date: reviewerData.value.date,
            status: policiesData.data.compliant_status,
            override_status: false ? policiesData.data.compliant_status : '',
            override_reason: false ? policiesData.data.description : '',
            check_control_id: toRaw(control).value.id,
            framework: selectedFramework.value,
          },
        })
        .then(() => {
          setTimeout(() => {
            store.dispatch('audit/GET_ALL', {
              payload: {
                control_id: checkControl_id,
                user_id: user_id.value,
                parent: parent.value,
                framework: selectedFramework.value,
              },
            })
          }, 1000)
        })
    }

    return {
      remove_milestones_planned_change,
      add_milestones_planned_change,
      add_milestones_planned,
      remove_milestones_planned,
      add_supporting_documents,
      remove_supporting_documents,
      audit_loading,
      audit_save,
      vulnerabilities_ids,
      add_vlun,
      get_vluns,
      sitg_vulnerabilities,
      loading_vluns,
      remove_validation_controls,
      remove_stig,
      handleCancel,
      onSubmit,
      onExecute,
      remove,
      add,
      control,
      audit,
      SITG_list,
      Deviation_list,
      audit_data,
      audit_history_data,
      audit_history_columns,
      buttonLable, 
      selectedFramework
    }
  },
  methods: {
    getStigList() {
      return this.sitg_vulnerabilities
        .filter((array_el) => {
          return this.control.validation_controls
            ? this.control.validation_controls.filter(function (anotherOne_el) {
              if(anotherOne_el.stig_id==undefined){
                anotherOne_el.stig_id = "";
              }
              return anotherOne_el.vuln_num == array_el.vuln_num && anotherOne_el.stig_id == array_el.stig_id
              //return anotherOne_el.vuln_num == array_el.vuln_num
              }).length == 0
            : []
          })
        .map((vulnerability) => {
          return {
            value: vulnerability.id,
            label: vulnerability.vuln_num + ' ' + vulnerability.rule_title,
          }
        })
        },
  },
}
</script>

<style>
.ant-collapse-content {
  overflow: unset !important;
}

.ant-table-placeholder {
  min-height: 100px !important;
}
.help-icon {
  width: 45px;
}
[data-vb-theme="default"] .ant-input[disabled] {
    color: #595c97;
}
</style>
