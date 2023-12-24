import apiClient from '@/services/axios'

const apiPrefix = '/stigs'
export default {
  namespaced: true,
  state: {
    SITG_list: [],
    count: 0,
    dataFile: [],
    stig: null,
    vulnCommand: {},
    sitg_vuln: {},
    sitg_vulnerabilities: [],
    commandExecuteResult: null,
    dataExport: null,
    vulnerability: {},
    loading: false,
    loading_vluns: false,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, { ...payload })
    },
  },
  actions: {
    GET({ commit, rootState }, { payload }) {
      commit('SET_STATE', { loading: true })

      const { status, pageNumber = 1, itemsPerPage = 10, query_search = null, sortKey = 'updatedAt', descSort = false } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/status?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&status=${status}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { list: result.rows, count: result.count })
        }
        commit('SET_STATE', { loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('SET_STATE', { loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_ALL_VULNERABILITIES({ commit, rootState }, { payload }) {
      commit('SET_STATE', { loading: true })
      const { pageNumber, itemsPerPage, query_search, status, sortKey, descSort } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/all-vulnerabilities?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&status=${status}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { list: result.rows, count: result.count })
        }
        commit('SET_STATE', { loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('SET_STATE', { loading: false })
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    FETCH_FILE({ commit, rootState }, { payload }) {
      const { file, name } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/fetch-file`, { file, name }).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { dataFile: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    ADD({ commit, rootState }, { payload }) {
      const data = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { stig: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    UPDATE({ commit, rootState }, { payload }) {
      const { id, ...data } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { stig: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    DELETE({ commit, rootState }, { payload }) {
      const { id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_BY_ID({ commit, rootState }, { payload }) {
      const { id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/vulnerabilities?stig_id=${id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { stig: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_VULNERABILITY_COMMAND({ commit, rootState }, { payload }) {
      const { vuln_num } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/vulnerability-command?vuln_num=${vuln_num}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { vulnCommand: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    VULNERABILITY({ commit, rootState }, { payload }) {
      const { vuln_id } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/vulnerability?vuln_id=${vuln_id}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { vulnerability: result })
          commit('SET_STATE', { vulnCommand: result.commands || {} })

        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    VULNERABILITY_COMMAND_ADD_UPDATE({ commit, rootState }, { payload }) {
      const data = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/vulnerability-create-or-update`, data).then(response => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    EXECUTE_COMMAND({ commit, rootState }, { payload }) {
      const data = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/exec-command`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { commandExecuteResult: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_SITG_LIST({ commit, rootState }, { payload }) {
      const { control_number } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.get(`${apiPrefix}/framework/control?control_number=${control_number}`).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { SITG_list: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    GET_SITG_VULN({ commit, rootState }, { payload }) {
      const { stig_id, control_number, system_id, framework, type } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true });
      commit('SET_STATE', { loading_vluns: true });
      apiClient.get(`${apiPrefix}/vulnerabilities/framework/control?stig_id=${stig_id}&control_number=${control_number}&system_id=${system_id}&framework=${framework}&type=${type}`).then(response => {
        const { result, statusCode } = response.data
        commit('SET_STATE', { loading_vluns: false });

        if (statusCode == 200) {
          commit('SET_STATE', { sitg_vulnerabilities: result.Vulnerabilities || [] })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
        commit('SET_STATE', { loading_vluns: false });

      })
    },
    GET_SITG_VULN1({ commit, rootState }, { }) {
      commit('SET_STATE', { sitg_vulnerabilities: [] })
    },
    EXPORT_STIGS({ commit, rootState }, { payload }) {
      const data = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/export-stigs`, data).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          commit('SET_STATE', { dataExport: result })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    },
    IMPORT({ commit, dispatch, rootState }, { payload }) {
      const { path, isOverride, os } = payload;
      commit('user/SET_STATE', { fetchLoading: true }, { root: true })
      apiClient.post(`${apiPrefix}/import-stigs`, { path, isOverride, os }).then(response => {
        const { result, statusCode } = response.data
        if (statusCode == 200) {
          dispatch('GET', { payload: {} })
        }
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      }).catch(err => {
        commit('user/SET_STATE', { fetchLoading: false }, { root: true })
      });
    }
  },
  getters: {
    STIGs: (state) => state,
  },
}
