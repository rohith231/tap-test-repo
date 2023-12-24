<template>
  <div>
    <div class="row">
      <div class="col-lg-12">
      
        <div class="card card-top card-top-primary">
          <div class="card-header"><vb-headers-card-header :data="{ title: 'Theme' }" /></div>
          <div class="card-body"><vb-forms-1 /></div>
       
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import VbHeadersCardHeader from '@/@vb/widgets/Headers/CardHeader'
import VbForms1 from '@/@vb/widgets/Forms/color-theme'


export default {
  name: 'VbFormExamples',
  components: {
    VbHeadersCardHeader,
    VbForms1,
  },
}
</script>
