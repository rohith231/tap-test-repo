import apiClient from '@/services/axios';
import { notification } from 'ant-design-vue'

const apiPrefix = '/approval';
export default {
  namespaced: true,
  state: {
    list: [],
    allRoles: [],
    steps: [],
    GET_STEPPERloading: false,
    GET_HISTORYloading: false,
    allowHistory: false,
    allowForm: false,
    history: [],
    allow: false
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
      const {system_id, type} = payload
      commit('SET_STATE', {
        list: [],
        allRoles: [],
      })
      commit('user/SET_STATE', {
        fetchLoading: true,
      }, {root: true})
      apiClient.get(`${apiPrefix}?system_id=${system_id}&type=${type}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {
            list: result.approval_process,
            allRoles: result.allRoles,
            loading:false

          })
        }
        commit('user/SET_STATE', {
          fetchLoading: false,
          
        }, {root: true})
      }).catch(err => {
        commit('SET_STATE', {
          list: [],
          allRoles: []
        })
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_STEPPER({commit, rootState}, {payload}) {
      const {control_id, system_id, type} = payload
      commit('SET_STATE', { GET_STEPPERloading:true})
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/stepper?system_id=${system_id}&control_id=${control_id}&type=${type}`)
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {
              steps: result.steps,
              allowHistory: result.allow_history,
              allowForm: result.allow_form,
            })
          }
      commit('SET_STATE', { GET_STEPPERloading:false})

          commit('user/SET_STATE', {
            fetchLoading: false,
          }, {root: true})
        }).catch(err => {
        commit('SET_STATE', { GET_STEPPERloading:false})

        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_HISTORY({commit, rootState}, {payload}) {
      const {type, target_id} = payload
      commit('SET_STATE', { GET_HISTORYloading:true})

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/history?target_id=${target_id}&type=${type}`)
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {history: result.approvalProcessHistory})
          }
        commit('SET_STATE', {        GET_HISTORYloading:false})

          commit('user/SET_STATE', {
            fetchLoading: false,
          }, {root: true})
        }).catch(err => {
        commit('SET_STATE', {        GET_HISTORYloading:false})

        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    SAVE({commit, rootState}, {payload}) {
      const {system_id, type, steps} = payload

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}`, {system_id, type, steps})
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            notification.success({
              message: 'Successful updated',
              description: (type == 'ato') ? 'ATO Approval' : 'Control Approval' + ` updated successfully`,
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
    ACTION({commit, rootState}, {payload}) {
      const {system_id, type, body} = payload

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/action`, {system_id, type, body})
        .then(response => {
          const {result, statusCode} = response.data
          

          if (statusCode == 200) {
            notification.success({
              message: 'Successful updated',
              description: (type == 'ato') ? 'ATO Approval' : 'Control Approval' + ` updated successfully`,
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
    CAN_EDIT({commit, rootState}, {payload}) {
      const {system_id, type} = payload

      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/can-edit?system_id=${system_id}&type=${type}`)
        .then(response => {
          const {result, statusCode} = response.data
          if (statusCode == 200) {
            commit('SET_STATE', {allow: result.allow})
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
  },
  getters: {
    approvalProcess: (state) => state,
    list: (state) => state.list,
    allRoles: (state) => state.allRoles,
  },
}
