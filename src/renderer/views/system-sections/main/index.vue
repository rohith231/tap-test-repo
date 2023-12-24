<template>
 <a-layout>
    <a-layout-header>
      <system-sections />
    </a-layout-header>
    <a-layout-content class="vb__layout__content">
          <POAMs  v-if="current == 'POA&Ms'" />
          <Compliance  v-if="current == 'Compliance'" />
          <Devices  v-if="current == 'Devices'" />
          <IPRanges  v-if="current == 'IP Ranges'" />
          <SSP v-if="current == 'System Security Plan'" />
          <Inheritance  v-if="current == 'Inheritance'" />
          <CustomControls  v-if="current == 'Custom Controls'" />
          <FrameworkControls  v-if="current == 'Framework controls'" />
          <Assessment  v-if="current == 'Assessment'" />
    </a-layout-content>
  </a-layout>
</template>

<script>
import SystemSections  from '../index'
import POAMs  from '../POA&Ms'
import Compliance  from '../Compliance'
import Devices  from '../Devices'
import IPRanges  from '../IPRanges'
import Inheritance  from '../Inheritance'
import CustomControls  from '../CustomControls'
import FrameworkControls  from '../FrameworkControls'
import Assessment from '../Assessment'
import SSP  from '../SSP'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Vbmain',
 
  components: {
        SystemSections,
        POAMs,
        Compliance,
        Inheritance,
        FrameworkControls,
        CustomControls,
        Devices,
        SSP,
        IPRanges,
        Assessment
  },
  setup() {
    const route = useRoute()
    const current = computed(() => route.meta.title)
  
    return {
      current
    }
  },
  data() {
    return {}
  },
  methods:{}
}
</script>



<style lang="scss" module>
@import './style.module.scss';

</style>

<style scoped>
.ant-menu-root {
    justify-content: space-evenly;
    text-align: center;
    margin: 0 auto;
    background-color: transparent;
    margin-left: -75px;
}
</style>


