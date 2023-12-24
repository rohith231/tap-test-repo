<template>
  <div class="card-header-flex align-items-center">
    <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
      <h5 class="mb-0">
        <div class="vb__utils__heading">
          <strong>
            {{ data.title }}
          </strong>
        </div>
      </h5>
    </div>

    <div>
      <span>
        <a-input
          class="mr-4 mt-1"
          placeholder="Search..."
          v-model:value="value"
          style="width: 200px"
          :loading="loading"
        >
          <template #suffix>
            <a-tooltip title="Search">
              <i class="fe fe-search" />
            </a-tooltip>
          </template>
        </a-input>
      </span>
    </div>

    <button
      type="button"
      class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
      style="margin-top: 10px"
      @click="showModal"
    >
      <span class="btn-addon">
        <i class="btn-addon-icon fas fa-plus" />
      </span>
      Add New
    </button>
    <a-tabs
      @tabClick="callBackTabs"
      :default-active-key="1"
      class="vb-tabs-bold"
      style="margin-bottom: -10px; margin-left: 10px"
    >
      <a-tab-pane key="STIGs" v-if="data.title == 'STIGs'">
        <template #tab>
          <span>
            <i class="fas fa-file-signature"></i>
            STIGs
          </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="deviations" v-else>
        <template #tab>
          <span>
            <i class="fas fa-swatchbook"></i>
            Deviations
          </span>
        </template>
      </a-tab-pane>
      <a-tab-pane key="Vulnerabilities">
        <template #tab>
          <span>
            <i class="fas fa-shield-alt"></i>
            Vulnerabilities
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>

  <!-- model -->

  <a-modal v-model:visible="visible" :title="data.title == 'STIGs' ? 'New STIG' : 'New Deviation'">
    <template #footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" :loading="btnloading" @click="handleOk">
        Save
      </a-button>
    </template>
    <a-form ref="ruleForm" layout="vertical">
      <a-form-item style="row-gap: 0px; float: right; margin-bottom: -15px; margin-top: -12px">
        <a-checkbox v-model:checked="overrideImportStigs">Override</a-checkbox>
      </a-form-item>
      <a-form-item label="Upload file" class="w-100">
        <a-upload-dragger
          accept=".xlsx"
          name="file"
          action="http://localhost:3331/api/v1/stigs/upload-file"
          @change="handleChange"
          :preview-file="previewFile"
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
      </a-form-item>
      <!-- <a-row>
        <a-col>
          <a-form-item label="STIG Operating System" class="w-100">
            <a-select
              v-model="selectedOs"
              :default-value="selectedOs"
              :loading="loading"
              style="min-width: 100%"
            >
              <a-select-option :value="os" v-for="(os, i) in osOptions" :key="i">
                {{ os }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row> -->
    </a-form>
  </a-modal>
</template>

<script>
import { InboxOutlined } from '@ant-design/icons-vue'

import { ref, watch } from 'vue'
export default {
  components: {
    InboxOutlined,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: '',
        }
      },
    },
  },
  emits: ['data-type', 'search'],
  setup(props, { emit }) {
    const value = ref('')
    const callBackTabs = (type) => {
      emit('data-type', type)
    }

    watch(value, (searchValue) => emit('search', searchValue))

    return {
      value,
      callBackTabs,
    }
  },
  data() {
    return {
      import_file_path: '',
      overrideImportStigs: false,
      // selectedOs: 'Windows',
      // osOptions: ['Windows', 'Linux'],
      btnloading: false,
      visible: false,
    }
  },
  methods: {
    handleChange(info) {
      this.import_file_path = ''
      if (info.file.status !== 'uploading') {
        if (info.fileList.length > 0) {
          this.import_file_path = info.file.originFileObj.path
        }
        // console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        // console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },

    getDataAfter() {
      //  this.$store.dispatch('ip/GET_ALL',{ payload: { system_id:this.$store.getters['user/selectedOs']}})
    },
    showModal(data = null) {
      this.visible = true
    },
    handleOk(e) {
      // console.log(this.overrideImportStigs)
      // console.log(this.import_file_path)
      if (!this.import_file_path) {
        this.$message.error('Please select file')
        return
      }
      if (this.data.title == 'STIGs') {
        this.$store
          .dispatch('STIGs/IMPORT', {
            payload: {
              isOverride: this.overrideImportStigs,
              path: this.import_file_path,
              // os: this.selectedOs,
            },
          })
          .then(() => {
            setTimeout(() => {
              this.import_file_path = ''
              this.overrideImportStigs = false
              // this.selectedOs = 'Windows'
              this.visible = false
              this.btnloading = false
            }, 3000)
          })
      } else {
        this.$store
          .dispatch('deviations/IMPORT', {
            payload: {
              isOverride: this.overrideImportStigs,
              path: this.import_file_path,
            },
          })
          .then(() => {
            setTimeout(() => {
              this.import_file_path = ''
              this.overrideImportStigs = false
              this.visible = false
              this.btnloading = false
            }, 3000)
          })
      }
    },
    previewFile(file) {
      // console.log('Your upload file:', file)
    },
    handleCancel(e) {
      this.visible = false
    },
  },
}
</script>
