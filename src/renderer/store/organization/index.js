import {encryptStorage} from '@/utils'
import {database_connection} from '@/services/APIs/database'
import {notification} from 'ant-design-vue'
import apiClient from "@/services/axios";

const apiPrefix = '/organizations';

export default {
  namespaced: true,
  state: {
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
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    async GET ({ commit, rootState }, { payload }) {
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      const response = await apiClient.get(`${apiPrefix}`)
      const { result, statusCode } = response.data
      if (statusCode == 200) {
        commit('SET_STATE', {
          organization: result,
          id: result.id,
          name: result.name,
          logo: result.logo,
          zip_code: result.zip_code,
          address1: result.address1,
          address2: result.address2,
          primary_color: result.primary_color,
          accent_color: result.accent_color,
          secondary_color: result.secondary_color,
          description: result.description,
          state: result.state,
          city: result.city,
          logo: result.logo,
        })
      } else {
        throw new Error('Failed to load organization')
      }

      commit('user/SET_STATE', { fetchLoading: false }, { root: true })
    },
    GET_ONE({commit, rootState}, {payload}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {organization: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    UPDATE({commit, rootState}, {payload}) {
      const {id, ...data} = payload;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.put(`${apiPrefix}/${id}`, {org_data: data}).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', payload)
          notification.success({
            message: 'Success',
            description: 'Organization Updated Successfully',
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },

  },
  getters: {
    organization: (state) => state,
  },
}
