<template>
  <div>
    <div class="row">
        <div class="col-md-6">
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
                <span v-if="vuln_id != 'new' ">
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
            <vb-forms-command :data="{ vuln_id }" :disabled="disabled" />
          </div>

        </div>
          </div>
          <div class="col-md-6">
            <div class="card">
            
                <div className="mb-5">
              <h5 className="m-4">
                <strong> {{vulnerability.vuln_num}} Details</strong>
              </h5>
              <table className="table table-hover" style="table-layout: fixed; white-space: inherit;">
                <tbody>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Vuln number</code>
                    </td>
                    <td>
                      {{vulnerability.vuln_num}}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Severity</code>
                    </td>
                    <td>
                      {{vulnerability.severity}}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Rule ver</code>
                    </td>
                    <td>{{vulnerability.rule_ver}}</td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Rule id</code>
                    </td>
                    <td>{{vulnerability.rule_id}}</td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Rule title</code>
                    </td>
                    <td>{{vulnerability.rule_title}}</td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Stig ref</code>
                    </td>
                    <td>{{vulnerability.stig_ref}}</td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>ia controls</code>
                    </td>
                    <td>{{vulnerability.ia_controls}}</td>
                  </tr>
                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>vuln discuss</code>
                    </td>
                    <td>{{vulnerability.vuln_discuss}}</td>
                  </tr>

                  <tr>
                    <td className="text-nowrap" style="width: 150px;">
                      <code>Check content</code>
                    </td>
                    <td>{{vulnerability.check_content}}</td>
                  </tr>
                </tbody>
              </table>
            
            </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed,ref } from 'vue'
import VbFormsCommand from '@/@vb/widgets/Forms/command'
import { useStore } from 'vuex'

export default {
  name: 'VbProfile',
  components: {
    VbFormsCommand,

  },
  setup() {
     
  },
  data() {
    const route = useRoute();
    const routeDetails = computed(() => route);
    const disabled = routeDetails.value.params.id == 'new' ?  ref(false) : ref(true);
    let title = computed(() => routeDetails.value.params.id == 'new' ?  'New Command' :  'Command details')
    let vuln_id = computed(() => routeDetails.value.params.vuln_id)
    let type = computed(() => routeDetails.value.params.type)
    var vulnerability
    const store = useStore()
    if(type.value == 'STIGs'){
        vulnerability = computed(() => store.getters['STIGs/STIGs'].vulnerability)
        store.dispatch('STIGs/VULNERABILITY',{payload:{vuln_id : vuln_id.value}})
    }else{
        vulnerability = computed(() => store.getters['deviations/deviations'].vulnerability)
        store.dispatch('deviations/VULNERABILITY',{payload:{vuln_id : vuln_id.value}})
    }
  




    return {
      title,
      vulnerability,
      disabled,
      vuln_id
      
    }

  }
}
</script>
