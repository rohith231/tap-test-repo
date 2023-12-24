<template>
  <div>
    <div 
      @click="openTab('/users/list')"
      class="header_btn_type1"
    >
      Administration
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getMenuData } from '@/services/menu'

export default {
  setup() {
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const menuData = computed(() => getMenuData)

    return {
     applicationSettings,
      menuData,
    }
    
  },
  methods: {
    openTab(url) {
      console.log('url', url);
      this.emitter.emit("open-new-tab", {
          url
      });
    },
    }
}
</script>

<style>
.header_btn_type1 {
  background-color: #232135;
  color: #a1a1c2;
  padding-top: 0.66rem;
  padding-bottom: 0.66rem;
  padding-right: 26px;
  padding-left: 26px;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.header_btn_type1:hover {
  background-color: #f2f4f8;
  color: #595c97;
}
</style>
