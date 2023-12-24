<template>

        <div class="row">
          <div class="col-lg-4  mt-4">
            <a-form-item label="Reviewer :">
              <a-input :disabled="disabled" v-model:value="reviewerData.user_name" placeholder="Reviewer" />
            </a-form-item>
          </div>
          <div class="col-lg-4  mt-4">
            <a-form-item label=" Review date :">
              <a-date-picker v-model:value="reviewerData.date" class="w-100" :default-value="reviewerData.date"
                :disabled="disabled" placeholder="Review Date" />
            </a-form-item>
          </div>
          <div class="col-lg-4 mt-4">
            <a-form-item label=" Assessment status :">
              <a-tag class="p-1 pb-2  w-100 text-center" key="00"
                :color="reviewerData.status == 'COMPLIANT' ?  'green' : ( reviewerData.status == 'NON-COMPLIANT') ? 'orange' : 'gray' ">
                {{audit_data.status || 'Not applicable'}}
              </a-tag>
            </a-form-item>
          </div>
        </div>
  
</template>


<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

  },
  setup(props, { emit }) {
  
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
