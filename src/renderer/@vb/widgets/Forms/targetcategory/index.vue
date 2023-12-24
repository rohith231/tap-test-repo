<template>
    <a-form :rules="rules" :model="Category" label-align="left" layout="vertical" @finish="onSubmit">
      <div class="row">
        <div class="col-lg-4">
          <a-form-item required label="Name" name="name">
            <a-input v-model:value="Category.name" :disabled="disabled" placeholder="Category Name" />
          </a-form-item>
        </div>
      </div>
    </a-form>
  
    <div class="card-footer mt-4">
        <button type="submit" @click="onSubmit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button @click="$router.push('/system-sections/devices')" class="btn btn-light px-5 pull-right">Cancel</button>
    </div>
  </template>
  <script>
  import {toRefs, ref, toRaw, computed } from 'vue'
  import { useStore } from 'vuex'
  
  
  export default {
    components: {
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
    const user_systems = []
    const roles = []
    const rules = {}
    const previewVisible = false
    const previewImage = ''
    
    let Category = computed(() => store.getters['devicecategory/devicecategory'].devicecategory)
    store.dispatch('devicecategory/GET_BY_ID', { payload: { id: data.value.category_id } })

  //  let selectedSystem = ref('');
    const system_credentials = computed(() => store.getters['systems/systems'].system_credentials)
    if (data.value.category_id !== 'new') {
      store.dispatch('systems/GET_SYSTEM_CREDENTIALS', {
        payload: {id: store.getters['user/selectedSystem']},
      })
    }

    let buttonLable = computed(() => (data.value.category_id == 'new' ? 'Save' : 'Update'))
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])


    const onSubmit = async () => {

      if (data.value.category_id != 'new') {
        store
          .dispatch('devicecategory/UPDATE', {
            payload: {
              ...toRaw(Category).value,
              system_id: selectedSystem.value,
            },
          })
          .then(() => {})
      } else {
        store
          .dispatch('devicecategory/ADDCATEGORY', {
            payload: {
              ...toRaw(Category).value,
              system_id: selectedSystem.value,
              user_id: store.getters['user/user'].id,
            },
          })
          .then(() => {})
      }
    }

    const handleCancel = () => {
      this.previewVisible = false
    }
    
    return {
      handleCancel,
      onSubmit,
      system_credentials,
      previewImage,
      previewVisible,
      Category,
      roles,
      rules,
      buttonLable,
      user_systems,
    }
  },
  data() {
    return {
      btnloading: false,
      visible: false,
     }
  },

  watch: {
    Category: {
      handler(newValue, oldValue) {
      },
      deep: true,
    },
  },

  methods: {

      }
  }
  </script>
  