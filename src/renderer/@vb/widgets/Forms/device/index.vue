<template>
  <a-form :rules="rules" :model="Device" label-align="left" layout="vertical" @finish="onSubmit">
    <div class="row">
      <div class="col-lg-6">
        <h5>Target Information</h5>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-lg-4">
        <a-form-item required label="IP address" name="ip_addr">
          <a-input v-model:value="Device.ip_addr" :disabled="disabled" placeholder="IP address" />
        </a-form-item>
      </div>
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
      <div class="col-lg-4">
        <a-form-item label="Category">
          <a-select
            v-model:value="Device.category_id"
            placeholder="Unassigned"
            style="width: 100% !important"
            :disabled="disabled"
            :value="Device.category_id"
            @change="changeCategory"
          >
              <a-select-option :value="cat.id"  v-for="(cat) in categories" :key="cat.name" >
                  {{ cat.name }}</a-select-option>
              <a-select-option @click="showModal('new')" value="new">
              <i class="btn-addon-icon fas fa-plus" /> Add Category   
              </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="col-lg-4">
        <div class="row mt-4">
          <a-form-item class="col-lg-4 mt-2">
            <a-checkbox v-model:checked="Device.remediate" :disabled="disabled"
              >Remediate</a-checkbox
            >
          </a-form-item>
          <a-form-item class="col-lg-4 mt-2">
            <a-checkbox v-model:checked="Device.validate" :disabled="disabled">Validate</a-checkbox>
          </a-form-item>
          <a-form-item class="col-lg-4 mt-2" :disabled="disabled">
            <a-switch
              :disabled="disabled"
              :checked="Device.status"
              default-checked
              @change="onChange"
            />
            Active
          </a-form-item>
        </div>
      </div>
    </div>

    <device-detail-os :label="buttonLable" :disabled="disabled" :device="Target" />
    <device-installed-apps :data="Device.installed_apps" />

    <div class="row">
      <div class="col-lg-6">
        <h5>Login details</h5>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="User Name">
          <a-input
            v-model:value="Device.username"
            @keyup="setLoginDetails"
            :disabled="disabled"
            placeholder="User Name"
          />
        </a-form-item>
      </div>
      <div class="col-lg-3">
        <a-form-item label="Password">
          <a-input-password
            v-model:value="Device.password"
            @keyup="setLoginDetails"
            :disabled="disabled"
            placeholder="Password"
            type="password"
          />
        </a-form-item>
      </div>

      <div class="col-lg-3">
        <a-form-item label="SSH Private Key">
          <a-upload
            :max-count="1"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            accept=".pem"
            list-type="picture"
            :disabled="disabled"
          >
            <a-button @click="uploadSshKey">
              <upload-outlined></upload-outlined>
              <span v-if="Device.ssh_private_key && Device.ssh_private_key.length > 0"
                >Change File</span
              >
              <span v-else>Select File</span>
            </a-button>
          </a-upload>
        </a-form-item>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <h5>Credential</h5>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item>
          <a-select
            v-model="Device.credential_id"
            style="width: 100% !important"
            @change="setCredential"
            placeholder="Credential"
            :value="Device.credential_id"
            :disabled="disabled"
          >
            <a-select-option v-for="credential in system_credentials" :key="credential.id">
              {{ credential.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </div>

    <div class="card-footer">
      <button type="submit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button
        @click="$router.push({ path: '/system-sections/devices' })"
        class="btn btn-light px-5 pull-right"
      >
        Cancel
      </button>
    </div>
  </a-form>
    <div>
    <a-modal v-model:visible="visible" title="Add Category">
      <template #footer>
        <a-button key="back" @click="HandleCancel">
          Cancel
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk">
          Add
        </a-button>
      </template>
      <a-form :rules="rules" ref="ruleForm" :model="form" :label-col="{ span: 6 }">
       <a-form-item label="Category Name" ref="name">
            <a-input v-model:value="form.name" :rows="3" />
          </a-form-item>
          <!-- <a-form-item v-bind="form.status" label="Status">
            <a-switch :checked="form.status" default-checked @change="OnChange" />
          </a-form-item> -->
        </a-form>
    </a-modal>
    </div>
</template>
<script>
import DeviceDetailOs from '@/@vb/widgets/Forms/device/details'
import DeviceInstalledApps from '@/@vb/widgets/Forms/device/apps'
import { UploadOutlined } from '@ant-design/icons-vue'

import { toRefs, ref, toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import { encrypt64, decrypt64 } from '~/encryption'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export default {
  components: { DeviceDetailOs, DeviceInstalledApps, UploadOutlined },
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
    let categories =[]
    const user_systems = []
    const roles = []
    const rules = {}
    const previewVisible = false
    const previewImage = ''
    let pass = ref(true)
    const fileList = ref([])
    const uploading = ref(false)
    //let visible = ref(false)
    let name = ref('')
    
    let form= {
        id: null,
        name: '',
        status: true
      }
    let Device = computed(() => store.getters['device/device'].device)
    store.dispatch('device/GET_BY_ID', { payload: { id: data.value.device_id } })

  //  let selectedSystem = ref('');
    const system_credentials = computed(() => store.getters['systems/systems'].system_credentials)
    if (data.value.device_id !== 'new') {
      store.dispatch('systems/GET_SYSTEM_CREDENTIALS', {
        payload: {id: store.getters['user/selectedSystem']},
      })
    }

    let buttonLable = computed(() => (data.value.device_id == 'new' ? 'Save' : 'Update'))
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])

    const readKeyFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (res) => {
          const content = res.target.result
          return resolve(content)
        }

        reader.onerror = (err) => {
          return reject(err)
        }

        reader.readAsText(file)
      })
    }

    const onSubmit = async () => {
      // SSH Key handling
      if (fileList.value && fileList.value[0]) {
        try {
          const key = await readKeyFile(fileList.value[0])
          Device.value['ssh_private_key'] = encrypt64(key)
        } catch (e) {
          console.error(e)
          alert('Error reading SSH Key file')
          return
        }
      }

      toRaw(Device).value.licenseName= "Trial Edition"

      if (data.value.device_id != 'new') {
        if(decrypt64(Device.value['password'])==''){
             Device.value['password'] = encrypt64(Device.value['password'])
        }
        store
          .dispatch('device/UPDATE', {
            payload: {
              ...toRaw(Device).value,
              system_id: selectedSystem.value,
            },
          })
          .then(() => {})
      } else {
      // Password handling
      if (Device.value['password'] && Device.value['password'] != '') {
        try {
          Device.value['password'] = encrypt64(Device.value['password'])
        } catch (e) {
          Device.value['password'] = decrypt64(Device.value['password'])
        }
      }
        store
          .dispatch('device/ADD', {
            payload: {
              ...toRaw(Device).value,
              system_id: selectedSystem.value,
            },
          })
          .then(() => {})
      }
    }

    const handleCancel = () => {
      this.previewVisible = false
    }
    const onChange = (checked) => {
      Device.value.status = checked
    }
    const setCredential = (credential_id) => {
      Device.value.credential_id = credential_id
      Device.value.username = ''
      Device.value.password = ''
      Device.value.ssh_private_key = ''
      fileList.value = []
    }
    const uploadSshKey = () => {
      Device.value.credential_id = ''
      Device.value.password = ''
    }
    const setLoginDetails = () => {
      Device.value.credential_id = ''
      Device.value.ssh_private_key = ''
      fileList.value = []
    }
    const changeType = (ostype) => {
      store.dispatch('device/SET_TYPE', { payload: ostype })
    }
    const getData = (ctgryname) => {
       store.dispatch('devicecategory/GET_BY_STATUS', {
        payload: {
          system_id: store.getters['user/selectedSystem']
        },
        })
        categories = computed(() => store.getters['devicecategory/activecatgories'])
        if(categories.length==0){
          Device.value['category_id'] =""
        }else{
          if(ctgryname != "") {
          Device.value['category_id'] = ctgryname;
        } else {
          Device.value['category_id'] = categories[i].id
        }
        }
        //console.log("categories", categories)
    }
    getData()
    const changeCategory = (category_id) => {
      // console.log("category_id: ", category_id);
      if(category_id=='new' || category_id=='+'){
      store.dispatch('device/SET_CATEGORY', { payload: "" })
      Device.value['category_id'] = ""
      }else{
      store.dispatch('device/SET_CATEGORY', { payload: category_id })
      }
    }
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file)
      const newFileList = fileList.value.slice()
      newFileList.splice(index, 1)
      fileList.value = newFileList
    }

    const beforeUpload = (file) => {
      fileList.value = [file]
      return false
    }

    return {
      handleCancel,
      onSubmit,
      onChange,
      setCredential,
      setLoginDetails,
      uploadSshKey,
      changeType,
      changeCategory,
      system_credentials,
      getData,
      categories,
      previewImage,
      previewVisible,
      Device,
      roles,
      rules,
      buttonLable,
      user_systems,
      pass,
      fileList,
      uploading,
      handleRemove,
      beforeUpload,
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        status:true
      },
      btnloading: false,
      visible: false,
     }
  },

  watch: {
    Device: {
      handler(newValue, oldValue) {
        this.pass = newValue['password'] === '' ? false : true
      },
      deep: true,
    },
  },

  methods: {
     showModal(data = null) {
     // this.$Device.categoryname ="Unassigned"

      if (data == 'new') {
        this.form = {
          id: null,
          name: '',
          status:true
        }
      }
      this.form = {
        ...this.form,
        ...data.record,
      }      
      this.visible = true
    },
     getDataAfter(ctgryname){
      //this.categories = this.categories;
      this.getData(ctgryname);

      //$catgories = computed(() => this.$store.getters['devicecategory/activecatgories'])

     },
     handleOk(){

      // console.log("this.form: ",this.form.name);
      let ctgryname=this.form.name;
      this.$store
          .dispatch('devicecategory/ADD', {
            payload: {
              ...this.form,
              system_id: this.$store.getters['user/selectedSystem'],
              user_id: this.$store.getters['user/user'].id,
            },
          })
          .then(() => {
            setTimeout(() => {
              this.form = {
                id: null,
                name: '',
                status: true,
              }
              this.getDataAfter(ctgryname);
              this.visible = false
              //this.btnloading = false
            }, 500)
          })
     },
    OnChange(checked) {
      this.form.status = checked
    },
    HandleCancel(e) {
      this.visible = false
      //this.$Device.categoryname =""
    },
  }
}
</script>
