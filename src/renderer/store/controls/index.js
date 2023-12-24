import apiClient from '@/services/axios'
const apiPrefix = '/nist'
export default {
  namespaced: true,
  state: {
    loading: false,
    list_NIST800171R2: [],
    list_NIST80053R4: [],
    list_NIST80053R5: [],
    count_NIST800171R2: [],
    count_NIST80053R4: [],
    count_NIST80053R5: [],
  },
  mutations: {
    SET_STATE (state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_CONTROLS ({ commit, rootState }, { payload }) {

      const { framework, pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = '' } = payload;
      commit('user/SET_STATE', {
        fetchLoading: true,
      }, { root: true })
      commit('SET_STATE', { loading: true, })
      apiClient
        .get(`${apiPrefix}/controllers?framework=${framework}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`)
        .then(response => {
          const { result, statusCode } = response.data
          if (statusCode == 200) {
            let data = {}
            data[`list_${framework}`] = result.rows
            data[`count_${framework}`] = result.count
            commit('SET_STATE', data)
          }
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, { root: true })
          commit('SET_STATE', { loading: false })

        }).catch(err => {
          commit('SET_STATE', { loading: false })
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, { root: true })
        })
    },
  },
  getters: {
    controls: (state) => state,
    loading: (state) => state.loading,
  },
}
