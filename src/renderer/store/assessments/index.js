import apiClient from '@/services/axios';
import { notification } from 'ant-design-vue'

const apiPrefix = '/checkControls';
let lastFramework = null;

export default {
  namespaced: true,
  state: {
    list: [],
    list_custom: [],
    list_framework: [],
    count: 0,
    count_custom: 0,
    count_framework: 0,
    list_pomas: [],
    count_pomas: 0,
    control: {
      control_type: {
        type:''
      },
      implementation: {
        status:[]
      },
      Poams:[],
      validation_controls: []
    },
    inheritables: [],
    relatedControls: [],
    NIST80053R4Control:{},
    NIST80053R5Control:{},
    NIST800171R2Control:{},
    list_custom_all: [],
    list_framework_all: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_SUB({commit, rootState}, {payload}) {
      const {system_id, framework_id, pageNumber, itemsPerPage, query_search, sortKey, descSort, framework} = payload;
      if(framework_id  == lastFramework){
        return
      }
      lastFramework = framework_id
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      const url = `assessmentsystems/framework?system_id=${system_id}&framework_id=${framework_id}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}&framework=${framework}`;
      apiClient.get(`${apiPrefix}/${url}`).then(response => {
        lastFramework = null
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          if(framework_id == 1){

            commit('SET_STATE', {list_framework: result.rows, count_framework: result.count})
          }else{

            commit('SET_STATE', {list_custom: result.rows, count_custom: result.count})
          }
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_ALL({commit, rootState}, {payload}) {
      const {system_id, framework_id, pageNumber, itemsPerPage, query_search, sortKey, descSort, framework} = payload;
      if(framework_id  == lastFramework){
        return
      }
      lastFramework = framework_id
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      const url = `system/framework?system_id=${system_id}&framework_id=${framework_id}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}&framework=${framework}`;
      apiClient.get(`${apiPrefix}/${url}`).then(response => {
        lastFramework = null
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          if(framework_id == 1){

            commit('SET_STATE', {list_framework_all: result.rows })
          }else{
            commit('SET_STATE', {list_custom_all: result.rows })
          }
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_BY_ID({commit, rootState}, {payload}) {
      const {id, framework, control_number, framework_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      commit('SET_STATE', {control: {
        control_type: {
          type:''
        },
        implementation: {
          status:[]
        },
        Poams:[]
      },NIST80053R4Control:{},NIST80053R5Control:{},NIST800171R2Control:{}})

      apiClient.get(`${apiPrefix}/control/${id}?framework=${framework}&control_number=${control_number}&framework_id=${framework_id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {control: result || {
            control_type: {
              type:''
            },
            implementation: {
              status:[]
            },
            Poams:[]
          }})
           if(framework == 'NIST80053R4'){
            commit('SET_STATE', {NIST80053R4Control: result.NIST80053R4Control || {}})
          }else if(framework == 'NIST80053R5'){
            commit('SET_STATE', {NIST80053R5Control: result.NIST80053R5Control || {}})
          }else{
            commit('SET_STATE', {NIST800171R2Control: result.NIST800171R2Control || {}})

      }
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const { controlData, type } = payload

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/control`, { controlData, type })
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {control: result })
            notification.success({
              message: 'Check control',
              description: 'Check control successfully updated!',
            })
          }
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, {root: true})
        }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_INHERITABLES({commit, rootState}, {payload}) {
      const {system_id, framework_id, control} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/fetch-inheritable/system/control/framework?system_id=${system_id}&framework_id=${framework_id}&control=${control}`)
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {inheritables: result})
          }
          commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_INHERITANCE({commit, rootState}, {payload}) {
      const {system_id} = payload;
      const {pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = ''} = payload;

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      const url = `inheritance/system/${system_id}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`;
      apiClient.get(`${apiPrefix}/${url}`)
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {list: result.rows, count: result.count})
          }
          commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD_INHERITANCE({commit, rootState}, {payload}) {
      const {id, inheritance} = payload
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/inheritance/system/${id}`, {inheritance})
        .then(response => {
          // const {result, statusCode} = response.data
          // if (statusCode == 200) {
          //   commit('SET_STATE', {stepper: result.rows})
          // }
          commit('user/SET_STATE', {
            fetchLoading: false,
          }, {root: true})
        }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    DELETE({commit, rootState}, {payload}) {
      const {id} = payload
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.delete(`${apiPrefix}/control/${id}`).then(response => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    UPDATE_CONTROL({commit, rootState}, {payload}) {
      const {system_id, control_number,framework, ...controlData} = payload
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.put(`${apiPrefix}/type/system/control`, {system_id, control_number,framework, ...controlData}).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {stepper: result.rows})
        // }
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_POAMS({commit, rootState}, {payload}) {
      const {system_id, pageNumber = 1, itemsPerPage = 10, query_search = null,sortKey = 'updatedAt',descSort = false,framework} = payload;

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/poams/system?system_id=${system_id}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {count_pomas: result.count, list_pomas: result.rows})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_RELATED_CONTROLS({commit, rootState}, {payload}) {
      const {controls} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/related-controls?controls=${controls}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {relatedControls: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    }
  },
  getters: {
    assessments: (state) => state,
  },
}
