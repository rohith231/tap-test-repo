import apiClient from '@/services/axios';

const apiPrefix = '/notifications';
export default {
  namespaced: true,
  state: {
    list: [],
    pages: 0,
    total: 0,
    unReadCount: 0
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
      const {pageNumber = 1, itemsPerPage = 10} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, total: result.count, unReadCount: result.unReadCount})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD_ACTION({commit, rootState}, {payload}) {
      const {action, notifications} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/action`, {action, notifications}).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD_MESSAGE({commit, rootState}, {payload}) {
      const {type, systemsArr, groupArr, usersArr, ...data} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/messages`, {type, systemsArr, groupArr, usersArr, ...data}).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    unReadCount: (state) => state.unReadCount,
    list: (state) => state.list,
    total: (state) => state.total,
  },
}
