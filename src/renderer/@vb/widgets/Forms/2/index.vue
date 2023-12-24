<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" label-align="left">
    <div class="row p-2">
      <div class="col-6">
        First name <a-input v-model:value="organization.name" placeholder="First name..." />
      </div>
      <div class="col-6">
        Last name <a-input v-model:value="organization.name" placeholder="Last name..." />
      </div>
    </div>
    <div class="row p-2">
      <div class="col-6">
        Username <a-input v-model:value="organization.name" placeholder="Username..." />
      </div>
      <div class="col-6">
        Email <a-input v-model:value="organization.name" placeholder="Email..." />
      </div>
    </div>
    <div class="row p-2">
      <div class="col-6">
        Password <a-input v-model:value="organization.name" placeholder="Password..." />
      </div>
      <div class="col-6">
        Confirm password
        <a-input v-model:value="organization.name" placeholder="Confirm password..." />
      </div>
    </div>
    <div class="row p-2">
      <div class="col-6">
        Mobile Number <a-input v-model:value="organization.name" placeholder="Mobile Number..." />
      </div>
      <div class="col-6">
        Phone Number <a-input v-model:value="organization.name" placeholder="Phone Number..." />
      </div>
    </div>
    <div class="row p-2 mb-4">
      <div class="col-6">
        User role <a-input v-model:value="organization.name" placeholder="Mobile Number..." />
      </div>
      <div class="col-6">
        User system <a-input v-model:value="organization.name" placeholder="Phone Number..." />
      </div>
    </div>
  </a-form>
  <div class="card-footer">
    <button
      type="submit"
      @click="onSubmit"
      :class="{ disabled: loading }"
      class="btn btn-success px-5 pull-right"
    >
      Update
    </button>
  </div>
</template>
<script>
import { defineComponent, toRaw } from 'vue'
import { useStore } from 'vuex'
import { mapGetters } from '@/store/lib'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default defineComponent({
  components: {},

  setup() {
    let fileList = []
    let previewVisible = false
    let previewImage = ''
    const store = useStore()
    store.dispatch('organization/GET', { payload: {} })
    const organization = mapGetters()['organization/organization']

    const onSubmit = () => {
      store.dispatch('organization/UPDATE', { payload: { ...organization.value } }).then(() => {})
    }
    const beforeUpload = (data) => {
      // console.log("beforeUpload")
      getBase64(data).then((value) => store.commit('organization/SET_STATE', { logo: value }))
    }
    const handleCancel = () => {
      // console.log("handleCancel")
      // console.log(handleCancel)
      previewVisible = false
    }
    const handlePreview = async (file) => {
      // console.log("handlePreview")
      // console.log(handlePreview)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      previewImage = file.url || file.preview
      previewVisible = true
    }
    const handleChange = ({ fileList }) => {
      // console.log("fileList")

      fileList = []
    }
    return {
      fileList,
      handleChange,
      handlePreview,
      beforeUpload,
      handleCancel,
      previewImage,
      previewVisible,
      organization,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      onSubmit,
    }
  },
})
</script>
