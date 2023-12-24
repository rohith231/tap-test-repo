<template>
  <a-spin :spinning="SSPLoading" size="large" :delay="500" tip="System Security Plan...">
    <div v-if="showSSP">
      <div class="row">
        <div class="col-lg-12">
          <div class="card-placeholder">
            <div class="card-body">
              <vb-app-partials-github-head />
            </div>
          </div>
        </div>
      </div>
      <div class="row ssp-main-row-container">
        <template v-if="SSPLoading">
          <div class="col-lg-9 col-md-12">
            <a-skeleton active v-for="i in 25" :key="(i + 9).toString(36) + i" />
          </div>
        </template>
        <div :class="(visible)?'col-lg-9 col-md-12 ssp-form-column-container':'col-md-12 ssp-form-column-container'" id="ssp-form-column-container" v-else>
          <a class="float" v-show="!visible" @click="() => (visible = !visible)"><i class="fas fa-chevron-left my-float" /></a>
          <a class="float" v-show="visible" @click="() => (visible = !visible)"><i class="fas fa-chevron-right my-float" /></a>

          <div class="card-placeholder">
            <div>
              <a-form :model="ssp" label-align="left" layout="vertical">
                <!-- PREPARED BY -->
                <div className="d-flex align-items-start" :ref="setItemRef" id="prepared-by">
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Prepared By</h3>
                    </div>
                    <div className="card-body">
                      <p>Identification of organization that prepared this document</p>
                      <br />
                      <div class="row">
                        <div class="col-lg-12">
                          <a-form-item label="Organization Name">
                            <a-input
                              v-model:value="ssp.prepared_by.org_name"
                              placeholder="Organization Name"
                            />
                          </a-form-item>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12">
                          <a-form-item label="Street Address">
                            <a-input
                              v-model:value="ssp.prepared_by.address_a"
                              placeholder="Street Address"
                            />
                          </a-form-item>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12">
                          <a-form-item label="Suite/Room/Building">
                            <a-input
                              v-model:value="ssp.prepared_by.address_b"
                              placeholder="Suite/Room/Building"
                            />
                          </a-form-item>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <a-form-item label="City">
                            <a-input v-model:value="ssp.prepared_by.city" placeholder="City" />
                          </a-form-item>
                        </div>
                        <div class="col-lg-4">
                          <a-form-item label="State">
                            <a-input v-model:value="ssp.prepared_by.state" placeholder="State" />
                          </a-form-item>
                        </div>
                        <div class="col-lg-4">
                          <a-form-item label="Zip">
                            <a-input v-model:value="ssp.prepared_by.zip" placeholder="Zip" />
                          </a-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- PREPARED FOR -->
                <div className="d-flex align-items-start" :ref="setItemRef" id="prepared-for">
                  <div className="card  card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Prepared For</h3>
                    </div>
                    <div className="card-body">
                      <p>Identification of service provider</p>
                      <br />
                      <a-form :model="ssp" label-align="left" layout="vertical">
                        <div class="row">
                          <div class="col-lg-12">
                            <a-form-item label="Organization Name">
                              <a-input
                                v-model:value="ssp.prepared_for.org_name"
                                placeholder="Organization Name"
                              />
                            </a-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12">
                            <a-form-item label="Street Address">
                              <a-input
                                v-model:value="ssp.prepared_for.address_a"
                                placeholder="Street Address"
                              />
                            </a-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-12">
                            <a-form-item label="Suite/Room/Building">
                              <a-input
                                v-model:value="ssp.prepared_for.address_b"
                                placeholder="Suite/Room/Building"
                              />
                            </a-form-item>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-4">
                            <a-form-item label="City">
                              <a-input v-model:value="ssp.prepared_for.city" placeholder="City" />
                            </a-form-item>
                          </div>
                          <div class="col-lg-4">
                            <a-form-item label="State">
                              <a-input v-model:value="ssp.prepared_for.state" placeholder="State" />
                            </a-form-item>
                          </div>
                          <div class="col-lg-4">
                            <a-form-item label="Zip">
                              <a-input v-model:value="ssp.prepared_for.zip" placeholder="Zip" />
                            </a-form-item>
                          </div>
                        </div>
                      </a-form>
                    </div>
                  </div>
                </div>

                <!-- INFORMATION SYSTEM NAME/TITLE -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="information-system-name-title"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Information System Name/Title</h3>
                    </div>
                    <div className="card-body">
                      <p>
                        This system security plan provides an overview of the security requirements
                        for <strong>({{ systemName }})</strong> and describes the controls in place
                        or planned for implementation to provide a level of security appropriate for
                        the information to be transmitted, processed or stored by the system.
                        information security is vital to our critical infrastructure and its
                        effective performance and protection is a key component of our national
                        security program. Proper management of information technology systems is
                        essential to ensure the confidentiality, integrity and availability of the
                        data transmitted, processed or stored by the
                        <strong>({{ systemName }})</strong> information system. The security
                        safeguards implemented for the <strong>({{ systemName }})</strong> system
                        meet the policy and control requirements set forth in this system security
                        plan. All systems are subject to monitoring consistent with applicable laws,
                        regulations, agency policies, procedures and practices.
                      </p>
                      <br />
                      <div class="row">
                        <div class="col-lg-4">
                          <a-form-item label="Application Number">
                            <a-input placeholder="Application Number" />
                          </a-form-item>
                        </div>
                        <div class="col-lg-4">
                          <a-form-item label="System Name">
                            <a-input placeholder="System Name" />
                          </a-form-item>
                        </div>
                        <div class="col-lg-4">
                          <a-form-item label="System Abbreviation">
                            <a-input placeholder="System Abbreviation" />
                          </a-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- INFORMATION SYSTEM CATEGORIZATION -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="information-system-categorization"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Information System Categorization</h3>
                    </div>
                    <div className="card-body">
                      <SystemCategorization
                        :data="{ system_id: selectedSystem }"
                        :system="system"
                        :system-name="systemName"
                      />

                      <!-- DIGITAL FINGER PRINT -->
                      <!-- <DigitalDetermination /> -->
                      <!-- System Operation -->
                      <!-- <SystemOpertaion :system-name="systemName" /> -->
                    </div>
                  </div>
                </div>

                <!-- INFORMATION SYATEM OWNER -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="information-system-owner"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Information System Owner</h3>
                      </div>
                      <div className="card-body">
                        <InformationSystemOwner/>
                      </div>
                    </div>
                </div>
                
                <!-- Other Designated Contacts -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="other-designated-contacts"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Designated Contacts</h3>
                      </div>
                      <div className="card-body">
                        <DigitalDetermination />
                      </div>
                    </div>
                </div>
                
                <!-- Assignment of security responsibility -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="assignment-of-security-responsibility"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Assignment of Security Responsibility</h3>
                      </div>
                      <div className="card-body">
                        <AssignmentOfSecurity/>
                      </div>
                    </div>
                </div>
                
                <!-- Information system operational status -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="information-system-operational-status"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Information System Operational Status</h3>
                      </div>
                      <div className="card-body">
                        
                        <SystemOpertaion :system-name="systemName" />
                      </div>
                    </div>
                </div>
                
                <!-- Information system type -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="information-system-type"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Information System Type</h3>
                      </div>
                      <div className="card-body">
                        <InformationSystemType/>
                      </div>
                    </div>
                </div>
                
                <!-- Leveraged authorizations -->
                <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="leveraged-authorizations"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Leveraged Authorizations</h3>
                      </div>
                      <div className="card-body">
                        <LeveragedAuthorization/>
                      </div>
                    </div>
                </div>

                <!-- NETWORK ARCHITECTURE -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="network-architecture"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Network Architecture</h3>
                    </div>
                    <div className="card-body">
                      <blockquote class="blockquote">
                        <p class="mb-0">
                          <strong>Instruction :</strong>
                          Insert a network architectural diagram in the space that follows. Ensure
                          that the following items are labeled on the diagram: hostnames, Domain
                          Name System (DNS) servers, DHCP servers, authentication and access control
                          servers, directory servers, firewalls, routers, switches, database
                          servers, major applications, storage, Internet connectivity providers,
                          telecom circuit numbers, network interfaces and numbers, VLANs. Major
                          security components should be represented. If necessary, include multiple
                          network diagrams..
                        </p>
                      </blockquote>
                      <p>
                        Assessors should be able to easily map hardware, software and network
                        inventories back to this diagram. The logical network topology is shown in
                        Figure 9 2 Network Diagram mapping the data flow between components. The
                        following Figure 9 2 network diagram(s) provides a visual depiction of the
                        system network components that constitute Enter information system
                        abbreviation.
                      </p>

                      <br />
                      <a-upload-dragger
                        name="file"
                        :file-list="general_description_files_fileList"
                        action="http://localhost:3331/api/v1/stigs/upload-file"
                        @change="general_description_files_handleChange"
                      >
                        <p class="ant-upload-drag-icon">
                          <inbox-outlined></inbox-outlined>
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload</p>
                        <!-- <p class="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or
                            other band files
                          </p> -->
                      </a-upload-dragger>
                      <a-table
                        :columns="general_description_files_columns"
                        :data-source="ssp.general_description_files"
                        class="mt-3"
                        :pagination="false"
                      >
                        <template #action="{ record }">
                          <span>
                            <a
                              :href="record.file"
                              target="_blank"
                              class="btn btn-sm btn-light m-1"
                              style="width: 95px"
                            >
                              <small>
                                <i class="fas fa-file-download"></i>
                              </small>
                              Download
                            </a>
                            <a-popconfirm
                              title="Are you sure to remove this row?"
                              @confirm="confirmDelete(record, 'general_description_files')"
                              ok-text="Yes"
                              cancel-text="No"
                            >
                              <a
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
                          </span>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>

                <!-- System Environment And Inventory -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="system-environment-and-inventory"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>System Environment and Inventory</h3>
                    </div>
                    <div className="card-body">
                      <p>
                        Directions for attaching the FedRAMP inventory workbook may be found in the
                        following section: ATTACHMENT 13 – fedRAMP inventory workbook.
                      </p>
                      <blockquote class="blockquote">
                        <p class="mb-0">
                          <strong>Instruction :</strong>
                          In the space that follows, provide a general description of the technical
                          system environment. Include information about all system environments that
                          are used, e.g., production environment, test environment, staging or QA
                          environments. Include the specific location of the alternate, backup and
                          operational facilities. In your description, also include a reference to
                          Attachment 13, the system’s integrated inventory workbook, which should
                          provide a complete listing of the system’s components (operating
                          systems/infrastructure, web applications/software, and databases). The
                          integrated inventory workbook should be maintained and updated monthly by
                          the CSP, as part of continuous monitoring efforts. Instructions for
                          completing the integrated inventory workbook are provided within the
                          integrated inventory workbook.
                        </p>
                      </blockquote>

                      <devices />

                      <br />
                    </div>
                  </div>
                </div>

                 <!-- Compliances -->
                  <div
                    className="d-flex align-items-start"
                    :ref="setItemRef"
                    id="compliances"
                  >
                    <div className="card card-top card-top-primary card-skip flex-grow-1">
                      <div className="card-header border-bottom">
                        <h3>Compliance Overview</h3>
                      </div>
                      <div className="card-body">
                        <p>
                          Includes Target Compliance Status and Controls Compliance Status.
                        </p>
                        <compliance />
                        <br />
                      </div>
                    </div>
                  </div>

                <!-- Data Flow -->
                <div className="d-flex align-items-start" :ref="setItemRef" id="data-flow">
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Data Flow</h3>
                    </div>
                    <div className="card-body">
                      <blockquote class="blockquote">
                        <p class="mb-0">
                          <strong>Instruction :</strong>
                          Instruction: In the space that follows, describe the flow of data in and
                          out of system boundaries and insert a data flow diagram. Describe
                          protections implemented at all entry and exit points in the data flow as
                          well as internal controls between customer and project users. Include data
                          flows for privileged and non-privileged authentication/authorization to
                          the system for internal and external users. If necessary, include multiple
                          data flow diagrams.
                        </p>
                      </blockquote>
                      <p>
                        The data flow in and out of the system boundaries is represented in Figure
                        10 1 Data Flow Diagram below.
                      </p>

                      <br />
                      <a-upload-dragger
                        name="file"
                        :file-list="data_form_files_fileList"
                        action="http://localhost:3331/api/v1/stigs/upload-file"
                        @change="data_form_files_handleChange"
                      >
                        <p class="ant-upload-drag-icon">
                          <inbox-outlined></inbox-outlined>
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload</p>
                        <!-- <p class="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or
                            other band files
                          </p> -->
                      </a-upload-dragger>
                      <a-table
                        :columns="data_form_files_columns"
                        :data-source="ssp.data_form_files"
                        class="mt-3"
                        :pagination="false"
                      >
                        <template #action="{ record }">
                          <span>
                            <a
                              :href="record.file"
                              target="_blank"
                              class="btn btn-sm btn-light m-1"
                              style="width: 95px"
                            >
                              <small>
                                <i class="fas fa-file-download"></i>
                              </small>
                              Download
                            </a>
                            <a-popconfirm
                              title="Are you sure delete this?"
                              @confirm="confirmDelete(record, 'data_form_files')"
                              ok-text="Yes"
                              cancel-text="No"
                            >
                              <a
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
                          </span>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>

                <!-- Ports, Protocols and Services -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="ports-protocols-and-services"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Ports, Protocols and Services</h3>
                    </div>
                    <div className="card-body">
                      <p>
                        Table 10 1 ports, protocols and Services below lists the ports, protocols
                        and services enabled in this information system.
                      </p>
                      <blockquote class="blockquote">
                        <p class="mb-0">
                          <strong>Instruction :</strong>
                          Instruction: In the column labeled “Used By” please indicate the
                          components of the information system that make use of the ports, protocols
                          and services. In the column labeled “Purpose” indicate the purpose for the
                          service (e.g., system logging, HTTP redirector, load balancing). This
                          table should be consistent with CM-6 and CM-7. You must fill out this
                          table, even if you are leveraging a pre-existing FedRAMP authorization.
                          Add more rows as needed.
                        </p>
                      </blockquote>

                      <br />

                      <a-col :span="24" class="mt-3">
                        <button
                          @click="ports_protocols_services_addItem"
                          type="button"
                          class="btn btn-sm btn-primary px-5 ml-2 pull-right mb-2"
                        >
                          Add
                        </button>
                      </a-col>
                      <br />

                      <a-table
                        :columns="ports_protocols_services_columns"
                        :data-source="ssp.ports_protocols_services"
                        :pagination="false"
                      >
                        <template #port="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.port" placeholder="Port" />
                          </a-form-item>
                        </template>

                        <template #protocol="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.protocol" placeholder="Protocol" />
                          </a-form-item>
                        </template>

                        <template #service="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.service" placeholder="service" />
                          </a-form-item>
                        </template>

                        <template #purpose="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.purpose" placeholder="purpose" />
                          </a-form-item>
                        </template>
                        <template #used_by="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.used_by" placeholder="Used by" />
                          </a-form-item>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>

                <!-- Applicable Standards and Guidance -->
                <div
                  className="d-flex align-items-start"
                  :ref="setItemRef"
                  id="applicable-standards-and-guidance"
                >
                  <div className="card card-top card-top-primary card-skip flex-grow-1">
                    <div className="card-header border-bottom">
                      <h3>Applicable Standards and Guidance</h3>
                    </div>
                    <div className="card-body">
                      <p>
                        The FedRAMP standards and guidance be found on this web page:
                        <a>https://www.fedramp.gov/templates/</a>
                        table 12 2 information system Name Standards and Guidance includes in this
                        section any additional standards and guidance specific to information system
                        Name.
                      </p>
                      <blockquote class="blockquote">
                        <p class="mb-0">
                          <strong>Instruction :</strong>
                          The information system name is a repeatable field that is populated when
                          the title page is completed. If the CSP does not have additional standards
                          or guidance that it must follow, please specify "N/A" in the table.
                        </p>
                      </blockquote>

                      <a-col :span="24" class="mt-3">
                        <button
                          @click="standards_guidance_addItem"
                          type="button"
                          class="btn btn-sm btn-primary px-5 ml-2 pull-right mb-2"
                        >
                          Add
                        </button>
                      </a-col>
                      <br />

                      <a-table
                        :columns="standards_guidance_columns"
                        :data-source="ssp.standards_guidance"
                        :pagination="false"
                      >
                        <template #number="{ record }">
                          <a-form-item>
                            <a-input
                              v-model:value="record.number"
                              placeholder="Identification Number"
                            />
                          </a-form-item>
                        </template>

                        <template #date="{ record }">
                          <a-form-item>
                            <a-date-picker
                              v-model:value="record.date"
                              class="w-100"
                              :default-value="record.date"
                              placeholder="Date"
                            />
                          </a-form-item>
                        </template>
                        <template #link="{ record }">
                          <a-form-item>
                            <a-input v-model:value="record.link" placeholder="Link" />
                          </a-form-item>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>

                <!-- Framework controls -->
                <div :ref="setItemRef" id="framework-controls">
                  <FrameworkControls />
                </div>

                <!-- Assessment controls -->
                <!-- <div :ref="setItemRef" id="assessment">
                  <Assessment />
                </div> -->
                <!-- Custom Controls -->
                <div :ref="setItemRef" id="custom-controls">
                  <CustomControls />
                </div>

                
              </a-form>
              <a-form :model="ssp" label-align="left">
                <div class="d-flex">
                  <a-affix :offset-bottom="top" class="align-self-end w-100">
                    <div
                      class="card-body"
                      style="
                        background: #fff;
                        border-radius: 6px;
                        border: 1px solid #ccc;
                        text-align: right;
                      "
                    >
                      <div class="row">
                        <div class="col-lg-6" style="padding-left: 33px; padding-top: 10px">
                          <a-form-item
                            required
                            label="Version Number"
                            style="row-gap: 0px; margin-bottom: 0"
                          >
                            <a-input v-model:value="ssp.version" placeholder="Version Number" />
                          </a-form-item>
                        </div>
                        <div class="col-lg-6">
                          <a-button class="m-2" @click="$router.push({ path: '/system-sections/dashboard' })"
                            >cancel
                          </a-button>
                          <a-button class="m-2" type="primary" @click="onSubmit">Save</a-button>
                        </div>
                      </div>
                    </div>
                  </a-affix>
                </div>
              </a-form>
            </div>
          </div>
        </div>
        <div
