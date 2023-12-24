import apiClient from '@/services/axios'
import { notification } from 'ant-design-vue'
import router from '@/router'

const apiPrefix = '/systems'
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    system: {
      Frameworks: []
    },
    system_credentials: [],
    approval_process: [],
    loading: false
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, { ...payload })
    },
  },
  actions: {
    GET_ALL({ commit, rootState }, { payload }) {
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      const { pageNumber, itemsPerPage, query_search, sortKey, descSort } = payload;
      apiClient.get(`${apiPrefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { list: result.rows, count: result.count });
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_BY_ID({ commit, rootState }, { payload }) {
      const { id } = payload;
      if (id == 'new') {
        commit('SET_STATE', { system: {} })
        return
      }
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { system: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    ADD({ commit, dispatch, rootState }, { payload }) {
      const { ssp, ...data } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          ssp.system_id = result.id
          ssp.Frameworks = data.Frameworks
          dispatch('ssp/CREATE_OR_UPDATE', {
            payload: {
              ...ssp,
            }
          }, { root: true }).then(() => {
            dispatch('user/LOAD_CURRENT_ACCOUNT', { payload: {} }, { root: true }).then(() => {

              notification.success({
                message: 'Information system successfully created',
                description: ``,
              })
              router.push(`/systems/profile/${result.id}`)
            })
          })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    UPDATE({ commit, dispatch, rootState }, { payload }) {
      const { id, ssp, ...data } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          ssp.Frameworks = data.Frameworks

          dispatch('ssp/CREATE_OR_UPDATE', {
            payload: {
              ...ssp,
            }
          }, { root: true }).then(() => {
            notification.success({
              message: 'Information system successfully updated',
              description: ``,
            })
            dispatch('user/LOAD_CURRENT_ACCOUNT', { payload: {} }, { root: true })
          })

        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    DELETE({ commit, dispatch, rootState }, { payload }) {
      const { id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'Information system successfully deleted',
            description: ``,
          })
          dispatch('user/LOAD_CURRENT_ACCOUNT', { payload: {} }, { root: true })

        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_SYSTEM_CREDENTIALS({ commit, rootState }, { payload }) {

      const { id } = payload;
      commit('SET_STATE', { system_credentials: [], loading: true })

      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/credentials/${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { system_credentials: result, loading: false })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('SET_STATE', { system_credentials: [], loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    SAVE_CREDENTIALS({ commit, rootState }, { payload }) {

      const { system_id, oss_credentials } = payload;
      commit('SET_STATE', { loading: true })

      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/credentials/${system_id}`, { oss_credentials }).then(response => {
        const { result, statusCode } = response.data
        commit('SET_STATE', { loading: false })
        if (statusCode == 200) {
          notification.success({
            message: 'System credentials updated successfully',
            description: ``,
          })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('SET_STATE', { loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
  },
  getters: {
    systems: (state) => state,
    system_credentials: (state) => state.system_credentials,
    loading: (state) => state.loading,
  },
}

