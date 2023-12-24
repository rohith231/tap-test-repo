import apiClient from '@/services/axios';
import { notification } from 'ant-design-vue'
import router from '@/router'
import { encrypt64, decrypt64 } from '~/encryption'

const apiPrefix = '/license';
export default {
  namespaced: true,
  state: {
    license:{},
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    SET_TYPE( { commit, dispatch }, {payload}) {
      commit('SET_STATE', { os_type: payload })
    },
    SET_CATEGORY( { commit, dispatch }, {payload}) {
      commit('SET_STATE', { category_id: payload })
    },
    GET_BY_ID({commit, rootState}, {payload}) {
      const {} = payload;
     // console.log("payload", payload)
        commit('SET_STATE', { license:{}})
      
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
         
          commit('SET_STATE', {license: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      console.log("payload", payload)
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        console.log(result)
        if (statusCode == 200) {
          //router.push(`/device/profile/${result.id}`)
          notification.success({
            message: `Successfully added the license`,
            description: ``,
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    license: (state) => state,
  },
}
