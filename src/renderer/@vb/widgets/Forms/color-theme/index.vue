<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" label-align="left">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-3 mr-auto">Menu Color:</div>
          <div class="col-auto">
            <div class="vb__sidebar__fixColorPicker">
              <vb-color-picker
                :organization-color-type="'primary_color'"
                :value="organization.primary_color"
                :setting="'menuColor'"
                :colors="[
                  'white',
                  'gray',
                  'antiquewhite',
                  'aqua',
                  'blue',
                  'green',
                  'red',
                  'orange',
                  'purple',
                  'dark',
                ]"
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div class="row">
          <div class="col-3 mr-auto">Secondary Color:</div>
          <div class="col-auto">
            <div class="vb__sidebar__fixColorPicker">
              <vb-color-picker
                :organization-color-type="'secondary_color'"
                :value="organization.secondary_color"
                :setting="''"
                :colors="[
                  'white',
                  'gray',
                  'antiquewhite',
                  'aqua',
                  'blue',
                  'green',
                  'red',
                  'orange',
                  'purple',
                  'dark',
                ]"
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <div class="row">
          <div class="col-3 mr-auto">Accent Color:</div>
          <div class="col-auto">
            <div class="vb__sidebar__fixColorPicker">
              <vb-color-picker
                :organization-color-type="'accent_color'"
                :value="organization.accent_color"
                :setting="''"
                :colors="[
                  'white',
                  'gray',
                  'antiquewhite',
                  'aqua',
                  'blue',
                  'green',
                  'red',
                  'orange',
                  'purple',
                  'dark',
                ]"
              />
            </div>
          </div>
        </div>
        <br />
        <br />
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
import VbColorPicker from '@/@vb/components/Sidebar/partials/colorPicker'
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
  components: { VbColorPicker },

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
