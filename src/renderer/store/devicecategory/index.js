import apiClient from '@/services/axios';
import { notification } from 'ant-design-vue'
import router from '@/router'

const apiPrefix = '/devicecategory';
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    devicecategory: {},
    activecatgories:[],
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
      const {system_id,pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = ''} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/system/${system_id}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
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
      if(id == 'new'){
        commit('SET_STATE', { devicecategory:{}})
        return 
      }
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {devicecategory: result })
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
        console.log('result', result)
        if (statusCode == 200) {
          commit('SET_STATE', {devicecategory: result })
          //router.push(`/devicecategory/profile/${result.id}`)
          notification.success({
            message: `Successfully added the category`,
            description: ``,
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADDCATEGORY({commit, rootState}, {payload}) {
      const data = payload;
      console.log("ADDCATEGORY: ", data);
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        console.log('result', result)
        if (statusCode == 200) {
          router.push(`/device/category/${result.id}`)
          notification.success({
            message: `Successfully added the category`,
            description: ``,
          })
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
          notification.success({
            message: 'Successfully updated the category',
            description: '',
          })
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
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'Successfully deleted the category',
            description: '',
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_BY_STATUS({commit, rootState}, {payload}) {
      const {system_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/active/${system_id}`).then(response => {
        const {result, statusCode} = response.data
        console.log("result", result)
        if (statusCode == 200) {
          commit('SET_STATE', {activecatgories: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    devicecategory: (state) => state,
    activecatgories: (state) => state.activecatgories,

  },
}
