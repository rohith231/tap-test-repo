  <template>
  <template v-if="StepperLoading">
    <a-skeleton active />
    <a-skeleton active />
  </template>
  <div v-else-if="steps[current]" class="mb-4">
    <a-steps :current="current" :status="stepStatus(steps[current])" size="small">
      <a-step v-for="(item, i) in steps" :key="i" :title="item.name" />
    </a-steps>

    <div class="row">
      <div class="steps-content mt-4 col-12">
        <a-typography-text strong> Step : </a-typography-text>
        <a-typography-text> {{ capitalizeFirstLetter(steps[current].name) }} </a-typography-text>
        <br />
        <br />
        <a-typography-text strong> Description : </a-typography-text>
        <a-typography-text>
          {{ capitalizeFirstLetter(steps[current].description) || '---' }}
        </a-typography-text>
        <br />
        <br />
        <a-divider class="m-0" v-if="allow_form" />
      </div>
      <div class="steps-content mt-4 col-7" v-if="allow_form">
        <a-form label-align="left" layout="vertical">
          <a-form-item label="Note">
            <a-textarea :rows="7" v-model:value="comment" :disabled="disabled" placeholder="Note" />
          </a-form-item>
        </a-form>
      </div>
      <div
        class="steps-action mb-3 pull-right col-5"
        v-if="allow_form"
        style="margin-top: 20px; text-align: end"
      >
        <a-form label-align="left" layout="vertical" v-if="steps[current].users.length > 0">
          <a-form-item label="Users">
            <a-select
              :disabled="disabled"
              mode="multiple"
              style="width: 100% !important"
              placeholder="Please select"
              option-label-prop="label"
              v-model:value="steps[current].selectedUsers"
              :options="
                steps[current].users.map((user) => {
                  return { value: user.id, label: user.display_name }
                })
              "
            >
              <template #option="{ value: val, label }">
                <span role="img" :aria-label="val"></span>
                &nbsp;&nbsp;{{ label }}
              </template>
            </a-select>
          </a-form-item>
        </a-form>
        <a-button
          v-if="current < steps.length - 1"
          :disabled="disabled && !steps[current].approved_button_disable"
          class="w-100 mt-4"
          type="primary"
          @click="next"
          >Approve</a-button
        >
        <a-button
          v-if="current > 0"
          class="w-100 mt-2"
          :disabled="disabled && !steps[current].reject_button_disable"
          type="danger"
          @click="prev"
          >Reject</a-button
        >
      </div>
    </div>

    <a-collapse class="mt-6" v-if="allow_history && !Historyloading">
      <a-collapse-panel key="1" header="Approval History">
        <a-timeline mode="alternate" v-if="histories.length > 0">
          <a-timeline-item
            v-for="(history, i) in histories"
            :key="i"
            :color="
              history.action == 'rejected' ? 'red' : history.action == 'approved' ? 'green' : 'blue'
            "
          >
            <a-typography-text type="secondary">{{
              new Date().toDateString(history.createdAt)
            }}</a-typography-text>
            <h5
              class="bg-light"
              style="
                background: rgb(242, 244, 248);
                text-align: center;
                padding: 7px;
                border: 1px solid #ccc;
                border-radius: 3px;
              "
            >
              {{
                capitalizeFirstLetter(history.approval_process.name) -
                  capitalizeFirstLetter(history.action) || capitalizeFirstLetter(history.action)
              }}
            </h5>
            <a-divider class="m-0" />

            <div class="font-weight-regular text-left" v-if="history.action == 'edit'">
              <div class="font-weight-bold font-weight-regular" v-if="history.type == 'ato'">
                <a-typography-text strong> System Updated by </a-typography-text>
                <a-typography-text>{{
                  capitalizeFirstLetter(history.User.display_name)
                }}</a-typography-text>
              </div>

              <div class="font-weight-bold font-weight-regular" v-if="history.type == 'control'">
                <a-typography-text strong> Control Updated by </a-typography-text>
                <a-typography-text>{{
                  capitalizeFirstLetter(history.User.display_name)
                }}</a-typography-text>
              </div>
            </div>
            <div class="font-weight-regular text-left" v-else>
              <a-typography-text strong> Step : </a-typography-text>
              <a-typography-text
                >{{ capitalizeFirstLetter(history.approval_process.name) }}
              </a-typography-text>
              <a-typography-text>{{ capitalizeFirstLetter(history.action) }} </a-typography-text>
              <a-typography-text strong> by </a-typography-text>
              <a-typography-text
                >{{ capitalizeFirstLetter(history.User.display_name) }}
              </a-typography-text>
              <p><a-typography-text strong> Note : </a-typography-text>{{ history.comment }}</p>
            </div>

            <a-typography-text type="secondary" />
          </a-timeline-item>
          <a-timeline-item :color="'blue'"> </a-timeline-item>
        </a-timeline>
        <div class="justify-center" v-else>
          <div class="text-center">
            <h4>No History</h4>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>


