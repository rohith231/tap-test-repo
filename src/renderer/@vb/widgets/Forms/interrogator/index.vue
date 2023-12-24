<template>
  <a-form :model="interrogator" label-align="left" layout="vertical">
    <div class="row">
      <div class="col-lg-12">
        <a-form-item label="Description">
          <a-textarea
            :rows="2"
            v-model:value="interrogator.description"
            :disabled="disabled"
            placeholder="Description"
          />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="Sleep duration / seconds">
          <a-input
            v-model:value="interrogator.sleep_duration"
            :disabled="disabled"
            placeholder="Sleep duration / seconds"
          />
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item label="Delay per wave / seconds">
          <a-input
            v-model:value="interrogator.delay_per_wave"
            :disabled="disabled"
            placeholder="Delay per wave / seconds"
          />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="Delay per control / seconds">
          <a-input
            v-model:value="interrogator.delay_per_control"
            :disabled="disabled"
            placeholder="Delay per control / seconds"
          />
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item label="Delay per fingerprint wave / seconds">
          <a-input
            v-model:value="interrogator.delay_per_fingerprint_wave"
            :disabled="disabled"
            placeholder="Delay per fingerprint wave / seconds"
          />
        </a-form-item>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <a-form-item label="Concurrent Controls">
          <a-input
            v-model:value="interrogator.concurrent_controls"
            :disabled="disabled"
            placeholder="Concurrent Controls"
          />
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item label="Sleep">
          <a-switch :checked="interrogator.sleep" default-checked @change="onChange" />
        </a-form-item>
      </div>
    </div>
  </a-form>
  <div class="card-footer">
    <button
      type="submit"
      @click="onSubmit"
      :disabled="disabled"
      class="btn btn-primary px-5 pull-right"
    >
      Update
    </button>
  </div>
</template>
<script>
import { toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import { notification } from 'ant-design-vue'

export default {
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
    const store = useStore()
    store.dispatch('interrogator/GET', {})
    const interrogator = computed(() => store.getters['interrogator/interrogator'].interrogator)

    const onSubmit = () => {
      // console.log('submit!', toRaw(interrogator))
      store
        .dispatch('interrogator/UPDATE', { payload: { ...toRaw(interrogator).value } })
        .then(() => {
          notification.success({
            message: 'Interrogator update',
            description: 'Interrogator successfully updated!',
          })
        })
    }

    const onChange = (checked) => {
      // interrogator.value.sleep = checked.target.checked
      interrogator.value.sleep = checked
    }

    return {
      onSubmit,
      onChange,
      interrogator,
    }
  },
}
</script>
