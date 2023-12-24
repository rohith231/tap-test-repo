import { database_connection, database_create } from '@/services/APIs/database'
import { notification } from 'ant-design-vue'
import { DB, ENVIROMENT } from '~/config/env';


const DEMO_DATA = ENVIROMENT.allowDemo
  ? {
    demoDBHost: DB.host,
    demoDBUsername: DB.username,
    demoDBPassword: DB.password,
    demoDBName: DB.name,
    demoDBPort: DB.port,
  }
  : {}

export default {
  namespaced: true,
  state: {
    loading: false,
    hasConnection: false,
    DBHost: null,
    DBUsername: null,
    DBPassword: null,
    DBName: null,
    DBPort: null,
    ...DEMO_DATA,
  },
  mutations: {
    SET_STATE (state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    async DATABASE_CONNECTION ({ commit, dispatch, rootState }, { payload }) {

      var { operation, host, username, password, port, database } = payload
      let returnState = false
      commit('user/SET_STATE', {
        fetchLoading: true,
      }, { root: true })
      commit('SET_STATE', {
        loading: true
      })

      let response = await database_connection(operation, host, username, password, port, database)

      if (response.data.statusCode == 200) {

        if (operation != 'check') {
          returnState = true

          notification.success({
            message: 'Successful connection',
            description: `connection successfully ${operation != 'test' ? 'connected' : 'tested'}!`,
          })
          if (operation != 'test') {
            dispatch('user/LOGOUT', {}, { root: true })
          }
        }

        if (operation != 'test') {
          returnState = true
          commit('SET_STATE', {
            loading: false,
            hasConnection: true,
            DBHost: response.data.result.host,
            DBUsername: response.data.result.username,
            DBPassword: response.data.result.password,
            DBPort: response.data.result.port,
            DBName: response.data.result.database
          })
        }

      }
      else if (response.data.statusCode == 417) {
        returnState = false
        if(host && username && port) {
          notification.error({
            message: 'Connection failed!',
            description: 'Unable to connect to the database',
          })
        }
      }
      else {

        if (operation != 'test') {
          returnState = false
          commit('SET_STATE', { hasConnection: false, loading: false })
        }

      }

      commit('user/SET_STATE', {
        fetchLoading: false,
      }, { root: true })
      commit('SET_STATE', { loading: false })

      return returnState
    },
    async DATABASE_CONNECTION_CHECK ({ commit, dispatch, rootState }, { payload }) {

      var { operation, host, username, password, port, database } = payload

      commit('user/SET_STATE', {
        fetchLoading: true,
      }, { root: true })
      commit('SET_STATE', {
        loading: true
      })

      let response = await database_connection(operation, host, username, password, port, database)

      if (response.data.statusCode == 200) {

        if (operation != 'check') {
          notification.success({
            message: 'Successful connection',
            description: `connection successfully ${operation != 'test' ? 'connected' : 'tested'}!`,
          })
          if (operation != 'test') {
            dispatch('user/LOGOUT', {}, { root: true })
          }

        }

        if (operation != 'test') {
          commit('SET_STATE', {
            loading: false,
            hasConnection: true,
            DBHost: response.data.result.host,
            DBUsername: response.data.result.username,
            DBPassword: response.data.result.password,
            DBPort: response.data.result.port,
            DBName: response.data.result.database
          })
        }

      } else {
        if (operation != 'test') {
          commit('SET_STATE', { hasConnection: false, loading: false })
        }

      }

      commit('user/SET_STATE', {
        fetchLoading: false,
      }, { root: true })
      commit('SET_STATE', { loading: false })


      return response

    },
    async DATABASE_CREATE ({ commit, dispatch, rootState }, { payload }) {

      var { operation, host, username, password, port, database } = payload
      let returnState = false

      commit('user/SET_STATE', {
        fetchLoading: true,
      }, { root: true })
      commit('SET_STATE', {
        loading: true
      })

      let response = await database_create(operation, host, username, password, port, database)

      if (response.data.statusCode == 200) {

        if (operation != 'check') {
          returnState = true
          notification.success({
            message: 'Successful connection',
            description: `connection successfully ${operation != 'test' ? 'connected' : 'tested'}!`,
          })
          if (operation != 'test') {
            dispatch('user/LOGOUT', {}, { root: true })
          }

        }

        if (operation != 'test') {
          returnState = true
          commit('SET_STATE', {
            loading: false,
            hasConnection: true,
            DBHost: response.data.result.host,
            DBUsername: response.data.result.username,
            DBPassword: response.data.result.password,
            DBPort: response.data.result.port,
            DBName: response.data.result.database
          })
        }

      }
      else if (response.data.statusCode == 417) {
        returnState = false
        notification.error({
          message: 'Connection failed!',
          description: 'Unable to connect to the database',
        })
      }
      else {
        if (operation != 'test') {
          returnState = false
          commit('SET_STATE', { hasConnection: false, loading: false })
        }

      }

      commit('user/SET_STATE', {
        fetchLoading: false,
      }, { root: true })
      commit('SET_STATE', { loading: false })

      return returnState
    },
  },
  getters: {
    DBHost: (state) => state.DBHost,
    DBUsername: (state) => state.DBUsername,
    DBPassword: (state) => state.DBPassword,
    DBName: (state) => state.DBName,
    DBPort: (state) => state.DBPort,
    demoDBHost: (state) => state.demoDBHost,
    demoDBUsername: (state) => state.demoDBUsername,
    demoDBPassword: (state) => state.demoDBPassword,
    demoDBName: (state) => state.demoDBName,
    demoDBPort: (state) => state.demoDBPort,
    hasConnection: (state) => state.hasConnection,
    loading: (state) => state.loading,
  },
}
