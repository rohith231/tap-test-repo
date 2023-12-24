<template>
  <div><a @click="$router.go(-1)" class="mb-3 btn btn-outline-primary width-100">back</a></div>
  <span><strong>{{ record.number }}: </strong>
  {{record.title}}</span>
  <div class="row mt-4">
    <div :class = "(visible)?'col-md-8':'col-md-12'">

          <a class="float" v-show="!visible" @click="() => (visible = !visible)"><i class="fas fa-chevron-left my-float" /></a>
          <a class="float" v-show="visible" @click="() => (visible = !visible)"><i class="fas fa-chevron-right my-float" /></a>

      <div class="card card-top card-top-primary">
        <div class="card-header py-0">
          <div class="card-header-flex align-items-center">
            <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
              <h5 class="mb-0">
                <div class="vb__utils__heading">
                  <strong>
                    {{ title }}
                  </strong>
                </div>
              </h5>
            </div>
            <div>
              <span v-if="checkControl_id != 'new'">
                <button
                  :class="{ disabled: loading }"
                  v-if="disabled"
                  type="button"
                  @click="() => (disabled = false)"
                  class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
                >
                  <span class="btn-addon">
                    <i class="btn-addon-icon fas fa-edit" />
                  </span>
                  Edit
                </button>
                <button
                  :class="{ disabled: loading }"
                  v-else
                  type="button"
                  @click="() => (disabled = true)"
                  class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
                >
                  <span class="btn-addon">
                    <i class="btn-addon-icon fas fa-eye" />
                  </span>
                  View
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="card" v-if="checkControl_id && checkControl_id != 'null'">
        <div class="col-md-12 col-sm-12 col-xs-12 mt-3">
          <div class="card bg-light border-blue">
            <div class="card-header border-bottom pt-3 pb-3">
              <div class="text-uppercase text-dark font-weight-bold">
                <div class="vb__utils__heading">
                  <strong> Control Approval : </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body pt-0">
          <Steps :disabled="disabled" type="control" :target-id="checkControl_id" />
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <vb-forms-CheckControl :data="{ checkControl_id }" :disabled="disabled" />
        </div>
      </div>

      <!-- <div className="d-flex align-items-start">
        <div className="card card-top card-top-primary card-skip flex-grow-1">
          <div className="card-header border-bottom">
            <h5>
              <div class="vb__utils__heading">
                <strong> Command test </strong>
              </div>
            </h5>
          </div>
          <div className="card-body">
            <br />
            <a-form label-align="left" layout="vertical" @finish="onSubmit">
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Command">
                    <a-textarea
                      placeholder="Command..."
                      :disabled="disabled"
                      v-model:value="control.validation_cmd"
                      :rows="4"
                    />
                  </a-form-item>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <a-form-item label="Result">
                    <a-textarea
                      placeholder="Result..."
                      :disabled="disabled"
                      v-model:value="control.validation_result"
                      :rows="4"
                    />
                  </a-form-item>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-7">
                  <a-form-item label="IP address">
                    <a-input
                      v-model:value="control.validation_ip"
                      :disabled="disabled"
                      placeholder="IP address"
                    />
                  </a-form-item>
                </div>
                <div class="col-lg-5">
                  <a-form-item>
                    <button
                      type="button"
                      @click="onExecute()"
                      :disabled="disabled"
                      class="btn btn-primary pull-right"
                      style="margin-top: 30px"
                    >
                      Test command
                    </button>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
        </div>
      </div> -->
    </div>

    <div v-show="visible" class="col-md-4" style="position: sticky; top: 70px; height: 100%" >
        <div className="d-flex align-items-start">
          <div className="card card-top card-top-primary card-skip flex-grow-1">
            <div className="card-header border-bottom">
              <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
                <h5 class="mb-0">
                  <div class="vb__utils__heading">
                    <strong> Control details </strong>
                  </div>
                </h5>
              </div>
            </div>
            <div className="ml-3 mt-2 mb-4 mr-1 p-3">
              <NistControlDetails :nist-control="record" :framework="selectedFramework" />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { toRaw, computed, ref } from 'vue'
import VbFormsCheckControl from '@/@vb/widgets/Forms/CheckControl'
import { useStore } from 'vuex'
import NistControlDetails from '@/@vb/components/NistControlDetails'
import Steps from '@/@vb/components/Steps'
import { useRoute, useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'

export default {
  name: 'VbProfile',
  components: {
    VbFormsCheckControl,
    NistControlDetails,
    Steps,
  },
  setup() {},
  data() {
    const router = useRouter()

    const route = useRoute()
    const routeDetails = computed(() => route)
    const disabled = routeDetails.value.params.id == 'new' ? ref(false) : ref(true)

    let title = computed(() =>
      routeDetails.value.params.id == 'new' ? 'New Check control' : 'Check control details',
    )
    let checkControl_id = computed(() => routeDetails.value.params.id)

    if (
      routeDetails.value.params.id == 'null' &&
      typeof routeDetails.value.query.control_number === 'undefined'
    ) {
      router.push({
        path: '/system-sections/framework-controls',
      })
    }

    let selectedFramework = computed(() => store.getters['user/selectedFramework'])

    const store = useStore()
    let control = computed(() => store.getters['checkControls/checkControls'].control)
    if (selectedFramework.value == 'NIST80053R4') {
      var record = computed(() => store.getters['checkControls/checkControls'].NIST80053R4Control)
    } else if (selectedFramework.value == 'NIST80053R5') {
      var record = computed(() => store.getters['checkControls/checkControls'].NIST80053R5Control)
    } else {
      var record = computed(() => store.getters['checkControls/checkControls'].NIST800171R2Control)
    }

    const onExecute = () => {
      store
        .dispatch('STIGs/EXECUTE_COMMAND', {
          payload: {
            ip: toRaw(control).value.validation_ip,
            cmd: toRaw(control).value.validation_cmd,
          },
        })
        .then(() => {
          toRaw(control).value.validation_result = computed(
            () => store.getters['STIGs/STIGs'].commandExecuteResult,
          )
          notification.success({
            message: 'Execute command',
            description: 'Command successfully executed!',
          })
        })
    }

    return {
      onExecute,
      title,
      control,
      record,
      disabled,
      checkControl_id,
      selectedFramework,
      visible: true,
    }
  },
}
</script>
<style>
.float{
	width: 32px;
  height: 32px;
  border-radius: 50%;
  /* box-shadow: 2px 2px 3px #999; */
  position: fixed;
  top: 165px;
  right: 30px;
  text-align: center;
  background-color: #c8c4db;
  z-index: 10;
}
.my-float{
	margin-top:10px;
}
</style>