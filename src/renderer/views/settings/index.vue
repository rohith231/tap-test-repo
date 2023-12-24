<template>
    <div class="row">
      <div class="col-lg-12 col-md-12">
          <div class="" >
            <div class="">
            <HeaderComponent
              :data="{ title: 'Settings' }"
               @search="getData($event)"
              @add-new="showModal(form)" 
            />
            </div>
              <template v-if="loading">
                 <div class="card-body">
                    <a-skeleton active />
                    <a-skeleton active />
                </div>
              </template>
             <template  v-else>
               <template v-for="(setting,index) in list" :key="index">
                <div class="card" >
                  <div class="card-body">
                    <div className="d-flex align-items-center flex-wrap">
                          <div className="d-flex flex-nowrap align-items-center width-200 flex-shrink-1 mr-2">
                            <div className="vb__utils__donut vb__utils__donut--danger mr-2 flex-shrink-0" />
                            <a href="javascript: void(0);" className="font-weight-bold text-blue text-nowrap">
                              {{setting.setting_type.charAt(0).toUpperCase() + setting.setting_type.slice(1).replace('_', ' ')}}
                            </a>
                          </div>
                          <div className="flex-grow-1 mr-2">{{ ( setting.setting_value.length > 80) ?  setting.setting_value.substr(0, 80-1) + '&hellip;' :  setting.setting_value}}</div>
                          <div className="dropdown d-inline-block">
                            <a-dropdown placement="bottomRight" :trigger="['click']">
                              <button type="button" class="btn btn-light dropdown-toggle dropdown-toggle-noarrow">
                                <i class="fe fe-more-vertical" />
                              </button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item @click="showModal(setting)">
                                     <a href="javascript:;" >Edit</a>
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item @click="remove(setting.id)">
                                    <a href="javascript:;">Remove</a>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </div>
                        </div>
                    </div>
                  </div>
              </template>
             </template>
               <div>
                <a-modal
                  :title="modal_title"
                  :visible="visible"
                  :confirm-loading="confirmLoading"
                  @ok="handleOk"
                  @cancel="handleCancel"
                >
                    
                <a-form
                  id="database-form"
                  ref="databaseForm"
                  :model="form"
                  label-align="left"
                  layout="vertical"
                >
                <div class="row">
                  <div class="col-6">
                  <a-form-item required label="setting_key :" name="setting_key">
                    <a-input v-model:value="form.setting_key"  :disabled="form.id != '' "/>
                  </a-form-item>
                  </div>
                  <div class="col-6">
                    <a-form-item required label="setting_type :" name="setting_type">
                      <a-input v-model:value="form.setting_type" />
                    </a-form-item>
                  </div>
                </div>

                <div class="row">
                <div class="col-12">
                  <a-form-item required label="setting_value :" name="setting_value">
                     <a-textarea  v-model:value="form.setting_value" :rows="2" />
                  </a-form-item>
                </div>
                  <div class="col-lg-12">
                     <a-form-item label="Roles">
                       <a-select
                        v-model:value="form.Roles"
                        :default-value="form.Roles"
                        mode="multiple"
                        style="width: 100% !important"
                        placeholder="Please select"
                        :options="allRoles.map((role) => { return {value: role.id, label: role.name} })"
                      >
                      </a-select>
                     </a-form-item>
                  </div>
              </div>
                </a-form>
                </a-modal>
              </div>
          </div>
        </div>
      </div>

</template>

<script>
import HeaderComponent from './header'
import { computed, ref,reactive } from 'vue'
import { notification } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { useStore } from 'vuex'

export default {
  name: 'VbMessaging',
 
  components: {
    HeaderComponent
  },
  setup(){
    const loading = computed(() => store.getters['setting/setting'].loading)
    const store = useStore()
    
    store.dispatch('roles/GET_ROLES',{ payload: { pageNumber:-1,itemsPerPage:-1}})
    const allRoles =  computed(() => store.getters['roles/roles'].list)
    const list = computed(() => store.getters['setting/setting'].list)
    let visible = ref(false);
    let modal_title = ref('');
    const form = reactive({
        id: "",
        setting_key: "",
        setting_type: "",
        setting_value: "",
        Roles: []
      })
    const getData = (search = '') => {
      store.dispatch('setting/GET_ALL',{
        search
      })
    }
    const showModal = (setting) => {
      visible.value = true;
      modal_title.value = setting.id ? ( 'Edit ' + setting.setting_type.charAt(0).toUpperCase() + setting.setting_type.slice(1).replace('_', ' ')) : 'New setting'
      let roles = []
       setting.Roles.forEach(role => {
         if(typeof role ===  'object'){
              roles.push(role.id) 
          }
      });
      form.id = setting.id
      form.setting_key = setting.setting_key
      form.setting_type = setting.setting_type
      form.setting_value = setting.setting_value
      form.Roles = roles
      
    }
    const handleCancel = (e) => {
      form.id = ''
      form.setting_key = ''
      form.setting_type = ''
      form.setting_value = ''
      form.Roles = []
      visible.value = false;

    }

    const handleOk = (e) => {
 
      if(!form.id){
      store.dispatch('setting/ADD', {payload: { ...form }}).then(()=>{
                form.id = ''
                form.setting_key = ''
                form.setting_type = ''
                form.setting_value = ''
                form.Roles = []
                visible.value = false;
                notification.success({
                  message: 'Setting create',
                  description: 'Setting successfully created!',
                })

              store.dispatch('setting/GET_ALL',{})
            })
      }else{
        store.dispatch('setting/UPDATE', {payload: { ...form }}).then(()=>{
              form.id = ''
              form.setting_key = ''
              form.setting_type = ''
              form.setting_value = ''
              form.Roles = []
              visible.value = false;
              notification.success({
                message: 'Setting update',
                description: 'Setting successfully updated!',
              })

            store.dispatch('setting/GET_ALL',{})
          })
      }
  
      
    }

    const remove = (id) => {

     Modal.confirm({
        title: 'Setting delete',
        content: 'Are you sure you want delete this setting ?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          store.dispatch('setting/DELETE', {payload: { id }}).then(()=>{
                    
                    visible.value = false;
                    notification.success({
                      message: 'Setting delete',
                      description: 'Setting successfully deleted!',
                    })

                  store.dispatch('setting/GET_ALL',{})
                })
        },
        onCancel() {},
      })
      

    }
    getData()
    return {
     list,
     getData,
     allRoles,
     visible,
     modal_title,
     loading,
     form,
     remove,
     handleCancel,
     handleOk,
     showModal
      
    }
  },
 data() {
    return {
      ModalText: 'Content of the modal',
      confirmLoading: false,
    };
  },
  methods: {
  
    
  },

 
}
</script>

<style >
.ant-collapse.ant-collapse-icon-position-left {
    margin-top: 10px;
}

.ant-collapse-content.ant-collapse-content-active {
    overflow: unset !important;
}
</style>
