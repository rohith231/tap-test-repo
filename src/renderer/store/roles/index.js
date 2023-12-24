import apiClient from '@/services/axios'
import router from '@/router'
import { notification } from 'ant-design-vue'

const apiPrefix = '/roles'
export default {
  namespaced: true,
  state: {
    list: [],
    count: 0,
    role: {
      name:''
    },
    groupPermissions: []
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {...payload})
    },
  },
  actions: {
    GET_ROLES({ commit, rootState }, {payload}) {
      const {pageNumber = 1, itemsPerPage = 10, query_search = null,sortKey = 'updatedAt',descSort = false} = payload;

      commit('user/SET_STATE', {
        fetchLoading: true,
      }, {root: true})
      apiClient.get(`${apiPrefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, count: result.count})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_ROLES_WITH_USERS({commit, rootState}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/with-users`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result, count: result.length})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    GET_BY_ID({commit, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {role: result.role, groupPermissions: result.groupPermissions})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {role: result});
          router.push(`/roles/profile/${result.id}`)
          notification.success({
            message: 'Successful create',
            description: `role successfully created`,
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    UPDATE({commit, rootState}, {payload}) {
      const {id, ...data} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
           notification.success({
            message: 'Successful update',
            description: `role successfully updated`,
          })
          commit('SET_STATE', {role: result.role, groupPermissions: result.groupPermissions})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    },
    DELETE({commit, dispatch, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          notification.success({
            message: 'Successful delete',
            description: `role successfully deleted`,
          })
        }
      }).catch(err => {
        commit('user/SET_STATE', {
          fetchLoading: false,
        }, {root: true})
      })
    }
  },
  getters: {
    roles: (state) => state,
  },
}
