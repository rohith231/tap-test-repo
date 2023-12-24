<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
      
        <div class="card card-top card-top-primary">
          <div class="card-header"><vb-headers-card-header :data="{ title: 'License' }" /></div>
          <div class="card-body"><vb-forms-7 /></div>
       
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import VbForms7 from '@/@vb/widgets/Forms/7'


export default {
  name: 'VbFormExamples',
  components: {
    VbHeadersCardHeader,
    VbForms7,
  },
}
</script>
