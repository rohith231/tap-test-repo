import apiClient from '@/services/axios';
let COMPLIANCE_TIMEOUT = null;
import { notification } from 'ant-design-vue'

const apiPrefix = '/compliance';
export default {
  namespaced: true,
  state: {
    list: [],
    type: '',
    count: 0,
    controllers: [],
    devices: [],
    loading: false,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_DEVICES({commit, rootState}, {payload}) {

      clearTimeout(COMPLIANCE_TIMEOUT);

      COMPLIANCE_TIMEOUT = setTimeout(() =>{
        const { system_id, framework, pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = '' } = payload;
      commit('SET_STATE', {list: [],loading:true})
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
    return  apiClient.get(`${apiPrefix}/devices?system_id=${system_id}&framework=${framework}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, count: result.count, type: 'devices', devices: result.rows})
        }
        commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })

    },1);
    },
    GET_CONTROLLERS({commit, rootState}, {payload}) {
      const {system_id, framework} = payload;
      commit('SET_STATE', {list: [],loading:true})
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/controllers?system_id=${system_id}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result, type: 'controls', controllers: result})
        }
        commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {loading:false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    RESET_COMPLIANCE({commit, rootState}, {payload}) {
      commit('SET_STATE', {list: [],loading:true})
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/reset`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'Reset compliance',
            description: 'You have successfully reset the compliance!',
          })
        }
        commit('SET_STATE', {loading:false, type: ''})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {loading:false, type: ''})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    compliance: (state) => state,
  },
}
