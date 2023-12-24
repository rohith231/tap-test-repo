<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
      
        <div class="card card-top card-top-primary">
          <div class="card-header"><vb-headers-card-header :data="{ title: 'Interrogator' }" /></div>
          <div class="card-body"><vb-forms-interrogator /></div>
       
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import VbFormsInterrogator from '@/@vb/widgets/Forms/interrogator'


export default {
  name: 'VbFormExamples',
  components: {
    VbHeadersCardHeader,
    VbFormsInterrogator,
  },
}
</script>
