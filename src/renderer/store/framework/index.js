import apiClient from '@/services/axios';

const apiPrefix = '/frameworks';
export default {
  namespaced: true,
  state: {
    list: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_ALL({commit, rootState}, {payload}) {
      const {group} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}?group=${group}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    }
  },
  getters: {
    framework: (state) => state,
  },
}
