import apiClient from '@/services/axios';
import { notification } from 'ant-design-vue'

const apiPrefix = '/ips';
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    ip: null
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_ALL({ commit, rootState }, { payload }) {
      const { system_id, pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = '' } = payload;

      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      apiClient.get(`${apiPrefix}/system?system_id=${system_id}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { list: result.rows, count: result.count })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      })
    },
    GET_BY_ID({ commit, rootState }, { payload }) {
      const { id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { ip: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      })
    },
    ADD({ commit, rootState }, { payload }) {
      const data = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });

      apiClient.post(`${apiPrefix}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { ip: result });
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      })
    },
    UPDATE({ commit, rootState }, { payload }) {
      const { id, ...data } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'IP updated',
            description: 'IP successfully updated!',
          })
          commit('SET_STATE', { ip: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      })
    },
    DELETE({ commit, rootState }, { payload }) {
      const { id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'IP deleted',
            description: 'IP successfully deleted!',
          })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      })
    }

  },
  getters: {
    ip: (state) => state,
  },
}
