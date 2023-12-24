import apiClient from '@/services/axios';

const apiPrefix = '/audit';
export default {
  namespaced: true,
  state: {
    audit: [],
    audit_loading: false,
  },
  mutations: {
    SET_STATE (state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_ALL ({ commit, rootState }, { payload }) {
      const { parent, control_id, user_id, framework } = payload

      commit('user/SET_STATE', {
        fetchLoading: true,
      }, { root: true })
      commit('SET_STATE', { audit_loading: true })
      apiClient.get(`${apiPrefix}?parent=${parent}&control_id=${control_id}&user_id=${user_id}&framework=${framework}`).then(response => {
        const { result, statusCode } = response.data
        commit('SET_STATE', { audit_loading: false })

        if (statusCode == 200) {
          commit('SET_STATE', {
            audit: result
          })
        }
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, { root: true })
      }).catch(err => {
        commit('SET_STATE', { audit_loading: false })

        commit('user/SET_STATE', {
          fetchLoading: false,
        }, { root: true })
      })
    },
    ADD_CONTROL ({ commit, rootState }, { payload }) {
      const { id, framework, ...data } = payload

      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      apiClient.post(`${apiPrefix}/control`, { id, framework, ...data })
        .then(response => {
          // const {result, statusCode} = response.data
          // if (statusCode == 200) {
          //   commit('SET_STATE', {stepper: result.rows})
          // }
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, { root: true })
        }).catch(err => {
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, { root: true })
        })
    },
    RESET ({ commit }) {
      commit('SET_STATE', {
        audit: []
      })
    }
  },
  getters: {
    audit: (state) => state,
  },
}
