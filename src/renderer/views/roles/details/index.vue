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
                <span v-if="role_id != 'c32e3cc0-f20f-11ea-8fd0-bdb301126903' && role_id != 'new' ">
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
            <vb-forms-role :data="{ role_id }" :disabled="disabled" />
          </div>

        </div>
      </div>
    </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import VbFormsRole from '@/@vb/widgets/Forms/role'

export default {
  name: 'VbProfile',
  components: {
    VbFormsRole,
  },
  setup() {
     
  },
  data() {
    const route = useRoute();
    const routeDetails = computed(() => route);
    const disabled = routeDetails.value.params.id == 'new' ?  ref(false) : ref(true);
    let title = computed(() => routeDetails.value.params.id == 'new' ?  'New role profile' :  'Role profile details')
    let role_id = computed(() => routeDetails.value.params.id)



    return {
      title,
      disabled,
      role_id
      
    }

  }
}
</script>
