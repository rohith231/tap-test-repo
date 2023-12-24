import apiClient from '@/services/axios';

const apiPrefix = '/dashboard';
let GET_CHARTS_AUDIT_CONTROLLERS_timeout = null;
let GET_CHARTS_COMPLIANCE_DEVICES_timeout = null;
let GET_CHARTS_COMPLIANCE_CONTROLLERS_timeout = null;

export default {
  namespaced: true,
  state: {
    list: [],
    GET_CHARTS_AUDIT_CONTROLLERS: {},
    GET_CHARTS_COMPLIANCE_DEVICES: {},
    GET_CHARTS_COMPLIANCE_CONTROLLERS: {},
    GET_CHARTS_AUDIT_CONTROLLERS_LOADING: false,
    GET_CHARTS_COMPLIANCE_DEVICES_LOADING: false,
    GET_CHARTS_COMPLIANCE_CONTROLLERS_LOADING: false,
    count: 0,
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {
        ...payload,
      })
    },
  },
  actions: {
    ADD_WIDGET({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.post(`${apiPrefix}/widget`, data).then(response => {
        // const {result, statusCode} = response.data
        // if (statusCode == 200) {
        //   commit('SET_STATE', {list: result.rows, count: result.count})
        // }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },
    GET_CHARTS_AUDIT_CONTROLLERS({commit, rootState}, {payload}) {
      clearTimeout(GET_CHARTS_AUDIT_CONTROLLERS_timeout);

      GET_CHARTS_AUDIT_CONTROLLERS_timeout = setTimeout(() =>{
           
      const {system_id, framework} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      commit('SET_STATE', {GET_CHARTS_AUDIT_CONTROLLERS_LOADING: true});
      apiClient.get(`${apiPrefix}/charts/audit/controllers?system_id=${system_id}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {GET_CHARTS_AUDIT_CONTROLLERS: result})
        }
      
        commit('SET_STATE', {GET_CHARTS_AUDIT_CONTROLLERS_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {GET_CHARTS_AUDIT_CONTROLLERS_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
      },1);

    },
    GET_CHARTS_COMPLIANCE_DEVICES({commit, rootState}, {payload}) {
      clearTimeout(GET_CHARTS_COMPLIANCE_DEVICES_timeout);
      GET_CHARTS_COMPLIANCE_DEVICES_timeout = setTimeout(() =>{
      const {system_id, framework} = payload;
      commit('SET_STATE', {GET_CHARTS_COMPLIANCE_DEVICES_LOADING: true});
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/charts/compliance/devices?system_id=${system_id}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {GET_CHARTS_COMPLIANCE_DEVICES: result})
        }
        commit('SET_STATE', {GET_CHARTS_COMPLIANCE_DEVICES_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {GET_CHARTS_COMPLIANCE_DEVICES_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
      },1);

    },
    GET_CHARTS_COMPLIANCE_CONTROLLERS({commit, rootState}, {payload}) {
      clearTimeout(GET_CHARTS_COMPLIANCE_CONTROLLERS_timeout);
      GET_CHARTS_COMPLIANCE_CONTROLLERS_timeout = setTimeout(() =>{
      const {system_id, framework} = payload;

      commit('SET_STATE', {GET_CHARTS_COMPLIANCE_CONTROLLERS_LOADING: true});
      commit('user/SET_STATE', {fetchLoading: true}, {root: true});
      apiClient.get(`${apiPrefix}/charts/compliance/controllers?system_id=${system_id}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data;

        if (statusCode == 200) {
          commit('SET_STATE', {GET_CHARTS_COMPLIANCE_CONTROLLERS: result})
        }

        commit('SET_STATE', {GET_CHARTS_COMPLIANCE_CONTROLLERS_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {GET_CHARTS_COMPLIANCE_CONTROLLERS_LOADING: false});
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      })
    },1);

    },

  },
  getters: {
    dashboard: (state) => state,
  },
}