v-show="visible" class="col-lg-3 col-md-12"
          style="position: sticky !important; top: 75px !important; height: 100% !important"
        >
          <div class="card-placeholder">
            <div class="card-body">
              <vb-widgets-lists-25 />
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import SystemCategorization from '@/@vb/components/Ssp/SystemCategorization'
import DigitalDetermination from '@/@vb/components/Ssp/DigitalDetermination'
import SystemOpertaion from '@/@vb/components/Ssp/SystemOperationStatus'
import InformationSystemOwner from '@/@vb/components/Ssp/InformationSystem'
import InformationSystemType from '@/@vb/components/Ssp/InformationSystemType'
import AssignmentOfSecurity from '@/@vb/components/Ssp/AssignmentOfSecurity'
import LeveragedAuthorization from '@/@vb/components/Ssp/LeveragedAuthorization'

import VbAppPartialsGithubHead from '@/@vb/widgets/AppPartials/GithubHead'
import VbWidgetsLists25 from '@/@vb/widgets/WidgetsLists/25'
import FrameworkControls from '@/views/system-sections/FrameworkControls'
// import Assessment from '@/views/system-sections/Assessment'
import devices from '@/views/system-sections/Devices'
import compliance from '@/views/system-sections/Compliance'
import CustomControls from '@/views/system-sections/CustomControls'
import { InboxOutlined } from '@ant-design/icons-vue'

