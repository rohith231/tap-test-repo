import apiClient from '@/services/axios';

const apiPrefix = '/auth';

export default {
  namespaced: true,
  state: {
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {...payload})
    },
  },
  actions: {
        
    CLEAR_CACHE({commit, rootState}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}/clear-cache`).then(response => {
        return {result, statusCode} = response.data
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    }
  },
  getters: {
  },
}
