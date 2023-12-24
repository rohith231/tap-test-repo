import router from '@/router'
import { notification } from 'ant-design-vue'
import {login, currentAccount, logout} from '@/services/jwt'
import { encryptStorage } from '@/utils'

export default {
  namespaced: true,
  state: {
    loading_user_data: false,
    id: '',
    mobile_number: ',',
    display_name: '',
    role: '',
    email: '',
    avatar: '',
    authorized: false,
    fetchLoading: false,
    accountFetchIsTouched: false,
    Roles: [],
    Systems: [],
    selectedSystem: encryptStorage.getItem(`selectedSystem`),
    selectedFramework: encryptStorage.getItem(`selectedFramework`),
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    LOGIN({ commit, dispatch, rootState }, { payload }) {
      const { username, password } = payload

      commit('SET_STATE', {
        fetchLoading: true,
      })

      login(username, password).then(response => {

        if (response && response.statusCode == 200) {
          commit('SET_STATE', {
            id: response.result.user.id,
            display_name: response.result.user.display_name,
            email: response.result.user.email,
            mobile_number: response.result.user.mobile_number,
            Roles: response.result.user.Roles,
            Systems: response.result.user.Systems,
            authorized: true,
            selectedSystem: encryptStorage.getItem(`selectedSystem`),
            selectedFramework: encryptStorage.getItem(`selectedFramework`),
          })

          dispatch('organization/GET', { payload: {} }, { root: true })
            .then(() => {
              notification.success({
                message: 'Logged In',
                description: 'You have successfully logged in!',
              })

              router.push('/system-sections/dashboard')
            })
            .catch(e => {
              notification.error({
                message: 'Connection Error',
                description: '',
              })
            })

        }

        commit('SET_STATE', {
          fetchLoading: false,
        })
      })
    },
    async  LOAD_CURRENT_ACCOUNT({ commit, rootState }) {
      commit('SET_STATE', {
        fetchLoading: false,
        loading_user_data: true,

      })
  

      let response = await currentAccount()

     
        if (response && response.statusCode == 200) {
          commit('SET_STATE', {
            id: response.result.id,
            display_name: response.result.display_name,
            mobile_number: response.result.mobile_number,
            email: response.result.email,
            Roles: response.result.Roles,
            Systems: response.result.Systems,
            authorized: true,
            selectedSystem: encryptStorage.getItem(`selectedSystem`),
            selectedFramework: encryptStorage.getItem(`selectedFramework`),
          })
          
  
        }
        commit('SET_STATE', {
          fetchLoading: false,
          loading_user_data: false,

        })

        return response
 
      
    },
    LOGOUT({ commit, rootState }) {
      
      logout().then(() => {
        router.push('/auth/login')
        encryptStorage.clear();
        commit('SET_STATE', {
          id: '',
          username: '',
          roles: '',
          email: '',
          avatar: '',
          authorized: false,
          fetchLoading: false,
        })

        commit('organization/SET_STATE', {
          organization: null,
          id: null,
          logo: null,
          name: null,
          zip_code: null,
          address1: null,
          address2: null,
          primary_color: null,
          accent_color: null,
          secondary_color: null,
          description: null,
          state: null,
          city: null,
          logo: null,
        },{root:true})
      })
    },
  },
  getters: {
    user: state => state,
    Systems: state => state.Systems,
    fetchLoading: state => state.fetchLoading,
    selectedSystem: state => state.selectedSystem,
    selectedFramework: state => state.selectedFramework,
  },
}
