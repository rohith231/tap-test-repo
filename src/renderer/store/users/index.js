import apiClient from '@/services/axios'
import { notification } from 'ant-design-vue'
import router from '@/router'

const apiPrefix = '/users'
export default {
  namespaced: true,
  state: {
    list: [],
    total: 0,
    user: {
      id: '',
      mobile_number: '',
      display_name: '',
      user_name: '',
      first_name: '',
      last_name: '', 
      phone_number: '', 
      extension: '', 
      role: '',
      Systems:[],
      Roles:[],
      email: '',
      avatar: '',
      settings: {
        notifications: true
      }
    }
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    GET_USERS({commit, rootState}, {payload}) {
      const {pageNumber = 1, itemsPerPage = 10, query_search = '', sortKey = '', descSort = ''} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      commit('SET_STATE', {list: [], total: 0})

      apiClient.get(`${apiPrefix}?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&query_search=${query_search}&sortKey=${sortKey}&descSort=${descSort}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result.rows, total: result.count})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_BY_ID({commit, rootState}, {payload}) {
      const {id} = payload;

      if(id == 'new'){
        commit('SET_STATE', { user:{
          id: '',
          mobile_number: '',
          display_name: '',
          user_name: '',
          first_name: '',
          last_name: '', 
          phone_number: '', 
          extension: '', 
          role: '',
          Systems:[],
          Roles:[],
          email: '',
          avatar: '',
          settings: { notification: false }
        }})

        return 
      }

      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/${id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {user: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          router.push(`/users/profile/${result.id}`)
            notification.success({
              message: 'Successful create',
              description: `user successfully created`,
            })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
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
           description: `user successfully updated`,
         })
       }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    DELETE({commit, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        const {result, statusCode} = response.data

        if (statusCode == 200) {
          notification.success({
            message: 'Successful delete',
            description: `user successfully deleted`,
          })
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
  },
  getters: {
    users: (state) => state,
  },
}
