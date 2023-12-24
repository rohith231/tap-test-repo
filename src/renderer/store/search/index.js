import apiClient from '@/services/axios'

export default {
  namespaced: true,
  state: {
    loading: false,
    query_search: '',
    model: '',
    prefix: '',
    list: [],
    count: 0,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    SEARCHING({ commit }, { payload }) {
      const { prefix, pageNumber = 1, itemsPerPage = 5, query_search = '', sortKey = '', descSort = '', includes = false} = payload;
      
      commit('SET_STATE', { query_search, prefix, model: prefix.toLowerCase(), loading: true });

      apiClient.get(`/${prefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}&search_attributes=${true}&includes=${includes}`).then(response => {
        const {result, statusCode} = response.data
        setTimeout(() => {
          if (statusCode == 200) {
            commit('SET_STATE', { list: result.rows, count: result.count, loading: false });
          }
        }, 1000);
      }).catch(err => {
        commit('SET_STATE', { loading: false });
      })
    },
    RESET({ commit }, { payload }) {
      commit('SET_STATE', { list: [], count: 0, prefix: '', model: '', query_search: '', loading: false });
    },
  },
  getters: {
    search: state => state,
    list: state => state.list,
    loading: state => state.loading,
    model: state => state.model,
    count: state => state.count,
  },
}
