<template>
  <div class="d-inline-block mr-4" @keydown.esc="closeSearch()">
    <a-input
      ref="outerInput"
      :class="$style.extInput"
      :placeholder="$t('topBar.typeToSearch')"
      style="width: 200px"
      @focus="openSearch"
    >
      <template #prefix>
        <span>
          <search-outlined style="color: rgba(0, 0, 0, 0.25)" />
        </span>
      </template>
    </a-input>
    <div :class="[$style.livesearch, showSearch ? $style.livesearchVisible : '']">
      <button :class="$style.close" type="button" @click="closeSearch">
        <i class="fe fe-x" />
      </button>
      <div class="container-fluid">
        <div :class="$style.wrapper">
          <input
            ref="innerInput"
            v-model="searchText"
            :class="$style.searchInput"
            :placeholder="$t('topBar.typeToSearch')"
            @input="onSearch"
          />
          <ul :class="$style.options">
            <li :class="$style.option"> <h4> Searching in {{ radio.toLowerCase() }}</h4></li>
            <li :class="[$style.option, $style.optionCheckbox]">
              <a-radio-group :options="radioOption" v-model:value="radio" />
            </li>
          </ul>
          <a-spin :spinning="loading"  size="large" :delay="500" tip="Searching in Database...">
          <div v-if="showSearch">
            <div v-if="count == 0 && !loading" :class="$style.results">
              <div :class="$style.resultsTitle">
                <span>No results found</span>
              </div>
            </div>
            <div v-else :class="$style.results">
              <div :class="$style.resultsTitle">
                <span>Results</span>
              </div>
              <Details />
            </div>
          </div>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Details from './details'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import useEmitter from '@/composables/useEmitter'

export default {
  components: {
    SearchOutlined,
    Details,
  },
  setup() {
    const store = useStore()
    const showSearch = ref(false)
    const searchText = ref('')
    const innerInput = ref(null)
    const radio = ref('Users')
    const radioOption = ['Users', 'Roles', 'Systems']
    const loading = computed(() => store.getters['search/loading'])
    const count = computed(() => store.getters['search/count'])
    let progress = ref(0)

    let timeout = null;

    const emitter = useEmitter()
    emitter.on('hide-search', data => {
      closeSearch();
    })

    const openSearch = () => {
      showSearch.value = true
      setTimeout(() => {
        innerInput.value.focus()
      }, 100)
    }

    const closeSearch = () => {
      showSearch.value = false
    }

    const onSearch = e => {

      clearTimeout(timeout);
      let reset = searchText.value == '';
      if (reset) { return store.dispatch('search/RESET', {}); }
      let query = searchText.value.toLowerCase() == 'all'? '':  searchText.value;

      timeout = setTimeout(() => {
        store.dispatch('search/SEARCHING', {
          payload: { query_search: query, prefix: radio.value.toLowerCase() },
        })
      }, 1000)
    }

    return {
      loading,
      showSearch,
      searchText,
      openSearch,
      closeSearch,
      innerInput,
      radioOption,
      radio,
      onSearch,
      count,
      progress,
    }
  },
}
</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
