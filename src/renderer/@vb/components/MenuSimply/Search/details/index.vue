<template>
  <a-row type="flex">
    <a-col v-for="(item, index) in data" :key="index" flex="2">
      <div :class="$style.resultContent">
        <div
          :class="$style.resultThumb"
          :style="{
            backgroundImage: 'url(\'resources/images/content/photos/1.jpeg\')',
          }"
        >
          #{{ index + 1 }}
        </div>
        <div :class="$style.result">
          <div :class="$style.resultText">
            {{ item.resultText }}
          </div>
          <div :class="$style.resultSource">
            <span
              v-if="model != 'systems'"
              @click="openTab(`/${model}/profile/${item.resultID}`)"
              class="vb__utils__link"
            >
              {{ item.resultSource }}
              <i class="fe fe-arrow-right mr-1 align-middle" />
            </span>

            <router-link
              v-else
              :to="`/systems/profile/${item.resultID}`"
              class="vb__utils__link"
              @click="hideSearch"
            >
              {{ item.resultSource }}
              <i class="fe fe-arrow-right mr-1 align-middle" />
            </router-link>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>

  <a-row type="flex">
    <a-col flex="6">
      <span v-if="model != 'systems'" @click="openTab(`/${model}`)" class="vb__utils__link">
        Go to {{ model }} list
        <i class="fe fe-arrow-right mr-1 align-middle" />
      </span>

      <router-link
        v-else
        :to="`/systems`"
        class="vb__utils__link"
        @click="hideSearch"
      >
        Go to {{ model }} list
        <i class="fe fe-arrow-right mr-1 align-middle" />
      </router-link>
    </a-col>
  </a-row>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {},
  setup() {
    const store = useStore()
    let data = computed(() => store.getters['search/list'])
    let model = computed(() => store.getters['search/model'])

    return {
      data,
      model,
    }
  },
  methods: {
    openTab(url) {
      this.emitter.emit('open-new-tab', {
        url,
      })
    },
    hideSearch() {
      this.emitter.emit('hide-search')
    },
  },
}
</script>

<style lang="scss" module>
@import '../style.module.scss';
</style>