import { ref, computed, toRaw, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'VbGithubDiscuss',
  components: {
    InformationSystemType,
    AssignmentOfSecurity,
    InformationSystemOwner,
    LeveragedAuthorization,
    DigitalDetermination,
    SystemOpertaion,
    InboxOutlined,
    VbAppPartialsGithubHead,
    VbWidgetsLists25,
    SystemCategorization,
    FrameworkControls,
    // Assessment,
    devices,
    compliance,
    CustomControls,
  },
  setup() {
    const root = ref([])
    const showSSP = ref(true)
    const itemRefs = []
    const disabled = ref(false)
    const setItemRef = (el) => {
      if (el) {
        itemRefs.push(el)
      }
    }
    const store = useStore()
    const SSPLoading = computed(() => store.getters['ssp/SSPLoading'])
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    const user_systems = computed(() => store.getters['user/Systems'])
    let systemName = computed(
      () =>
        user_systems.value.filter((user_system) => user_system.id == selectedSystem.value)[0]
          .abbreviation,
    )

    const getData = () => {
      store.dispatch('ssp/GET_SSP', {
        payload: {
          system_id: selectedSystem.value,
          framework: selectedFramework.value,
        },
      })
    }
    const ssp = computed(() => store.getters['ssp/ssp'].ssp)

    const confirmDelete = (record, type) => {
      if (type == 'general_description_files') {
        ssp.value.general_description_files = ssp.value.general_description_files.filter(
          (data) => data.text != record.text,
        )
      } else if (type == 'data_form_files') {
        ssp.value.data_form_files = ssp.value.data_form_files.filter(
          (data) => data.text != record.text,
        )
      }
    }
    getData()
    const onSubmit = () => {
      toRaw(ssp).value.system_id = selectedSystem.value
      store
        .dispatch('ssp/CREATE_OR_UPDATE', {
          payload: {
            ...toRaw(ssp).value,
          },
        })
        .then(() => {})
    }
    watch(selectedSystem, (selectedSystem) => {
      getData()
      showSSP.value = false
      showSSP.value = true
    })
    watch(selectedFramework, (selectedFramework) => {
      getData()
      showSSP.value = false
      showSSP.value = true
    })
    // div#Prepared By.d-flex.align-items-start

    var general_description_files_columns = [
      {
        title: 'Name',
        dataIndex: 'text',
        key: 'name',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        key: 'action',
      },
    ]
    var data_form_files_columns = [
      {
        title: 'Name',
        dataIndex: 'text',
        key: 'name',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        key: 'action',
      },
    ]

    var ports_protocols_services_columns = [
      {
        title: 'Port',
        dataIndex: 'port',
        slots: {
          customRender: 'port',
        },
        key: 'port',
      },
      {
        title: 'Protocol',
        dataIndex: 'protocol',
        slots: {
          customRender: 'protocol',
        },
        key: 'protocl',
      },
      {
        title: 'Service',
        dataIndex: 'service',
        slots: {
          customRender: 'service',
        },
        key: 'service',
      },
      {
        title: 'Purpose',
        dataIndex: 'purpose',
        slots: {
          customRender: 'purpose',
        },
        key: 'purpose',
      },
      {
        title: 'Used by',
        dataIndex: 'used_by',
        key: 'used_by',
        slots: {
          customRender: 'used_by',
        },
      },
    ]
    var standards_guidance_columns = [
      {
        title: 'Identification Number',
        dataIndex: 'number',
        slots: {
          customRender: 'number',
        },
        key: 'number',
      },
      //    {
      //   title: 'Title',
      //   dataIndex: 'title',
      //   slots: {
      //     customRender: 'title'
      //   },

      // },
      {
        title: 'Date',
        dataIndex: 'date',
        slots: {
          customRender: 'date',
        },
        key: 'date',
      },
      {
        title: 'Link',
        dataIndex: 'link',
        slots: {
          customRender: 'link',
        },
        key: 'link',
      },
    ]
    const data_form_files_fileList = ref([])
    const general_description_files_fileList = ref([])

    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }
    const general_description_files_handleChange = (info) => {
      if (info.fileList.length > 0) {
        getBase64(info.file.originFileObj).then((data) => {
          let extenision = info.file.originFileObj.path.split('.').pop()
          let type = ''
          if (extenision == 'png' || extenision == 'jpg' || extenision == 'jpeg') {
            type = 'image'
          } else {
            type = 'file'
          }

          ssp.value.general_description_files.push({
            text: info.file.originFileObj.name,
            file: data,
            type: type,
            srcType: extenision,
          })
        })

        data_form_files_fileList.value = []
        // }
      }
      // console.log(info.file, info.fileList)

      // console.log(info.file, info.fileList)
      if (info.file.status === 'done') {
        // console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
    const data_form_files_handleChange = (info) => {
      if (info.fileList.length > 0) {
        getBase64(info.file.originFileObj).then((data) => {
          let extenision = info.file.originFileObj.path.split('.').pop()
          let type = ''
          if (extenision == 'png' || extenision == 'jpg' || extenision == 'jpeg') {
            type = 'image'
          } else {
            type = 'file'
          }

          ssp.value.data_form_files.push({
            text: info.file.originFileObj.name,
            file: data,
            type: type,
            srcType: extenision,
          })
        })

        data_form_files_fileList.value = []
        // }
      }
      // console.log(info.file, info.fileList)

      // console.log(info.file, info.fileList)
      if (info.file.status === 'done') {
        // console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }

    const standards_guidance_addItem = () => {
      ssp.value.standards_guidance.push({
        number: '',
        title: '',
        date: '',
        link: '',
      })
    }
    const ports_protocols_services_addItem = () => {
      ssp.value.ports_protocols_services.push({
        id: Math.random(),
        protocol: '',
        service: '',
        purpose: '',
        used_by: '',
      })
    }

    return {
      ports_protocols_services_addItem,
      standards_guidance_addItem,
      standards_guidance_columns,
      ports_protocols_services_columns,
      general_description_files_fileList,
      data_form_files_handleChange,
      general_description_files_handleChange,
      confirmDelete,
      data_form_files_columns,
      data_form_files_fileList,
      general_description_files_columns,
      selectedSystem,
      system: {},
      root,
      showSSP,
      SSPLoading,
      disabled,
      onSubmit,
      ssp,
      systemName,
      setItemRef,
    }
  },
  data: function () {
    return {
      hash: this.$route.hash,
      top: 10,
      visible: true,
    }
  },
  mounted() {
    this.$nextTick(function () {
      if (this.hash) {
        const refName = this.hash.replace('#', '')
        // console.log(refName)
        setTimeout(() => this.scrollFix(this.$route.hash), 1)
      }
    })
  },
  methods: {
    scrollFix: function (hashbang) {
      console.log('hashbang : ', hashbang);
      const targetDiv = hashbang.toLowerCase()
                                            .split(' ').join('-')
                                            .split('/').join('-')
                                            .split('(').join('-')
                                            .split(')').join('-')
                                            .split(',').join('');
      console.log('targetDiv : ', targetDiv);
      var scrollContainer = document.getElementById("ssp-form-column-container");
      var scrollToElement = document.getElementById(targetDiv);

      if (scrollContainer && scrollToElement) {
        var containerRect = scrollContainer.getBoundingClientRect();
        var elementRect = scrollToElement.getBoundingClientRect();

        var scrollPosition = elementRect.top - containerRect.top + scrollContainer.scrollTop;

        // Scroll to the desired position
        scrollContainer.scrollTop = scrollPosition;
      }
    },
  },
}
</script>
<style>
#components-affix-demo-target.scrollable-container {
  height: 100px;
  overflow-y: scroll;
}
.card-header-flex.align-items-center {
  padding: 10px !important;
}

.float{
	width: 32px;
  height: 32px;
  border-radius: 50%;
  /* box-shadow: 2px 2px 3px #999; */
  position: fixed;
  top: 165px;
  right: 30px;
  text-align: center;
  background-color: #c8c4db;
  z-index: 10;
}
.my-float{
	margin-top:10px;
}
.ant-tree li .ant-tree-node-content-wrapper{
  height: auto !important;
  width:93%;
}
/* .ssp-main-row-container {
  position: relative;
}

.ssp-form-column-container {
  position: fixed;
  max-width: 65%;
  height: 75vh;
  overflow-y: scroll;
}

.ssp-tree-column-container {
  position: fixed;
  height: 75vh;
  overflow: scroll;
  right: 0;
  overflow-y: scroll;
  overflow-x: clip;
}

.span.ant-tree-title span a.router-link-active {
    color: white !important;
} */
</style>
