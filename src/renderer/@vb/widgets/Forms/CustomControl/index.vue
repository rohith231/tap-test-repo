<template>
  <a-form :model="control" label-align="left" layout="vertical" @finish="onSubmit">
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
        <a-form-item label="Inherited from">
          <a-select
            v-model:value="control.inherited_from"
            :default-value="control.inherited_from"
            :disabled="disabled || control.inheritable"
            placeholder="Inherited from"
            style="width: 100% !important"
          >
          </a-select>
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item required label="Control name">
          <a-input :disabled="disabled" v-model:value="control.name" placeholder="Control name" />
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item required label="Control id">
          <a-input :disabled="disabled" v-model:value="control.idnt" placeholder="Control id" />
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item required label="Operating System">
          <a-select
            v-model:value="control.os"
            :default-value="control.os"
            :disabled="disabled"
            placeholder="Operating System"
            style="width: 100% !important"
          >
            <a-select-option value="Mac">Mac</a-select-option>
            <a-select-option value="Windows">Windows</a-select-option>
            <a-select-option value="Linux">Linux</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-6">
        <a-form-item label="Sensitivity level">
          <a-select
            v-model:value="control.sensitivity_level"
            :default-value="control.sensitivity_level"
            :disabled="disabled"
            placeholder="Sensitivity level"
            style="width: 100% !important"
          >
            <a-select-option v-for="item in senLevels" :key="item.senValue" :value="item.senValue">
              {{ item.senText }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <div class="col-lg-3">
        <a-form-item label="Plugin family">
          <a-input
            :disabled="disabled"
            v-model:value="control.plugin_family"
            placeholder="Plugin family"
          />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Plugin id">
          <a-input :disabled="disabled" v-model:value="control.plugin_id" placeholder="Plugin id" />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Plugin name">
          <a-input
            :disabled="disabled"
            v-model:value="control.plugin_name"
            placeholder="Plugin name"
          />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Plugin description">
          <a-input
            :disabled="disabled"
            v-model:value="control.plugin_description"
            placeholder="Plugin description"
          />
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

      <!-- Validation Controls -->
      <!-- <div class="col-md-12 col-sm-12 col-xs-12 mb-3 mt-4">
        <div class="card  bg-light border-blue mb-3">
          <div class="card-header border-bottom pt-3 pb-2">
            <div class="text-uppercase text-dark font-weight-bold">
                <div class="vb__utils__heading">
                   <strong>
                    Validation Controls :
                    </strong>
                    <button  type="button" :disabled="disabled" @click="add_validation_controls" class="btn btn-outline-info btn-sm pull-right mb-2" >
                        <i class="fas fa-plus-square"></i>
                    Add new
                    </button>
                </div>
          </div>
          </div>
        </div>
        <a-collapse  accordion v-for="(item, index) in control.validation_controls" class="w-100 mb-1" :key="index">
          <a-collapse-panel :header="control.validation_controls[index].vuln_num" :key="index">
            <template #extra>    <a-button type="danger"  size="small" class="mr-3  pull-right"  :disabled="disabled" @click="remove_validation_controls(index)"  ><i class="fe fe-trash mr-1" /> Remove</a-button></template>

    <div class="row">

       <div class="col-lg-4">
        <a-form-item   label="Vulnerability Number" >
          <a-input v-model:value="control.validation_controls[index].vuln_num" :disabled="disabled" placeholder="Vulnerability Number" />
        </a-form-item>
      </div>

      <div class="col-lg-4">

         <a-form-item label="OS">
                    <a-select v-model:value="control.validation_controls[index].imp_os" :default-value="control.validation_controls[index].imp_os" :disabled="disabled" placeholder="OS"
                      style="width: 100% !important">
                        <a-select-option value="Mac">Mac</a-select-option>
                        <a-select-option value="Windows">Windows</a-select-option>
                        <a-select-option value="Linux">Linux</a-select-option>
                    </a-select>
             </a-form-item>
      </div>

      <div class="col-lg-4">
          <a-form-item   label="Command Type" >
             <a-select v-model:value="control.validation_controls[index].imp_cmd_type" :default-value="control.validation_controls[index].imp_cmd_type" :disabled="disabled" placeholder="Command Type"
                style="width: 100% !important">
                  <a-select-option value="Registry">Registry</a-select-option>
                  <a-select-option value="Powershell">Powershell</a-select-option>
                  <a-select-option value="CMD">CMD</a-select-option>
                  <a-select-option value="WMIC">WMIC</a-select-option>
                  <a-select-option value="WinRM">WinRM</a-select-option>
              </a-select>
        </a-form-item>
      </div>



      <div class="col-lg-12">
              <a-form-item label="Validation Command">
                  <a-textarea placeholder="Validation Command..." :disabled="disabled"  v-model:value="control.validation_controls[index].validation_cmd" :rows="4" />
              </a-form-item>
      </div>
            <div class="col-lg-12">
              <a-form-item label="Validation Expected Result">
                  <a-textarea placeholder="Validation Expected Result..." :disabled="disabled"  v-model:value="control.validation_controls[index].validation_expected" :rows="4" />
              </a-form-item>
      </div>
            <div class="col-lg-12">
              <a-form-item label="Validation Result">
                  <a-textarea placeholder="Validation Result..." :disabled="disabled"  v-model:value="control.validation_controls[index].validation_result" :rows="4" />
              </a-form-item>
      </div>

 <div class="col-lg-7">
        <a-form-item   label="IP address" >
          <a-input v-model:value="control.validation_controls[index].validation_ip" :disabled="disabled" placeholder="IP address" />
        </a-form-item>
      </div>
         <div class="col-lg-5">
            <a-form-item   >
         <button type="button" @click="onExecute('validation',control.validation_controls[index])" :disabled="disabled" class="btn btn-primary pull-right" style="margin-top: 30px;">
                Test Validation Script
          </button>
           </a-form-item>
      </div>
                  <div class="col-lg-12">
              <a-form-item label="Remediation Command">
                  <a-textarea placeholder="Remediation Command..." :disabled="disabled"  v-model:value="control.validation_controls[index].remediation_cmd" :rows="4" />
              </a-form-item>
      </div>
            <div class="col-lg-12">
              <a-form-item label="Remediation Expected Result">
                  <a-textarea placeholder="Remediation Expected Result..." :disabled="disabled"  v-model:value="control.validation_controls[index].remediation_expected" :rows="4" />
              </a-form-item>
      </div>
            <div class="col-lg-12">
              <a-form-item label="Remediation Result">
                  <a-textarea placeholder="Remediation Result..." :disabled="disabled"  v-model:value="control.validation_controls[index].remediation_result" :rows="4" />
              </a-form-item>
      </div>

        <div class="col-lg-7">
        <a-form-item   label="IP address" >
          <a-input v-model:value="control.validation_controls[index].remediation_ip" :disabled="disabled" placeholder="IP address" />
        </a-form-item>
      </div>
         <div class="col-lg-5">
         <button  type="button"  @click="onExecute('remediation',control.validation_controls[index])" :disabled="disabled" class="btn btn-primary pull-right" style="margin-top: 30px;">
                Test Remediation Script
          </button>
      </div>


    </div>

          </a-collapse-panel>
        </a-collapse>
      </div> -->

      <!-- STIGs -->
      <div class="col-md-12 col-sm-12 col-xs-12 mb-1 mt-4">
        <div class="card bg-light border-blue mb-3">
          <div class="card-header border-bottom pt-3 pb-3">
            <div class="text-uppercase text-dark font-weight-bold">
              <div class="vb__utils__heading">
                <strong>STIGs: </strong>
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
                @click="add_vlun"
                class="btn btn-outline-info btn-sm pull-right mb-2"
              >
                <i class="fas fa-plus-square"></i>
                Add
              </button>
            </div>
          </div>
        </template>

        <a-collapse
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
                  item.commands == null || item.commands.done == false || item.commands.done == null
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
                @click="remove_validation_controls(index)"
                ><i class="fe fe-trash mr-1" /> Remove</a-button
              ></template
            >

            {{ item.rule_title }}
            <a-form-item>
              <a-checkbox
                v-model:checked="control.validation_controls[index].is_deviation"
                :disabled="disabled"
                >Deviation</a-checkbox
              >
            </a-form-item>

            <!-- Deviation -->
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
                    :disabled="true"
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
                    :disabled="true"
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
      </div>

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
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div class="card-footer">
      <button type="submit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button
        type="button"
        @click="$router.push({ path: '/system-sections/Systems' })"
        class="btn btn-light px-5 pull-right"
      >
        Cancel
      </button>
    </div>
  </a-form>
</template>
<script>
import { ref, toRaw, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    // Audit
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
    const store = useStore()
    const router = useRouter()

    const route = useRoute()
    const routeDetails = computed(() => route)
    const vulnerabilities_ids = ref([])

    const user_name = computed(() => store.getters['user/user'].display_name)
    let control = computed(() => store.getters['checkControls/checkControls'].control)
    let SITG_list = computed(() => store.getters['STIGs/STIGs'].SITG_list)
    let audit = computed(() => store.getters['audit/audit'].audit)
    let user_id = computed(() => store.getters['user/user'].id)
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    const sitg_vulnerabilities = computed(() => store.getters['STIGs/STIGs'].sitg_vulnerabilities)
    let Deviation_list = computed(() => store.getters['deviations/deviations'].Deviation_list)
    const loading_vluns = computed(() => store.getters['STIGs/STIGs'].loading_vluns)

    store.dispatch('checkControls/GET_BY_ID', {
      payload: {
        id: props.data.customControl_id,
        framework: selectedFramework.value,
        framework_id: -1,
      },
    })

    let buttonLable = computed(() => (props.data.customControl_id == 'new' ? 'Save' : 'Update'))

    if (props.data.customControl_id && props.data.customControl_id != 'null') {
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

      store.dispatch('audit/GET_ALL', {
        payload: {
          control_id: props.data.checkControl_id,
          user_id: user_id.value,
          parent: parent.value,
        },
      })
    }

    const onExecute = (commandType = 'remediation', item) => {
      if (commandType == 'remediation') {
        store
          .dispatch('STIGs/EXECUTE_COMMAND', {
            payload: {
              ip: item.remediation_ip,
              cmd: item.remediation_cmd,
              vuln_num: item.vuln_num,
            },
          })
          .then(() => {
            item.remediation_result = computed(
              () => store.getters['STIGs/STIGs'].commandExecuteResult,
            )

            notification.success({
              message: 'Execute command',
              description: 'Command successfully executed!',
            })
          })
      } else {
        store
          .dispatch('STIGs/EXECUTE_COMMAND', {
            payload: {
              ip: item.validation_ip,
              cmd: item.validation_cmd,
              vuln_num: item.vuln_num,
            },
          })
          .then(() => {
            item.validation_result = computed(
              () => store.getters['STIGs/STIGs'].commandExecuteResult,
            )
            notification.success({
              message: 'Execute command',
              description: 'Command successfully executed!',
            })
          })
      }
    }

    const onSubmit = () => {
      toRaw(control).value.system_id = selectedSystem.value
      toRaw(control).value.framework = selectedFramework.value
      toRaw(control).value.framework_id = -1
      toRaw(control).value.user_id = user_id.value
      if (!toRaw(control).value.is_new) {
        toRaw(control).value.controlId = toRaw(control).value.id
      }

      store.dispatch('checkControls/ADD', {
        payload: {
          controlData: toRaw(control).value,
          system_id: selectedSystem.value,
          framework: selectedFramework.value,
          type: 'custom'
        },
      })
    }

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
    ]
    const add = () => {
      if (typeof control.value.Poams == 'undefined') {
        control.value.Poams = []
      }

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

    const remove = (index) => {
      control.value.Poams.splice(index, 1)
    }

    const remove_validation_controls = (index) => {
      control.value.validation_controls.splice(index, 1)
    }
    const add_validation_controls = (index) => {
      if (!control.value.validation_controls) control.value.validation_controls = []
      let id = control.value.validation_controls.length + 1

      control.value.validation_controls.push({
        vuln_num: 'custom-' + id,
        isStig: false,
        imp_override_stig_setting: true,
        imp_validation_custom: true,
        imp_remediation_custom: true,
        validation_cmd: '',
        validation_expected: '',
        validation_result: '',
        validation_ip: '',

        remediation_cmd: '',
        remediation_expected: '',
        remediation_result: '',
        remediation_ip: '',
      })
    }

    const handleCancel = () => {
      this.previewVisible = false
    }

    const getStigList = () => {
      return sitg_vulnerabilities.value
        .filter((array_el) => {
          return control.value.validation_controls
            ? control.value.validation_controls.filter(function (anotherOne_el) {
                return anotherOne_el.vuln_num == array_el.vuln_num
              }).length == 0
            : []
        })
        .map((vulnerability) => {
          return {
            value: vulnerability.id,
            label: vulnerability.vuln_num + ' ' + vulnerability.rule_title,
          }
        })
    }

    const get_vluns = (e) => {
      store.dispatch('STIGs/GET_SITG_VULN', {
        payload: {
          control_number: routeDetails.value.query.control_number,
          stig_id: e,
          system_id: selectedSystem.value,
          framework: selectedFramework.value,
          type: 'custom',
        },
      })
    }

    const add_vlun = (e) => {
      vulnerabilities_ids.value.forEach((element) => {
        var vulnerability = sitg_vulnerabilities.value.filter(function (array_el) {
          return element == array_el.id
        })
        if (vulnerability.length > 0) {
          if (!control.value.validation_controls) control.value['validation_controls'] = []

          control.value.validation_controls.push(vulnerability[0])
        }
      })

      vulnerabilities_ids.value = []
    }

    return {
      add_validation_controls,
      remove_validation_controls,
      handleCancel,
      onSubmit,
      onExecute,
      remove,
      add,
      control,
      senLevels,
      buttonLable,
      SITG_list,
      sitg_vulnerabilities,
      vulnerabilities_ids,
      Deviation_list,
      get_vluns,
      loading_vluns,
      getStigList,
      add_vlun,
    }
  },
}
</script>


<style >
.ant-collapse-content {
  overflow: unset !important;
}

.ant-table-placeholder {
  min-height: 100px;
}
.help-icon {
  width: 45px;
}
</style>
