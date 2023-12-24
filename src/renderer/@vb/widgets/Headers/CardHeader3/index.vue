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
    <div >
      <span>
        <a-input class="mr-2 float-left" placeholder="Search..." v-model:value="value" style="width: 200px" :loading="loading" v-if="searchable">
          <template #suffix>
            <a-tooltip title="Search">
              <i class="fe fe-search" />
            </a-tooltip>
          </template>
        </a-input>
        <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"   v-if="routeDetails.path == '/users/list' ">
          <div :class="$style.divider" class="mr-2" />
          <router-link to="/users/profile/new">
            <button
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add User
            </button>
          </router-link>
        </div>
        <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"   v-if="routeDetails.path == '/roles' ">
          <div :class="$style.divider" class="mr-2" />
          <router-link to="/roles/profile/new">
            <button
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add Role
            </button>
          </router-link>
        </div>
         <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"   v-if="routeDetails.path == '/systems' ">
          <div :class="$style.divider" class="mr-2" />
          <router-link to="/systems/profile/new">
            <button
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add system
            </button>
          </router-link>
        </div>
        <div :class="$style.amount" class="mr-3 ml-auto d-none d-sm-flex float-right mt-1"   v-if="routeDetails.path == '/system-sections/devices' ">
          <div :class="$style.divider" class="mr-2" />
          <router-link to="/device/category/new" style="margin-right: 5px;">
            <button
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add Category
            </button>
          </router-link>
          <router-link to="/device/profile/new">
            <button
              type="button"
              class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fas fa-plus" />
              </span>
              Add Target
            </button>
          </router-link>
        </div>
          <button
            v-if="editable && data.title != 'New User Profile'" :class="{'disabled':loading}"
            type="button"
            class="btn btn-primary btn-with-addon mr-auto text-nowrap d-none d-md-block btn-sm"
          >
            <span class="btn-addon">
              <i class="btn-addon-icon fas fa-edit" />
            </span>
            Edit user
          </button>
      </span>
      
    </div>
  </div>
</template>

<script>
  import {
    ref,
    watch,
    computed
  } from 'vue'
import { useRoute } from 'vue-router'

  export default {
    props: {
      editable: {
        type: Boolean,
        default: () => {
          return false
        },
      },
      searchable: {
        type: Boolean,
        default: () => {
          return true
        },
      },
      loading: {
        type: Boolean,
        default: () => {
          return false
        },
      },
      data: {
        type: Object,
        default: () => {
          return {
            title: 'With actions',
          }
        },
      },

    },
    emits: ['search'],
    setup(props, {
      emit
    }) {
      const route = useRoute()
      const routeDetails = computed(() =>route)
      const value = ref('');
      const confirmExport = () => {}
      watch(value, (searchValue) => emit('search', searchValue))

      return {
        routeDetails,
        confirmExport,
        value
      };
    },


  }

</script>

<style lang="scss" module>
@import './style.module.scss';
</style>
