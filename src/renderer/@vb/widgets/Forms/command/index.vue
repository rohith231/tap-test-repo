<template>
  <a-form :rules="rules" :model="commands" label-align="left" layout="vertical" @finish="onSubmit">
    <div class="row">
      <div class="col-lg-12">
        <a-form-item label="Validation Command">
          <a-textarea
            placeholder="Validation Command..."
            :disabled="disabled"
            v-model:value="commands.validation_cmd"
            :rows="4"
          />
        </a-form-item>
      </div>
      <div class="col-lg-12">
        <a-form-item label="Validation Expected Result">
          <a-textarea
            placeholder="Validation Expected Result..."
            :disabled="disabled"
            v-model:value="commands.validation_expected"
            :rows="4"
          />
        </a-form-item>
      </div>
      <div class="col-lg-12">
        <a-form-item label="Validation Result">
          <a-textarea
            placeholder="Validation Result..."
            :disabled="disabled"
            v-model:value="commands.validation_result"
            :rows="4"
          />
        </a-form-item>
      </div>

      <div class="col-lg-7">
        <a-form-item label="IP address">
          <a-input
            v-model:value="commands.validation_ip"
            :disabled="disabled"
            placeholder="IP address"
          />
        </a-form-item>
      </div>
      <div class="col-lg-5">
        <a-form-item>
          <button
            type="button"
            @click="onExecute('validation')"
            :disabled="disabled"
            class="btn btn-primary pull-right"
            style="margin-top: 30px"
          >
            Test Validation Script
          </button>
        </a-form-item>
      </div>
      <div class="col-lg-12">
        <a-form-item label="Remediation Command">
          <a-textarea
            placeholder="Remediation Command..."
            :disabled="disabled"
            v-model:value="commands.remediation_cmd"
            :rows="4"
          />
        </a-form-item>
      </div>
      <div class="col-lg-12">
        <a-form-item label="Remediation Expected Result">
          <a-textarea
            placeholder="Remediation Expected Result..."
            :disabled="disabled"
            v-model:value="commands.remediation_expected"
            :rows="4"
          />
        </a-form-item>
      </div>
      <div class="col-lg-12">
        <a-form-item label="Remediation Result">
          <a-textarea
            placeholder="Remediation Result..."
            :disabled="disabled"
            v-model:value="commands.remediation_result"
            :rows="4"
          />
        </a-form-item>
      </div>

      <div class="col-lg-7">
        <a-form-item label="IP address">
          <a-input
            v-model:value="commands.remediation_ip"
            :disabled="disabled"
            placeholder="IP address"
          />
        </a-form-item>
      </div>
      <div class="col-lg-5">
        <button
          type="button"
          @click="onExecute('remediation')"
          :disabled="disabled"
          class="btn btn-primary pull-right"
          style="margin-top: 30px"
        >
          Test Remediation Script
        </button>
      </div>
      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="commands.status" :disabled="disabled">Active</a-checkbox>
        </a-form-item>
      </div>

      <div class="col-lg-6">
        <a-form-item>
          <a-checkbox v-model:checked="commands.done" :disabled="disabled">Done</a-checkbox>
        </a-form-item>
      </div>
    </div>

    <div class="card-footer">
      <button type="submit" :disabled="disabled" class="btn btn-primary px-5 ml-2 pull-right">
        {{ buttonLable }}
      </button>
      <button
        @click="$router.push({ path: '/system-sections/Systems' })"
        class="btn btn-light px-5 pull-right"
      >
        Cancel
      </button>
    </div>
  </a-form>
</template>
<script>
import { toRaw, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
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

    let commands, vulnerability

    const route = useRoute()

    const routeDetails = computed(() => route)

    let type = computed(() => routeDetails.value.params.type)
    let vuln_num = computed(() => routeDetails.value.params.vuln_num)
    let vuln_id = computed(() => routeDetails.value.params.vuln_id)
    if (type.value == 'STIGs') {
      commands = computed(() => store.getters['STIGs/STIGs'].vulnCommand)
    } else {
      commands = computed(() => store.getters['deviations/deviations'].vulnCommand)
    }

    let buttonLable = computed(() => (props.data.system_id == 'new' ? 'Save' : 'Update'))

    const onSubmit = () => {
      toRaw(commands).value.vuln_num = vuln_num.value

      // console.log('submit!', toRaw(commands))

      if (type.value == 'STIGs') {
        toRaw(commands).value.STIGs_vulnerability_id = vuln_id.value

        store
          .dispatch('STIGs/VULNERABILITY_COMMAND_ADD_UPDATE', {
            payload: {
              ...toRaw(commands).value,
            },
          })
          .then(() => {
            notification.success({
              message: 'Vulnerability command',
              description: 'Vulnerability command successfully updated!',
            })
          })
      } else {
        toRaw(commands).value.deviation_vulnerability_id = vuln_id.value
        store
          .dispatch('deviations/VULNERABILITY_COMMAND_ADD_UPDATE', {
            payload: {
              ...toRaw(commands).value,
            },
          })
          .then(() => {
            notification.success({
              message: 'Vulnerability command',
              description: 'Vulnerability command successfully updated!',
            })
          })
      }
    }

    const onExecute = (commandType = 'remediation') => {
      toRaw(commands).value.vuln_num = vuln_num.value

      if (commandType == 'remediation') {
        store
          .dispatch('STIGs/EXECUTE_COMMAND', {
            payload: {
              ip: toRaw(commands).value.remediation_ip,
              cmd: toRaw(commands).value.remediation_cmd,
              vuln_num: toRaw(commands).value.vuln_num,
            },
          })
          .then(() => {
            toRaw(commands).value.remediation_result = computed(
              () => store.getters['STIGs/STIGs'].commandExecuteResult,
            )

            notification.success({
              message: 'Execute command',
              description: 'Command successfully executed!',
            })
          })
      } else {
        store
          .dispatch('STIGs/EXECUTE_COMMAND', {
            payload: {
              ip: toRaw(commands).value.validation_ip,
              cmd: toRaw(commands).value.validation_cmd,
              vuln_num: toRaw(commands).value.vuln_num,
            },
          })
          .then(() => {
            toRaw(commands).value.validation_result = computed(
              () => store.getters['STIGs/STIGs'].commandExecuteResult,
            )
            notification.success({
              message: 'Execute command',
              description: 'Command successfully executed!',
            })
          })
      }
    }
    const handleCancel = () => {
      this.previewVisible = false
    }
    const onChange = (checked) => {
      system.value.status = checked
    }

    return {
      handleCancel,
      onSubmit,
      onExecute,
      onChange,

      commands,

      buttonLable,
    }
  },
}
</script>
