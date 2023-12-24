<template>
  <div>
    <div class="mb-4">
      <a-input v-model:value="search"  placeholder="Search systems...">
        <template #prefix>
          <span>
            <search-outlined  style="color: rgba(0, 0, 0, 0.25)" />
          </span>
        </template>
      </a-input>
    </div>
    <div>
      <div v-for="(system, index) in filteredStories" :key="system.id">
        <a
          class="d-flex flex-nowrap align-items-center"
          :class="{
            [$style.item]: true,
            [$style.current]: index === activeIndex,
          }"
          @click="setActiveItem(index),passEvent(system)"
        >
          <a-avatar shape="square" size="large" :class="$style.avatar" class="vb__utils__avatar vb__utils__avatar--size27 mr-3 flex-shrink-0" >
              {{ system.name ? system.name.charAt(0).toUpperCase() : ''}}
           </a-avatar>
          <div :class="$style.info" class="flex-grow-1">
            <div class="text-uppercase font-size-12 text-truncate text-gray-6">
              {{ system.identifier }}
            </div>
            <div class="text-dark font-size-18 font-weight-bold text-truncate">
              {{ system.name }}
            </div>
          </div>
          <div v-if="system.abbreviation" :class="$style.unread" class="flex-shrink-0 align-self-start">
            <div class="badge badge-default">{{ system.abbreviation }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'

export default {
  name: 'VbList22',
  components: {
    SearchOutlined,
  },
  emits: ['changeSystem'],
 setup(props, { emit }) {
    const store = useStore()
    const activeIndex = ref(-1)
    const  passEvent = (data) => {
      emit('changeSystem',data) 
    }
    const setActiveItem = index => {
      activeIndex.value = index
    }
    let search = ref('')
    const filteredStories =  computed(() => {
      let filteredStories = store.getters['user/Systems'].filter((system) => {
        return system.name.toLowerCase().includes(search.value);
      })
     
      let orderedStories = filteredStories.sort((a, b) => {
        return b.name - a.name;
      })
      return orderedStories;
    })

 
    return {
      search,
      filteredStories,
      activeIndex,
      passEvent,
      setActiveItem,
    }
  },

}
</script>
<style lang="scss" module>
@import './style.module.scss';
</style>
