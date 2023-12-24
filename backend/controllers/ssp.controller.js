const {utils, constants, flush} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/ssp/`;
const {Op} = require('sequelize');
module.exports = (app) => {
  app.get(`${prefix}system`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {system_id, framework} = req.query;
      const modelName = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : (framework == 'NIST80053R5' ? 'NIST80053R5SSP' :'NIST800171R2SSP');
      let ssp = system_id == 'new' ? null :  await app.get("models")[modelName].findOne({
        where: {
          system_id: system_id,
          active: true
        }
      })
      if (!ssp) {
        ssp = {
          ssp_id: 0,
          ssp_desc: '',
          system_id: '',
          version: "0.0.1",
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
          revision_history: [{
            date: '',
            desc: '',
            sspversion: '',
            author: '',
          }],
          sensitivity_cat: [{
            type: '',
            idnt: '',
            confidentiality: '',
            integrity: '',
            availability: '',
          }],
          security_objectives_cat: {
            confidentiality: '',
            integrity: '',
            availability: ''
          },
          contacts: [{
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
          },],
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
          leveraged_systems: [{
            name: '',
            owner: '',
            date_granted: '',
          }],
          types_of_users: [{
            role: '',
            int_ext: '',
            privilege: '',
            sensitivity: '',
            authorization: '',
            functions: '',
          }],
          ports_protocols_services: [{
            port: '',
            protocol: '',
            service: '',
            purpose: '',
            used_by: '',
          }],
          authorized_connections: [{
            spip: '',
            org_name: '',
            org_ip: '',
            poc: '',
            poc_phone: '',
            connection_sec: '',
            data_direction: '',
            information: '',
            port: '',
          }],
          laws_regulations: [{
            number: '',
            title: '',
            date: '',
            link: '',
          }],
          standards_guidance: [{
            number: '',
            title: '',
            date: '',
            link: '',
          }],
          control_originations: [{
            origination: '',
            definition: '',
            example: '',
          }]

        }
      } else {
        ssp = ssp.ssp_data
      }
      return utils.response(statusCodes.SUCCESS, ssp, req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}createOrUpdate`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const sspData = req.body;
      ['NIST80053R4','NIST80053R5','NIST800171R2'].forEach(async(framework) => {
        const modelName = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : (framework == 'NIST80053R5' ? 'NIST80053R5SSP' :'NIST800171R2SSP')
        await app.get("models")[modelName].update({
          active: false,
        }, {
          where: {
            system_id: sspData.system_id
          }
        })
  
  
        // if (sspData.ssp_id != 0) {
        //   await app.get("models")[modelName].update({
        //     system_id: sspData.system_id,
        //     ssp_desc: sspData.ssp_desc,
        //     version: sspData.version,
        //     baseline_security_cat: sspData.baseline_security_cat,
        //     version_date: sspData.version_date,
        //     ssp_data: sspData,
        //     active: true,
        //   }, {
        //     where: {
        //       id: sspData.ssp_id
        //     }
        //   });
  
  
          // var systemUsers = await app.get("models").UserSystem.findAll({
          //   where: {
          //     system_id: sspData.system_id
          //   }
          // });
  
          // var flushDataAll = [];
          // for (let index = 0; index < systemUsers.length; index++) {
          //   //flushObj.createFlush(systemUsers[index].user_id, 'user', 'user-info', sspData.system_id);
          //   var flushData = {
          //     user_id: systemUsers[index].user_id,
          //     model: 'user',
          //     key: 'user-info',
          //     related_id: sspData.system_id,
          //     createdAt: new Date(),
          //     updatedAt: new Date()
          //   }
          //   flushDataAll.push(flushData);
          // }
          // console.log('create bulk flush.......')
          // flush.createBulkFlush(flushDataAll);
        // } else {
          await app.get("models")[modelName].update(
            {active: false},
            {where: {system_id: sspData.system_id}})
          const ssp = await app.get("models")[modelName].create({
            system_id: sspData.system_id,
            ssp_desc: sspData.ssp_desc,
            version: sspData.version,
            baseline_security_cat: sspData.baseline_security_cat,
            version_date: sspData.version_date,
            ssp_data: sspData,
            active: true,
          });

        // }
      });

      return utils.response(statusCodes.SUCCESS, sspData, req, res);
     
    } catch (err) {
      console.log(err)
      let errMessage = err;
      if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
        errMessage = " "
        err.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
  app.get(`${prefix}reversions/system`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {system_id} = req.query;
      const revisions = await app.get("models").NIST80053R4SSP.findAll({
        where: {
          system_id: system_id,
          active: false
        },
        attributes: ['version_date', 'ssp_desc', 'version', 'system_id'],
        raw: true
      });
      return utils.response(statusCodes.SUCCESS, revisions, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}report/ssp`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { data } = req.body;
      const { getParsedTemplate } = require('../helpers/templates.js');
      const content = getParsedTemplate({ template_name: 'ssp-report.html', values: data});
      return utils.response_report(statusCodes.SUCCESS, content, req, res);
    } catch (err) {
      console.log(err);
      console.error(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}report/devices`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { data } = req.body;
      const { getParsedTemplate } = require('../helpers/templates.js');
      const content = getParsedTemplate({ template_name: 'devices-report.html', values: data});
      return utils.response_report(statusCodes.SUCCESS, content, req, res);
    } catch (err) {
      console.error(err);
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}report/controls`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { data } = req.body;
      const { getParsedTemplate } = require('../helpers/templates.js');
      const content = getParsedTemplate({ template_name: 'devices-report.html', values: data});
      return utils.response_report(statusCodes.SUCCESS, content, req, res);
    } catch (err) {
      console.log(err)
      console.error(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
}