<script>
import { computed, ref, toRaw } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    targetId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'control',
    },
  },
  setup(props, { emit }) {
    const current = ref(0)
    let comment = ref()
    const store = useStore()
    let Steps = computed(() => store.getters['approvalProcess/approvalProcess'].steps)
    let steps = computed(() => {
      Steps.value.map(function (step, index) {
        if (step.active) {
          current.value = step.order - 1
        }
        step.selectedUsers.map(function (user, user_index) {
          if (typeof user === 'object') {
            return (Steps.value[index].selectedUsers[user_index] = user.id)
          }
        })

        return step
      })

      return store.getters['approvalProcess/approvalProcess'].steps
    })
    const Historyloading = computed(
      () => store.getters['approvalProcess/approvalProcess'].GET_HISTORYloading,
    )
    const StepperLoading = computed(
      () => store.getters['approvalProcess/approvalProcess'].GET_STEPPERloading,
    )
    let selectedSystem = computed(() => store.getters['user/selectedSystem'])
    const getApprovalProcess = () => {
      store
        .dispatch('approvalProcess/GET_STEPPER', {
          payload: {
            system_id: selectedSystem.value,
            type: props.type,
            control_id: props.targetId,
          },
        })
        .then(async () => {
          await store.dispatch('approvalProcess/GET_HISTORY', {
            payload: {
              type: props.type,
              target_id: props.targetId,
            },
          })
        })
    }
    if (props.targetId && props.targetId != 'null') {
      getApprovalProcess()
    }

    let histories = computed(() => store.getters['approvalProcess/approvalProcess'].history)
    let allow_history = computed(
      () => store.getters['approvalProcess/approvalProcess'].allowHistory,
    )
    let allow_form = computed(() => store.getters['approvalProcess/approvalProcess'].allowForm)

    const capitalizeFirstLetter = (string) => {
      if (string) return string.charAt(0).toUpperCase() + string.slice(1)
    }
    let user_id = computed(() => store.getters['user/user'].id)
    const next = () => {
      var body = {
        approval_process_id: toRaw(steps).value[current.value].id,
        target_pointer: toRaw(steps).value[current.value + 1]
          ? toRaw(steps).value[current.value + 1].label
          : 'Approved',
        action: 'approved',
        assigned_to: toRaw(steps).value[current.value].selectedUsers,
        comment: comment.value,
        action_by: user_id.value,
        approval_process: toRaw(steps).value[current.value],
        control_id: props.targetId,
      }
      store.dispatch('approvalProcess/ACTION', {
        payload: {
          body: body,
          system_id: selectedSystem.value,
          type: props.type,
        },
      })
    }
    const prev = () => {
      var body = {
        approval_process_id: toRaw(steps).value[current.value - 1].id,
        target_pointer: toRaw(steps).value[current.value - 1].label,
        action: 'rejected',
        comment: comment.value,
        assigned_to: toRaw(steps).value[current.value].previous_action,
        action_by: user_id.value,
        approval_process: toRaw(steps).value[current.value],
        control_id: props.targetId,
      }
      store.dispatch('approvalProcess/ACTION', {
        payload: {
          body: body,
          system_id: selectedSystem.value,
          type: props.type,
        },
      })
    }
    const stepStatus = (step) => {
      if (step)
        // return (!step.reject && !step.approved) ? 'process' : (step.reject) ? 'error' : 'finish'
        return step.step_color == 'red' ? 'error' : step.step_color == 'blue' ? 'process' : 'finish'
    }
    return {
      stepStatus,
      StepperLoading,
      Historyloading,
      allow_history,
      allow_form,
      histories,
      current,
      steps,
      comment,
      next,
      capitalizeFirstLetter,
      prev,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
