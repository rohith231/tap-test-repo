<template>
  <span v-if="License.showaddlicense">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" label-align="left">
      <div class="row">
        <div class="col-12">
          <a-form-item label="license Key">
            <a-textarea :rows="3" v-model:value="license.licensekey" placeholder="license Key..." ></a-textarea>
          </a-form-item>
        </div>
      </div>
    </a-form>
    <div class="card-footer"> 
      <button
        type="submit"
        @click="onSubmit"
        :class="{ disabled: loading }"
        class="btn btn-primary px-5 pull-right"
      >
        Submit
      </button>
      <button
        type="submit" v-if="License.license_name!='Trial Edition'"
        @click="onCancel"
        :class="{ disabled: loading }"
        class="btn btn-danger px-5 pull-right" style="margin-right:10px"
      >
        Cancel
      </button>
    </div>
  </span>
  <div style="height:150px" v-if="!License.showaddlicense">
    <!-- <div class="row mb-4">
       <div><b>License Name: </b><span>{{License.license_name}}</span></div>
    </div> -->
    <div class="row mb-4">
       <div><b>Expiry Date : </b><span>{{License.expiry_date}}</span></div>
    </div>
    <div class="row mb-4">
       <div><b>Devices Limit: </b><span>{{License.max_devices}}</span></div>
    </div>
    <div class="row mb-4">
       <div><b>Systems Limit: </b><span>{{License.max_info_system}}</span>
       <button
        type="submit"
        @click="onUpgrade"
        :class="{ disabled: loading }"
        class="btn btn-primary px-5 pull-right">Upgrade
       </button>
        </div>
    </div>
  </div>
</template>
  <script>
  import { defineComponent, toRaw, ref } from 'vue'
  import { useStore } from 'vuex'
  import { mapState, mapGetters, mapMutations, mapActions } from '@/store/lib'
  import { computed } from 'vue'
  
  export default defineComponent({
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
    setup() {
      let fileList = []
      let previewVisible = false
      let previewImage = ''
      const store = useStore()
  
      const license = mapGetters()['license/license']
      const onSubmit = () => {
        store.dispatch('license/ADD',{
          payload: {
                ...toRaw(license).value,
              }
        }).then(() => {
              License.value.showaddlicense = false
        })
      }
      let License = computed(() => store.getters['license/license'].license)
      store.dispatch('license/GET_BY_ID', { payload: {} })
      const onUpgrade = ()=>{
          License.value.showaddlicense = true
      }
      const onCancel = ()=>{
        License.value.showaddlicense = false
      }
      return {
        license,
        License,
        onSubmit,
        onUpgrade,
        onCancel,
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      }
    },
  })
  </script>
  