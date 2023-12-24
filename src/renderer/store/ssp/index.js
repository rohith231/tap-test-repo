import apiClient from '@/services/axios'

const apiPrefix = '/ssp'
let GET_SSP_timeout = null;

export default {
  namespaced: true,
  state: {
    ssp:  {
      compact: "success",
      new: true,
      general_description_files: [],
      data_form_files: [],
      ssp_id: 0,
      ssp_desc: '',
      version: 0,
      sensitivity_level: '',
      baseline_security_cat: '',
      digital_identity_level: '',
      function_purpose: '',
      environment_inventory: '',
      version_date: new Date().toISOString().substr(0, 10),
      owner: {
        first_name: '',
        last_name: '',
        title: '',
        company: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_tech: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_mgmt: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_isso: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_ao: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      prepared_by: {},
      prepared_for: {},
      revision_history: [
        {
          date: '',
          desc: '',
          sspversion: '',
          author: '',
        }
      ],
      sensitivity_cat: [],
      security_objectives_cat: {
        confidentiality: '',
        integrity: '',
        availability: ''
      },
      contacts: [
        {
          first_name: '',
          last_name: '',
          title: '',
          organization: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: '',
        },
      ],
      operational_status: {
        status: [],
        explain: '',
      },
      system_is_cloud: {
        virtual_machine: '',
        expand_capacity: '',
        consumer_build: '',
        create_databases: '',
        developer_toolkits: '',
        obtaining_login: '',
      },
      sp_architecture_layers: {
        layers: [],
        explain: '',
      },
      sp_deployment_model: {
        model: [],
        explain: '',
      },
      leveraged_systems: [
        {
          name: '',
          owner: '',
          date_granted: '',
        }
      ],
      types_of_users: [
        {
          role: '',
          int_ext: '',
          privilege: '',
          sensitivity: '',
          authorization: '',
          functions: '',
        }
      ],
      ports_protocols_services: [
        {
          port: '',
          protocol: '',
          service: '',
          purpose: '',
          used_by: '',
        }
      ],
      comp_boundries: [],
      authorized_connections: [
        {
          spip: '',
          org_name: '',
          org_ip: '',
          poc: '',
          poc_phone: '',
          connection_sec: '',
          data_direction: '',
          information: '',
          port: '',
        }
      ],
      laws_regulations: [
        {
          number: '',
          title: '',
          date: '',
          link: '',
        }
      ],
      standards_guidance: [
        {
          number: '',
          title: '',
          date: '',
          link: '',
        }
      ],
      control_originations: [
        {
          origination: '',
          definition: '',
          example: '',
        }
      ],


    },
    defaultSSP:  {
      compact: "success",
      new: true,
      general_description_files: [],
      data_form_files: [],
      ssp_id: 0,
      ssp_desc: '',
      version: 0,
      sensitivity_level: '',
      baseline_security_cat: '',
      digital_identity_level: '',
      function_purpose: '',
      environment_inventory: '',
      version_date: new Date().toISOString().substr(0, 10),
      owner: {
        first_name: '',
        last_name: '',
        title: '',
        company: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_tech: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_mgmt: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_isso: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      poc_ao: {
        first_name: '',
        last_name: '',
        title: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
      },
      prepared_by: {},
      prepared_for: {},
      revision_history: [
        {
          date: '',
          desc: '',
          sspversion: '',
          author: '',
        }
      ],
      sensitivity_cat: [],
      security_objectives_cat: {
        confidentiality: '',
        integrity: '',
        availability: ''
      },
      contacts: [
        {
          first_name: '',
          last_name: '',
          title: '',
          organization: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: '',
        },
      ],
      operational_status: {
        status: [],
        explain: '',
      },
      system_is_cloud: {
        virtual_machine: '',
        expand_capacity: '',
        consumer_build: '',
        create_databases: '',
        developer_toolkits: '',
        obtaining_login: '',
      },
      sp_architecture_layers: {
        layers: [],
        explain: '',
      },
      sp_deployment_model: {
        model: [],
        explain: '',
      },
      types_of_users: [
        {
          role: '',
          int_ext: '',
          privilege: '',
          sensitivity: '',
          authorization: '',
          functions: '',
        }
      ],
      ports_protocols_services: [
        {
          port: '',
          protocol: '',
          service: '',
          purpose: '',
          used_by: '',
        }
      ],
      comp_boundries: [],
      authorized_connections: [
        {
          spip: '',
          org_name: '',
          org_ip: '',
          poc: '',
          poc_phone: '',
          connection_sec: '',
          data_direction: '',
          information: '',
          port: '',
        }
      ],
      laws_regulations: [
        {
          number: '',
          title: '',
          date: '',
          link: '',
        }
      ],
      standards_guidance: [
        {
          number: '',
          title: '',
          date: '',
          link: '',
        }
      ],
      control_originations: [
        {
          origination: '',
          definition: '',
          example: '',
        }
      ],


    },
    SSPLoading: false,
    revisions: [],
  },
  mutations: {
    SET_STATE(state, payload) {
      Object.assign(state, {...payload})
    },
  },
  actions: {
    GET_SSP({commit, rootState}, {payload}) {
      clearTimeout(GET_SSP_timeout);
      GET_SSP_timeout = setTimeout(() =>{
      const {system_id, framework} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      commit('SET_STATE', {SSPLoading: true})
      apiClient.get(`${apiPrefix}/system?system_id=${system_id}&framework=${framework}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {ssp: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        commit('SET_STATE', {SSPLoading: false})

      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
        commit('SET_STATE', {SSPLoading: false})

      });
    },1000);
    },
    CREATE_OR_UPDATE({commit, rootState}, {payload}) {
      const data = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      commit('SET_STATE', {SSPLoading: true})

      apiClient.post(`${apiPrefix}/createOrUpdate`, data).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {ssp: result})
        }
        commit('SET_STATE', {SSPLoading: false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('SET_STATE', {SSPLoading: false})

        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
    GET_REVERSIONS({commit, rootState}, {payload}) {
      const {system_id} = payload;
      commit('user/SET_STATE', {fetchLoading: true}, {root: true})
      apiClient.get(`${apiPrefix}/reversions/system?system_id=${system_id}`).then(response => {
        const {result, statusCode} = response.data
        if (statusCode == 200) {
          commit('SET_STATE', {revisions: result})
        }
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      }).catch(err => {
        commit('user/SET_STATE', {fetchLoading: false}, {root: true})
      });
    },
  },
  getters: {
    ssp: (state) => state,
    SSPLoading: (state) => state.SSPLoading,
  },
}
