<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" label-align="left">
    <div class="row">
      <div class="col-4">
        <a-form-item label="Logo">
          <div class="clearfix">
            <a-upload
              v-model:file-list="fileList"
              @preview="handlePreview"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              action="http://localhost:3331/api/v1/"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <div>
                <a-avatar :size="100">
                  <img
                    style="margin: -10px 4px; height: 80px; width: 80px"
                    :src="organization.logo"
                    v-if="organization.logo"
                  />
                  <span v-else
                    >{{ organization.name ? organization.name.charAt(0).toUpperCase() : '--' }}
                  </span>
                </a-avatar>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100% !important" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>
      </div>
      <div class="col-8">
        <a-form-item label="Name">
          <a-input v-model:value="organization.name" placeholder="Name..." />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea
            placeholder="Description..."
            v-model:value="organization.description"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="Address 1">
          <a-input v-model:value="organization.address1" placeholder="Address..." />
        </a-form-item>
        <a-form-item label="Address 2">
          <a-input v-model:value="organization.address2" placeholder="Address..." />
        </a-form-item>
        <a-form-item label="City">
          <a-input v-model:value="organization.city" placeholder="City..." />
        </a-form-item>
        <a-form-item label="State">
          <a-input v-model:value="organization.state" placeholder="State..." />
        </a-form-item>
        <a-form-item label="Zip Code">
          <a-input v-model:value="organization.zip_code" placeholder="Zip Code..." />
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
      Update
    </button>
  </div>
</template>
<script>
import { defineComponent, toRaw } from 'vue'
import { useStore } from 'vuex'
import { mapState, mapGetters, mapMutations, mapActions } from '@/store/lib'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default defineComponent({
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
      //         console.log("handleCancel")
      // console.log(handleCancel)
      previewVisible = false
    }
    const handlePreview = async (file) => {
      // console.log('handlePreview')
      // console.log(handlePreview)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      previewImage = file.url || file.preview
      previewVisible = true
    }
    const handleChange = ({ fileList }) => {
      // console.log('fileList')

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
