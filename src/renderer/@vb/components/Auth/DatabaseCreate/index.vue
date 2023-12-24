/* eslint-disable vue/script-setup-uses-vars */
<template>
  <div class="card card-top card-top-primary" :class="$style.container">
    <div class="text-dark font-size-18 mb-3">
      Database Configuration
      <a-button
        type="primary"
        size="small"
        class="mr-3 mb-3 pull-right"
        :disabled="loading"
        @click="$emit('back')"
        >Back</a-button
      >
    </div>

    <!-- <div class="mb-4">
      <p>PostgreSQL connection setting</p>
    </div> -->

    <a-form
      id="database-form"
      ref="databaseForm"
      :model="formState"
      :rules="rules"
      label-align="left"
      layout="vertical"
    >
      <div class="row">
        <div class="col-6">
          <a-form-item required label="Host:" name="host">
            <a-input v-model:value="formState.host" />
          </a-form-item>
        </div>
        <div class="col-6">
          <a-form-item label="Port:" name="port">
            <a-input v-model:value="formState.port" />
          </a-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <a-form-item required label="Username :" name="username">
            <a-input v-model:value="formState.username" />
          </a-form-item>
        </div>
        <div class="col-6">
          <a-form-item required label="Password :" name="password">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <a-form-item required label="Database :" name="database">
            <a-input v-model:value="formState.database" />
          </a-form-item>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center">
          <a-button @click="resetForm" type="link" class="mr-3 mb-3" :disabled="loading"
            >Reset</a-button
          >
          <a-button
            @click="submit"
            type="primary"
            class="mr-3 mb-3"
            :disabled="loading"
            :loading="loading"
            >Create Database</a-button
          >
        </div>
      </div>
    </a-form>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
let connectionLoading = ref(false),
  testConnectionLoading = ref(false)

export default {
  name: 'VbDatabase',
  emits: ['back'],
  setup() {
    const store = useStore()

    const loading = computed(() => store.getters['database/loading'])

    const hasConnection = computed(() => store.getters['database/hasConnection'])

    const databaseForm = ref({})
    const formState = reactive({
      host: store.getters['database/DBHost'] ? store.getters['database/DBHost'] : 'localhost',
      username: store.getters['database/DBUsername']
        ? store.getters['database/DBUsername']
        : 'postgres',
      password: store.getters['database/DBPassword'] ? store.getters['database/DBPassword'] : '',
      database: store.getters['database/DBName'] ? store.getters['database/DBName'] : '',
      port: store.getters['database/DBPort'] ? store.getters['database/DBPort'] : '5432',
    })

    const rules = {
      host: [{ required: true, message: 'Host is required', trigger: 'change' }],
      username: [{ required: true, message: 'Username is required', trigger: 'change' }],
      password: [{ required: true, message: 'Password is required', trigger: 'change' }],
      database: [{ required: true, message: 'Database is required', trigger: 'change' }],
      port: [{ required: false }],
    }

    const submit = () => {
      formState.operation = 'set'
      databaseForm.value.validate()
      if (formState.host && formState.username && formState.password && formState.database) {
        store.dispatch('database/DATABASE_CREATE', { payload: formState }).then((response) => {
          if (response && hasConnection.value) {
            router.push('/system-sections/dashboard')
          }
        })
      }
    }

    const resetForm = () => {
      formState.host = null
      formState.username = null
      formState.password = null
      formState.database = null
      formState.port = null
    }
    const testConnection = async () => {
      databaseForm.value.validate()
      formState.operation = 'test'
      if (formState.host && formState.username && formState.password && formState.database) {
        store.dispatch('database/DATABASE_CREATE', { payload: formState })
      }
    }
    const tryDemo = () => {
      resetForm()
      formState.host = store.getters['database/demoDBHost']
      formState.username = store.getters['database/demoDBUsername']
      formState.password = store.getters['database/demoDBPassword']
      formState.database = store.getters['database/demoDBName']
      formState.port = store.getters['database/demoDBPort']
      databaseForm.value.validate()
    }

    return {
      loading,
      connectionLoading,
      testConnectionLoading,
      rules,
      formState,
      databaseForm,
      submit,
      testConnection,
      resetForm,
      tryDemo,
    }
  },
}
</script>

<style lang="scss" module>
@import '@/@vb/components/Auth/style.module.scss';

.container {
  max-width: rem(950);
  min-width: rem(950);
}
.card-top {
  border-radius: 8px !important;
}
</style>
