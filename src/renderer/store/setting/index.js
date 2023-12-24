import apiClient from '@/services/axios'

const apiPrefix = '/settings'
export default {
  namespaced: true,
  state: {
    list: [],
    settingItem: null,
    cleared_cache: false,
    loading: false
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {...payload})
    },
  },
  actions: {
        
    CLEAR_CACHE({commit, rootState}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}/clear-cache`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {cleared_cache: true})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    GET_ALL({commit, rootState}) {
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      commit('SET_STATE', {loading:true})
      apiClient.get(`${apiPrefix}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {list: result})
        }
        commit('SET_STATE', {loading:false})
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        commit('SET_STATE', {loading:false})
      });
    },
    GET_BY_KEY({commit, rootState}, {payload}) {
      const {key} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/${key}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {settingItem: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    ADD({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {settingItem: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    UPDATE({commit, rootState}, {payload}) {
      const {id, ...data} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.put(`${apiPrefix}/${id}`, data).then(response => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    DELETE({commit, rootState}, {payload}) {
      const {id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.delete(`${apiPrefix}/${id}`).then(response => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    SYSTEM_OPTIMIZATION({commit, rootState}, {payload}) {
      const {tasks} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.post(`${apiPrefix}/system-optimization`, {tasks: tasks}).then(response => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    }
  },
  getters: {
    setting: (state) => state,
    clearedCache:  (state) => state.cleared_cache,
  },
}
