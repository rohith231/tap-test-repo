<template>
  <div class="card-header-flex align-items-center">
    <div class="d-flex flex-column flex-grow-1 justify-content-center mr-auto">
      <h5 class="mb-0">
          <div class="vb__utils__heading">
            <strong>
              {{ data.title }}
            </strong>
          </div>
      </h5>
    </div>
        <div   >
       <span>
        <!-- <a-input class="mr-2 float-left" placeholder="Search..." v-model:value="value" style="width: 200px" >
          <template #suffix>
            <a-tooltip title="Search">
              <i class="fe fe-search" />
            </a-tooltip>
          </template>
        </a-input> -->
        <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"   >
          <!-- <div :class="$style.divider" class="mr-2" /> -->
            <button
            @click="addNew"
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add Settings
            </button>
        </div>
      
      </span>
    </div>
  </div>
</template>

<script>
  import {
    ref,
    watch
  } from 'vue'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: "",
        }
      },
    },
  },
 emits: ['add-new','search'],
 setup(props, { emit }) {

      const value = ref('');
      watch(value, (searchValue) => emit('search', searchValue))
    const addNew = () => {
      emit('add-new')
    };

    return {
      value,
      addNew
    }
  }
}
</script>


<style lang="scss" module>
@import './style.module.scss';
</style>
