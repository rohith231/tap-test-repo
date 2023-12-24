<template>
  <div class="mt-5 pt-2">
    <div class="card" :class="$style.container">
      <div class="text-dark font-size-32 mb-3">Sign In</div>
      <a-form
        :model="loginForm"
        :rules="rules"
        layout="vertical"
        class="mb-4"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item name="username">
          <a-input v-model:value="loginForm.username" placeholder="Username" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="loginForm.password"
            placeholder="Password"
            type="password"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          class="text-center w-100"
          :disabled="loading"
          :loading="loading"
        >
          <strong>Sign in</strong>
        </a-button>
      </a-form>
    </div>
  </div>
</template>
<script>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'VbLogin',
  setup() {
    const store = useStore()
    const applicationSettings = computed(() => store.getters.applicationSettings)
    const loading = computed(() => store.getters['user/fetchLoading'])
    const rules = {
      username: [
        {
          required: true,
          message: 'Please input your username!',
          trigger: 'change',
        },
      ],
      password: [{ required: true, message: 'Please input password!', trigger: 'change' }],
    }
    const loginForm = reactive({
      username: '',
      password: '',
    })

    const changeAuthProvider = (value) => {
      store.commit('CHANGE_SETTING', { setting: 'authProvider', value })
    }
    const handleFinish = (values) => {
      store.dispatch('user/LOGIN', { payload: values })
    }
    const handleFinishFailed = (errors) => {
      console.error(errors)
    }

    return {
      applicationSettings,
      loading,
      rules,
      loginForm,
      changeAuthProvider,
      handleFinish,
      handleFinishFailed,
    }
  },
  // data: function () {
  //   return {
  //     rules: {
  //       username: [{ required: true, message: 'Please input your username!', trigger: 'change' }],
  //       password: [{ required: true, message: 'Please input password!', trigger: 'change' }],
  //     },
  //     loginForm: {
  //       username: 'demo@visualbuilder.cloud',
  //       password: 'VisualBuilder',
  //     },
  //   }
  // },
  // computed: {
  //   ...mapState(['settings']),
  //   loading() {
  //     return this.$store.state.user.loading
  //   },
  // },
  // methods: {
  //   changeAuthProvider(value) {
  //     this.$store.commit('CHANGE_SETTING', { setting: 'authProvider', value })
  //   },
  //   handleFinish(values) {
  //     this.$store.dispatch('user/LOGIN', { payload: values })
  //   },
  //   handleFinishFailed(errors) {
  //     console.log(errors)
  //   },
  // },
}
</script>
<style lang="scss" module>
@import '@/@vb/components/Auth/style.module.scss';
</style>
