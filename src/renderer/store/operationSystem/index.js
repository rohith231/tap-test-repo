import apiClient from '@/services/axios';

const apiPrefix = '/os';
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    os: null
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
      const {pageNumber, itemsPerPage, query_search, sortKey, descSort} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, count: result.count})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_BY_ID({commit, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {os: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {os: result})
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
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {os: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    DELETE({commit, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
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
    notification: (state) => state,
  },
}
