<template>
<!--<div class="col-lg-4">
        <a-form-item label="Operating system">
          <a-select
            v-model:value="Device.os_type"
            placeholder="Operating System"
            style="width: 100% !important"
            :disabled="disabled"
            :value="Device.os_type"
            @change="changeType"
          >
            <a-select-option value="Mac">Mac</a-select-option>
            <a-select-option value="Windows">Windows</a-select-option>
            <a-select-option value="Linux">Linux</a-select-option>
          </a-select>
        </a-form-item>
      </div>-->      
  <template v-if="Type === 'Windows'">
    <div class="row">
    <div class="col-lg-4">
        <a-form-item label="Operating System">
          <a-select
            v-model:value="Device.os_type"
            placeholder="Operating System"
            style="width: 100% !important"
            :disabled="disabled"
            :value="Device.os_type"
            @change="changeType"
          >
            <a-select-option value="Mac">Mac</a-select-option>
            <a-select-option value="Windows">Windows</a-select-option>
            <a-select-option value="Linux">Linux</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Host Name" name="host_name">
          <a-input v-model:value="Device.host_name" :disabled="disabled" placeholder="Host Name" />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Mac Address" name="mac_address">
          <a-input
            v-model:value="Device.os_info.MacAddress"
            :disabled="disabled"
            placeholder="Mac Address"
          />
        </a-form-item>
      </div>
      </div>
      <div class="row">
      <div class="col-lg-4">
        <a-form-item label="Bios Name" name="bios">
          <a-input
            v-model:value="Device.os_info.BiosName"
            :disabled="disabled"
            placeholder="Bios Name"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="CS Name" name="cs_name">
          <a-input
            v-model:value="Device.os_info.CsName"
            :disabled="disabled"
            placeholder="CS Name"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="OS Build Number" name="os_build">
          <a-input
            v-model:value="Device.os_info.OsBuildNumber"
            :disabled="disabled"
            placeholder="OS Build Number"
          />
        </a-form-item>
      </div>
      </div>
      <div class="row">
      <div class="col-lg-4">
        <a-form-item label="OS Version" name="os_version">
          <a-input
            v-model:value="Device.os_info.OsVersion"
            :disabled="disabled"
            placeholder="OS Version"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="OS Product Type" name="os_product_type">
          <a-input
            v-model:value="Device.os_info.OsProductType"
            :disabled="disabled"
            placeholder="OS Product Type"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Device Model" name="device_model">
          <a-input
            v-model:value="Device.device_model"
            :disabled="disabled"
            placeholder="Device Model"
          />
        </a-form-item>
      </div>
    </div>
  </template>
  <template v-else-if="Type === 'Mac'">
    <div class="row">
      <div class="col-lg-3">
        <a-form-item label="Operating System">
          <a-select
            v-model:value="Device.os_type"
            placeholder="Operating System"
            style="width: 100% !important"
            :disabled="disabled"
            :value="Device.os_type"
            @change="changeType"
          >
            <a-select-option value="Mac">Mac</a-select-option>
            <a-select-option value="Windows">Windows</a-select-option>
            <a-select-option value="Linux">Linux</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="System Version" name="system_version">
          <a-input
            v-model:value="Device.os_info['System Version']"
            :disabled="disabled"
            placeholder="System Version"
          />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Kernel Version" name="system_version">
          <a-input
            v-model:value="Device.os_info['Kernel Version']"
            :disabled="disabled"
            placeholder="Kernel Version"
          />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Os Architecture" name="os_architecture">
          <a-input
            v-model:value="Device.os_info['Os Architecture']"
            :disabled="disabled"
            placeholder="Os architecture"
          />
        </a-form-item>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="row">
    <div class="col-lg-4">
        <a-form-item label="Operating System">
          <a-select
            v-model:value="Device.os_type"
            placeholder="Operating System"
            style="width: 100% !important"
            :disabled="disabled"
            :value="Device.os_type"
            @change="changeType"
          >
            <a-select-option value="Mac">Mac</a-select-option>
            <a-select-option value="Windows">Windows</a-select-option>
            <a-select-option value="Linux">Linux</a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="ID" name="id">
          <a-input
            v-model:value="Device.os_info['ID']"
            :disabled="disabled"
            placeholder="ID"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Name" name="name">
          <a-input
            v-model:value="Device.os_info['NAME']"
            :disabled="disabled"
            placeholder="Name"
          />
        </a-form-item>
      </div>
      </div>
    <div class="row">
      <div class="col-lg-4">
        <a-form-item label="ID Like" name="id_like">
          <a-input
            v-model:value="Device.os_info['ID_LIKE']"
            :disabled="disabled"
            placeholder="ID Like"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Version" name="version">
          <a-input
            v-model:value="Device.os_info['VERSION']"
            :disabled="disabled"
            placeholder="Version"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="CPE Name" name="cpe_name">
          <a-input
            v-model:value="Device.os_info['CPE_NAME']"
            :disabled="disabled"
            placeholder="CPE Name"
          />
        </a-form-item>
      </div>
      </div>
    <div class="row">
      <div class="col-lg-4">
        <a-form-item label="ANSI Color" name="ansi_color">
          <a-input
            v-model:value="Device.os_info['ANSI_COLOR']"
            :disabled="disabled"
            placeholder="ANSI Color"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Version ID" name="version_id">
          <a-input
            v-model:value="Device.os_info['VERSION_ID']"
            :disabled="disabled"
            placeholder="Version ID"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item label="Pretty Name" name="pretty_name">
          <a-input
            v-model:value="Device.os_info['PRETTY_NAME']"
            :disabled="disabled"
            placeholder="Pretty Name"
          />
        </a-form-item>
      </div>
    </div>
  </template>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'DeviceDetailOs',
  props: {
    device: {
      type: Object,
      default: () => {
        return {}
      },
    },
    model: {
      type: String,
      default: () => {
        return null
      },
    },
    label: {
      type: String,
      default: () => {
        return null
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  setup(props) {
    const store = useStore()
    let Device = computed(() => props.device)
    let Type = computed(() => store.getters['device/device'].os_type)

    if (!Device.value.hasOwnProperty('os_info') || Device.value['os_info'] == null) {
      Device.value['os_info'] = {}; 
    }
    const changeType = (ostype) => {
      store.dispatch('device/SET_TYPE', { payload: ostype })
    }
    return {
      Device,
      Type,
      changeType
    }
  },
}
</script>
