import apiClient from '@/services/axios';

const apiPrefix = '/deviations';
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    deviation: null,
    deviationCommand: null,
    vulnerability: null,
    executeCommand: null,
    exportContents: null,
    loading: false,
    Deviation_list: [],
    vulnerability: {},
    vulnCommand: {},
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
      commit('SET_STATE', {loading:true})

      const {status, pageNumber = 1, itemsPerPage = 10, query_search = null,sortKey = 'updatedAt',descSort = false} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/status?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&status=${status}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, count: result.count})
        }
        commit('SET_STATE', {loading:false})
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {loading:false})
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    GET_ALL_VULNERABILITIES({commit, rootState}, {payload}) {
      commit('SET_STATE', {loading:true})

      const {pageNumber, itemsPerPage, query_search, status, sortKey, descSort} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      const url = `all-vulnerabilities?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&status=${status}&sortKey=${sortKey}&descSort=${descSort}`;
      apiClient.get(`${apiPrefix}/${url}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, count: result.count})
        }
      commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
      commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    FETCH_FILE({commit, rootState}, {payload}) {
      const {file, name} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/fetch-file`, {file, name}).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}`, data).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    UPDATE_BY_ID({commit, rootState}, {payload}) {
      const {id, ...data} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
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
    GET_BY_ID({commit, rootState}, {payload}) {
      const {deviation_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/vulnerabilities?deviation_id=${deviation_id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {deviation: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_DEVIATION_COMMAND({commit, rootState}, {payload}) {
      const {deviation_vulnerability_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/vulnerability-command?deviation_vulnerability_id=${deviation_vulnerability_id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {deviationCommand: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    VULNERABILITY({commit, rootState}, {payload}) {
      const {vuln_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/vulnerability?vuln_id=${vuln_id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {vulnerability: result})
          commit('SET_STATE', {vulnCommand: result.commands || {}})

        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_DEVIATION_LIST({commit, rootState}, {payload}) {
      const { control_number} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/framework/control?control_number=${control_number}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {Deviation_list: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    VULNERABILITY_COMMAND_ADD_UPDATE({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/vulnerability-create-or-update`, data).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {vulnerability: result})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    EXECUTE_COMMAND({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/exec-command`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {executeCommand: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_CONTROL({commit, rootState}, {payload}) {
      const {stig_id, framework_id, control_number} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/vulnerabilities/framework/control?stig_id=${stig_id}&framework_id=${framework_id}&control_number=${control_number}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {deviation: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_CONTROLS({commit, rootState}, {payload}) {
      const {framework_id, control_number} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/framework/control?framework_id=${framework_id}&control_number=${control_number}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    EXPORT({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/export-deviations`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {exportContents: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    IMPORT({commit,dispatch, rootState}, {payload}) {
      const {path} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/import-deviations`, {path}).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
                  dispatch('GET',{payload:{}})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    deviations: (state) => state,
  },
}
