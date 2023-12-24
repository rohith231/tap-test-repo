<template>
  <div>
    <div class="row">
      <div class="col-md-12">
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
                <span v-if="system_id != 'new' ">
                  <button
                    :class="{'disabled':loading}" v-if="disabled " type="button" @click="() => disabled = false"
                    class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm">
                    <span class="btn-addon">
                      <i class="btn-addon-icon fas fa-edit" />
                    </span>
                    Edit
                  </button>
                  <button
                    :class="{'disabled':loading}" v-else type="button" @click="() => disabled = true"
                    class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm">
                    <span class="btn-addon">
                        <i class="btn-addon-icon fas fa-eye" />
                    </span>
                    View
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div class="card-body">
            <vb-forms-system :data="{ system_id }" :disabled="disabled" />

          </div>
      
        </div>

        <div class="card" v-if="system_id && system_id != 'null' && system_id != 'new' ">
        <div class="col-md-12 col-sm-12 col-xs-12 mt-3">
          <div class="card  bg-light border-blue">
            <div class="card-header border-bottom pt-3 pb-3">
              <div class="text-uppercase text-dark font-weight-bold">ATO approval :</div>
            </div>
          </div>
        </div>
        <div class="card-body pt-0" >
            <Steps :disabled="disabled" type="ato"  :target-id="system_id"/>
        </div>
      </div>
      </div>
    </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed,ref } from 'vue'
import VbFormsSystem from '@/@vb/widgets/Forms/system'
import Steps from '@/@vb/components/Steps'

export default {
  name: 'VbProfile',
  components: {
    VbFormsSystem,
    Steps

  },
  setup() {
     
  },
  data() {
    const route = useRoute();
    const routeDetails = computed(() => route);
    const disabled = routeDetails.value.params.id == 'new' ?  ref(false) : ref(true);
    let title = computed(() => routeDetails.value.params.id == 'new' ?  'New System' :  'System details')
    let system_id = computed(() => routeDetails.value.params.id)




    return {
      title,
      disabled,
      system_id
      
    }

  }
}
</script>
