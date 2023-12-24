import apiClient from '@/services/axios';

const apiPrefix = '/interrogators';
export default {
  namespaced: true,
  state: {
    list: [],
    interrogator: {}
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET({commit, rootState}, {payload}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result,interrogator:result[0]})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    UPDATE({commit, rootState}, {payload}) {
      const {id, ...data} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    }
  },
  getters: {
    interrogator: (state) => state,
  },
}
