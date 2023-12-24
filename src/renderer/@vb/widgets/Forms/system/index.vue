<template>
  <a-form :rules="rules" :model="system" label-align="left" layout="vertical" @finish="onSubmit">
    <div class="row">
      <div class="col-lg-4">
        <a-form-item required label="Name" name="name">
          <a-input v-model:value="system.name" :disabled="disabled" placeholder="System name" />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item required label="Abbreviation" name="abbreviation">
          <a-input
            v-model:value="system.abbreviation"
            :disabled="disabled"
            placeholder="System abbreviation"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item required label="Identifier" name="identifier">
          <a-input
            v-model:value="system.identifier"
            :disabled="disabled"
            placeholder="System identifier"
          />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <a-form-item required label="Description">
          <a-textarea
            placeholder="Description..."
            :disabled="disabled"
            v-model:value="system.description"
            :rows="4"
          />
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <a-form-item class="col-lg-4 mt-2">
          <a-switch
            :disabled="disabled"
            :checked="system.status"
            default-checked
            @change="onChange"
          />
          Active
        </a-form-item>
        <a-form-item required label="System frameworks">
          <a-select
            mode="multiple"
            :disabled="disabled"
            v-model:value="system.Frameworks"
            :default-value="system.Frameworks"
            :loading="loading"
            @change="setFrameworks"
            style="width: 100% !important"
          >
            <a-select-option value="NIST80053R4" key="NIST80053R4">
              NIST 800-53 r4
            </a-select-option><a-select-option value="NIST80053R5" key="NIST80053R5">
              NIST 800-53 r5
            </a-select-option>
            <a-select-option value="NIST800171R2" key="NIST800171R2">
              NIST 800-171 r2
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </div>
  </a-form>

  <SystemCategorization
    :disabled="disabled"
    :data="{ system_id: data.system_id }"
    :system="system"
  />

  <div class="card-footer mt-4">
    <button
      type="submit"
      @click="onSubmit"
      :disabled="disabled"
      class="btn btn-primary px-5 ml-2 pull-right"
    >
      {{ buttonLable }}
    </button>
    <button @click="$router.push('/systems')" class="btn btn-light px-5 pull-right">Cancel</button>
  </div>
</template>
<script>
import { toRefs, ref, toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import SystemCategorization from '@/@vb/components/Ssp/SystemCategorization'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  components: {
    SystemCategorization
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
    const previewVisible = false
    const previewImage = ''
    const store = useStore()
    //let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    let selectedFramework = computed(() => store.getters['user/selectedFramework'])
    const system_credentials = computed(() => store.getters['systems/systems'].system_credentials)
    const rules = {}
    let System = computed(() => store.getters['systems/systems'].system)
    const organization_id = computed(() => store.getters['organization/organization'].id)
    const user_id = computed(() => store.getters['user/user'].id)
    store.dispatch('ssp/GET_SSP', {
      payload: {
        system_id: data.value.system_id,
        framework: selectedFramework.value,
      },
    })
    var ssp = computed(() => store.getters['ssp/ssp'].ssp)
    //  if (data.value.system_id != 'new') {
    //   debugger

    //  }else{
    //    var ssp = computed(() => store.getters['ssp/ssp'].defaultSSP)
    //   store.commit('ssp/SET_STATE', { ssp:toRaw(ssp)})

    //  }
    const system = computed(() => {
      if (!System.value.Frameworks) return System.value

      System.value.Frameworks.map(function (framework, index) {
        if (typeof framework === 'object') {
          System.value.Frameworks[index] = framework.identifier
        }
      })

      return System.value
    })

    store.dispatch('systems/GET_BY_ID', { payload: { id: data.value.system_id } })
    const user_systems = []
    const roles = []
    let buttonLable = computed(() => (data.value.system_id == 'new' ? 'Save' : 'Update'))

    const onSubmit = () => {
      // console.log('submit!', toRaw(System))

      toRaw(System).value.organization_id = organization_id
      toRaw(System).value.user_id = user_id
      toRaw(ssp).value.system_id = toRaw(System).value.id
      toRaw(System).value.licenseName= "Trial Edition"
      if (data.value.system_id != 'new') {
        store.dispatch('systems/UPDATE', {
          payload: {
            ...toRaw(System).value,
            ssp: toRaw(ssp).value,
          },
        })
      } else {
        store.dispatch('systems/ADD', {
          payload: {
            ...toRaw(System).value,
            ssp: toRaw(ssp).value
          },
        })
      }
    }

    const handleCancel = () => {
      this.previewVisible = false
    }
    const onChange = (checked) => {
      system.value.status = checked
    }
    const setCredential = (credential_id) => {
      system.value.credential_id = credential_id
    }
    const setFrameworks = (value) => {
      // console.log(value)
    }

    return {
      handleCancel,
      onSubmit,
      onChange,
      setCredential,
      setFrameworks,
      system_credentials,
      previewImage,
      previewVisible,
      system,
      roles,
      rules,
      buttonLable,
      user_systems,
    }
  },
}
</script>
