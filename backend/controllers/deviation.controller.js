// import XLSX from 'xlsx';
// import {app} from 'electron'
const path = require("path");
const axios = require("axios");
const XLSX = require("xlsx");
const fs = require('fs');
const parser = require('fast-xml-parser');
const he = require('he');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const https = require('https')
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { ENVIROMENT } = require('../../common/config/env')
const dataPath = !ENVIROMENT.isdev
  ? path.join(global.AppPath, '../../common/extraResources')
  : path.join(process.resourcesPath, '/common/extraResources');


const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/deviations/`;

const {Op} = require('sequelize');


module.exports = (app) => {
  app.get(`${prefix}status`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let {pageNumber, itemsPerPage, query_search, status, sortKey, descSort, deviations_vuln_num} = req.query;

    const order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];

    let where = {};
    if (status === false || status === 0 || status === 1 || status === true) {
      where['status'] = !!status
    }

    if (query_search && typeof query_search !== 'undefined'  && query_search !== 'null' && query_search !== 'undefined' ) {
      where[Op.or] = [
        {name: {[Op.iLike]: `%${query_search}%`}}

      ];
    }
    let where_deviations_vuln_num = {};

    if (deviations_vuln_num) {
      where_deviations_vuln_num = {
        vuln_num: `${deviations_vuln_num}`,

      }
    }
    try {
      let count
      const include = [{
        model: app.get("models").DeviationVulnerability.unscoped(),
        required: where_deviations_vuln_num.length > 0 ? true : false,
        where: where_deviations_vuln_num,
        include: [{
          model: app.get("models").DeviationCommand.unscoped(),
          required: false,
          as: "commands"
        }]
      }];

      if (pageNumber != -1) {

        count = await app.get("models").Deviation.scope(null).count({
          distinct: true,
          include,
          subQuery: false,
          where
        });
      }
      const rows = await app.get("models").Deviation.findAll({
        subQuery: true,
        distinct: true,
        where,
        include,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });

      return utils.response(statusCodes.SUCCESS, {rows, count}, req, res);
    } catch (err) {
      let errMessage = err;
      if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
        errMessage = " "
        ex.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
  app.get(`${prefix}all-vulnerabilities`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let {pageNumber, itemsPerPage, query_search, status, sortKey, descSort} = req.query;

      const order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];

    let where = {};

    if (status === false || status === 0 || status === 1 || status === true) {
      where['status'] = !!status
    }

      if (query_search && typeof query_search !== 'undefined'  && query_search !== 'null' && query_search !== 'undefined' ) {
      where[Op.or] = [
        {group_title: {[Op.iLike]: `%${query_search}%`}},
        {vuln_num: {[Op.iLike]: `%${query_search}%`}},
        {rule_ver: {[Op.iLike]: `%${query_search}%`}},
        {rule_id: {[Op.iLike]: `%${query_search}%`}},
        {severity: {[Op.iLike]: `%${query_search}%`}},
        {ia_controls: {[Op.iLike]: `%${query_search}%`}},
        {check_content_ref: {[Op.iLike]: `%${query_search}%`}},

      ];
    }
    try {
      let count
      const include = [{
        model: app.get("models").Deviation.unscoped(),
        required: true,
      },
        {
          model: app.get("models").DeviationCommand.unscoped(),
          required: false,
          as: 'commands',
        }];
      if (pageNumber != -1) {

        count = await app.get("models").DeviationVulnerability.scope(null).count({
          distinct: true,
          include,
          where
        });
      }
      const rows = await app.get("models").DeviationVulnerability.findAll({
        subQuery: true,
        distinct: true,
        where,
        include,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });
      return utils.response(statusCodes.SUCCESS, {rows, count}, req, res);
    } catch (err) {
      let errMessage = err;
      if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
        errMessage = " "
        ex.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
  app.post(`${prefix}fetch-file`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let {file, name} = req.body;
    if (!fs.existsSync(file)) {
      return utils.response(statusCodes.BAD_REQUEST, "Please upload deviation file", req, res);
    }

    const stats = fs.statSync(file)
    const fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMegabytes > 50) {
      return utils.response(statusCodes.BAD_REQUEST, "The file size is too large.", req, res);
    }

    if (!name) {
      let fileName = path.basename(file, path.extname(file))
      fileName = fileName.replace(/[^0-9a-zA-Z-]/g, '-')
      fileName = fileName.replace(/-{2,}/g, '-')
      name = fileName;
    }


    let STIGAlreadyExit = await app.get("models").Deviation.scope(null).findOne({paranoid: false, where: {name: name}})
    if (STIGAlreadyExit) {
      return utils.response(statusCodes.BAD_REQUEST, "Deviation name already exists", req, res);
    }


    if (path.extname(file) === '.xml') {
      const data = fs.readFileSync(file, 'utf8');
      const options = {
        attributeNamePrefix: "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
      };

      if (parser.validate(data) !== true) {
        console.log("NOT VALID");
        return null;
      }
      let jsonObj = parser.parse(data, options);
      jsonObj = JSON.stringify(jsonObj);

      fs.writeFileSync(path.join(dataPath, 'vulnerabilities_list.json'), jsonObj);


      var vulnerabilities_list = await build_vulnerabilities_list()
      if (vulnerabilities_list.length == 0 || !Array.isArray(vulnerabilities_list)) {
        return utils.response(statusCodes.BAD_REQUEST, "The File Is Not Matching xccdf xml Standard", req, res);
      }

      return utils.response(statusCodes.SUCCESS, vulnerabilities_list, req, res);

    } else if (path.extname(file) === '.xlsx') {

      // XLSX
      var deviationData = req.body
      let statiHeader = ['Group_Title', 'Vuln_Num', 'Rule_ID', 'Rule_Ver', 'Severity', 'STATUS', 'FINDING_DETAILS', 'COMMENTS', 'TargetKey', 'CCI_REF', 'Rule_Ver', 'Vuln_Discuss', 'IA_Controls', 'Check_Content', 'Fix_Text', 'False_Positives', 'False_Negatives', 'Documentable', 'Mitigations', 'Potential_Impact', 'Third_Party_Tools', 'Mitigation_Control', 'Responsibility', 'Security_Override_Guidance', 'Check_Content_Ref', 'Class', 'STIGRef', 'SEVERITY_OVERRIDE', 'SEVERITY_JUSTIFICATION']

      var filepath = deviationData.file;

      var workbook = XLSX.readFile(filepath);
      var sheet_name_list = workbook.SheetNames;
      var file_rows = [];
      var data = [];
      sheet_name_list.forEach(async function (y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        for (var z in worksheet) {
          if (z[0] === '!') continue;
          //parse out the column, row, and value
          var tt = 0;
          for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
              tt = i;
              break;
            }
          }
          var col = z.substring(0, tt);
          var row = parseInt(z.substring(tt));
          var value = worksheet[z].v;

          //store header names

          if (row == 1 && value.trim()) {
            if (!statiHeader.includes(value)) {
              return utils.response(statusCodes.BAD_REQUEST, "Excel sheet is not matching deviation standard", req, res);
            } else {
              const index = statiHeader.indexOf(value);
              if (index > -1) {
                var x = statiHeader.splice(index, 1);

              }
            }
            headers[col] = value;
            continue;
          }
          if (statiHeader.length > 0) {
            return utils.response(statusCodes.BAD_REQUEST, "Excel sheet is not matching deviation standard", req, res);
          }

          if (!data[row]) data[row] = {};
          data[row][headers[col]] = value;
        }

        //drop those first two rows which are empty
        data.shift();
        data.shift();
      });

      return utils.response(statusCodes.SUCCESS, data, req, res);
    } else {
      return utils.response(statusCodes.BAD_REQUEST, "The File Is Not Matching xml Standard", req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const deviationData = req.body
      const filepath = deviationData.file;
      let name = "";
      if (deviationData.name && deviationData.name.trim() != '') {
        name = deviationData.name;
      } else {
        if (!fs.existsSync(filepath)) {
          return utils.response(statusCodes.BAD_REQUEST, "Please Upload Stig File", req, res);
        } else {
          let fileName = path.basename(filepath, path.extname(filepath))
          fileName = fileName.replace(/[^0-9a-zA-Z-]/g, '-')
          fileName = fileName.replace(/-{2,}/g, '-')
          name = fileName;
        }
      }
      const user_id = await global.Auth.get_user_id();
      const status = deviationData.status == 1;
      const data = deviationData.data;
      const deviation = await app.get("models").Deviation.create({
        name: name,
        user_id: user_id,
        status: status,

      });

      const VulnerabilityDataAll = [];
      const vuln_nums = [];
      for (let index = 0; index < data.length; index++) {
        vuln_nums.push(data[index].Vuln_Num)
        const vulnerabilitiesData = {
          deviation_id: deviation.id,//
          vuln_num: data[index].Vuln_Num,//
          group_title: data[index].Group_Title,//
          rule_id: data[index].Rule_ID,//
          rule_ver: data[index].Rule_Ver,//
          severity: data[index].Severity,//
          cci_ref: data[index].CCI_REF,//
          rule_title: data[index].Rule_Title,//
          vuln_discuss: data[index].Vuln_Discuss,//
          ia_controls: data[index].IA_Controls,//
          check_content: data[index].Check_Content,//
          fix_text: data[index].Fix_Text,//
          stig_ref: data[index].STIGRef,//
          target_key: data[index].TargetKey,//
          check_content_ref: data[index].Check_Content_Ref,//
          status: data[index].STATUS,
          finding_details: data[index].FINDING_DETAILS,
          comments: data[index].COMMENTS,
          false_positives: data[index].False_Positives,
          false_nigatives: data[index].False_Negatives,
          documentable: data[index].Documentable,
          mitigations: data[index].Mitigations,
          potential_impact: data[index].Potential_Impact,
          third_party_tools: data[index].Third_Party_Tools,
          mitigation_control: data[index].Mitigation_Control,
          responsibility: data[index].Responsibility,
          security_override_guidance: data[index].Security_Override_Guidance,
          class: data[index].Class,
          severity_override: data[index].SEVERITY_OVERRIDE,
          severity_justification: data[index].SEVERITY_JUSTIFICATION,
          user_id: user_id,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
        VulnerabilityDataAll.push(vulnerabilitiesData);
      }
      let model_attributes = [];
      Object.keys(app.get("models").DeviationVulnerability.rawAttributes).filter(function (attribute) {
        if (attribute === 'id')
          return model_attributes.push(attribute)
      })
      await app.get("models").DeviationVulnerability.bulkCreate(VulnerabilityDataAll)
      return utils.response(statusCodes.SUCCESS, deviation, req, res);
    } catch (err) {
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
  app.put(`${prefix}/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {id: deviation_id} = req.params;
      const deviationData = req.body

      let name = "";
      if (deviationData.name && deviationData.name.trim() != '') {
        name = deviationData.name;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Stig Name Couldn't Be Empty", req, res);
      }

      let user_id = "";
      if (deviationData.user_id) {
        user_id = deviationData.user_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "User Couldn't Be Empty", req, res);
      }

      const status = deviationData.status == 1;
      const isExists = await app.get("models").Deviation.findOne({
        where: {
          id: {[Op.ne]: deviation_id},
          name: name,
        }
      });
      if (isExists) {
        return utils.response(statusCodes.BAD_REQUEST, 'Deviation name already taken.', req, res);
      }

      const stig = await app.get("models").Deviation.update({
        name: name,
        user_id: user_id,
        status: status,
      }, {
        where: {
          id: deviation_id
        },
      });
      return utils.response(statusCodes.SUCCESS, stig, req, res);
    } catch (err) {
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
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {

      const {id} = req.params;
      await app.get("models").Deviation.destroy({
        where: {
          id: id
        }
      });
      return utils.response(statusCodes.SUCCESS, "Deviation Deleted Successfully", req, res);

    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}vulnerabilities`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {deviation_id} = req.query;
      if (!deviation_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Deviation Couldn't Be Empty", req, res);
      }

      const deviation = await app.get("models").Deviation.findAll({
        where: {
          id: deviation_id
        },
        include: [{
          model: app.get("models").DeviationVulnerability.unscoped(),
          required: false,
          include: [{
            model: app.get("models").DeviationCommand.unscoped(),
            required: false,
            as: 'commands',
          }]
        }]
      });
      return utils.response(statusCodes.SUCCESS, deviation[0], req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}vulnerability-command`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {deviation_vulnerability_id} = req.query;
      if (!deviation_vulnerability_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
      }
      const deviationCommand = await app.get("models").DeviationCommand.findOne({where: {deviation_vulnerability_id: deviation_vulnerability_id}});
      return utils.response(statusCodes.SUCCESS, deviationCommand, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}vulnerability`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {vuln_id} = req.query;
      if (!vuln_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
      }
      let vulnerability = await app.get("models").DeviationVulnerability.findOne({
        where: {id: vuln_id},
        include: [{
          model: app.get("models").DeviationCommand.unscoped(),
          required: false,
          as: "commands"
        }]
      });

      if (!vulnerability) {
        return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
      }
      return utils.response(statusCodes.SUCCESS, vulnerability, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  // app.get(`${prefix}vulnerability`, [authenticationMiddleware.decodeJWT], async (req, res) => {
  //   try {
  //     const {vuln_num} = req.body;
  //     if (!vuln_num) {
  //       return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
  //     }
  //     let stig = await app.get("models").DeviationVulnerability.findOne({where: {vuln_num: vuln_num}});
  //     if (!stig) {
  //       stig = app.get("models").DeviationCommand.build({
  //         vuln_num: req.params.vuln_num,
  //         validation_cmd: "",
  //         remediation_cmd: "",
  //         validation_expected: "",
  //         validation_result: "",
  //         validation_ip: "",
  //         remediation_expected: "",
  //         remediation_result: "",
  //         remediation_ip: "",
  //         user_id: "",
  //         status: "",
  //         done: "",
  //       })
  //     }
  //     return utils.response(statusCodes.SUCCESS, stig, req, res);
  //   } catch (err) {
  //     return utils.response(statusCodes.SERVER_ERROR, err, req, res);
  //   }
  // });
  app.post(`${prefix}vulnerability-create-or-update`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const stigCommandData = req.body;
      const status = stigCommandData.status == 1;
      const user_id = await global.Auth.get_user_id();
      const done = stigCommandData.done == 1;

      await app.get("models").DeviationCommand.findOrCreate({
        where: {deviation_vulnerability_id: req.body.deviation_vulnerability_id},
        defaults: {
          validation_cmd: stigCommandData.validation_cmd,
          remediation_cmd: stigCommandData.remediation_cmd,
          validation_expected: stigCommandData.validation_expected,
          validation_result: stigCommandData.validation_result,
          validation_ip: stigCommandData.validation_ip,
          remediation_expected: stigCommandData.remediation_expected,
          remediation_result: stigCommandData.remediation_result,
          remediation_ip: stigCommandData.remediation_ip,
          user_id: user_id,
          vuln_num: stigCommandData.vuln_num,
          status: status,
          done: done,
        }
      }).spread(async function (stigCommand, created) {
        // userResult is the user instance
        if (!created) { // created will be true if a new user was created
          app.get("models").DeviationCommand.update({
            validation_cmd: stigCommandData.validation_cmd,
            remediation_cmd: stigCommandData.remediation_cmd,
            validation_expected: stigCommandData.validation_expected,
            validation_result: stigCommandData.validation_result,
            validation_ip: stigCommandData.validation_ip,
            remediation_expected: stigCommandData.remediation_expected,
            remediation_result: stigCommandData.remediation_result,
            remediation_ip: stigCommandData.remediation_ip,
            user_id: user_id,
            status: status,
            done: done,
          }, {
            where: {deviation_vulnerability_id: req.body.deviation_vulnerability_id}
          });
        }
      });
      return utils.response(statusCodes.SUCCESS, "success", req, res);
    } catch (err) {
      console.log(err)
      let errMessage = err;
      if (err.name == "SequelizeUniqueConstraintError" || err.name == "SequelizeValidationError") {
        errMessage = " "
        err.errors.forEach(error => {
          errMessage += " " + error.message + " \n"
        });
      }
      return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res);
    }
  });
  app.post(`${prefix}exec-command`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const stigCommandData = req.body
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      let cmd = stigCommandData.cmd
      let ip = stigCommandData.ip
      const agent = new https.Agent({
        rejectUnauthorized: false,
        requestCert: false,
        agent: false
      });
      let url = 'https://3.209.91.44:5000/executeControl';
      const setting = await app.get("models").Setting.findOne({
        where: {setting_key: "api_validation_test"},
      });
      if (setting) {
        url = setting.setting_value
      }
      const response = await axios.post(url, {
        "ip": ip,
        "cmd": cmd,
        "token": "cee9806c-ebe0-4b38-8d6a-eeeda7277783",
        "vuln_num": stigCommandData.vuln_num,
        "control_id": "testcontrolid"
      });

      const output_text = response.data.output_text || "";
      return utils.response(statusCodes.SUCCESS, output_text, req, res);

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}vulnerabilities/framework/control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const {stig_id, framework_id, control_number} = req.query;
      if (!stig_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Stig Couldn't Be Empty", req, res);
      }

      let where = {}
      //let fetch = false
      if (framework_id > 0) {
        const iaControls = control_number.split(' ')[0]
        if (typeof (iaControls) === 'string') {
          where = {
            [Op.or]: [
              {ia_controls: iaControls},
              {ia_controls: null}
            ]
          }
        } else {
          //fetch = true
          where = {ia_controls: null}
        }
      } else {
        //fetch = true
        where = {}
      }
      const stig = await app.get("models").Deviation.findAll({
        where: {id: stig_id},
        include: [{
          model: app.get("models").DeviationVulnerability.unscoped(),
          required: false,
          where
        }]
      });
      return utils.response(statusCodes.SUCCESS, stig[0], req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}framework/control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { control_number} = req.query;
      let where = {}
      //let fetch = false
        let iaControls = control_number.split(' ')[0]
        if (typeof (iaControls) === 'string') {
          where = {
            [Op.or]: [
              {ia_controls: iaControls},
              {ia_controls: null}
            ]
          }
        } else {
          //fetch = true
          where = {ia_controls: null}
        }
 


      const vulnerabilities = await app.get("models").DeviationVulnerability.findAll({
        where,
        include: [{
          model: app.get("models").Deviation.unscoped(),
          required: true,
          where: {}
        }],
      });
      // console.log(vulnerabilities[0].Deviation)
      var stigsList = vulnerabilities.map((Vulnerability) => Vulnerability.Deviation);
      // vulnerabilities.forEach(Vulnerability => {
      //   stigsList.push(Vulnerability.Stigs[0])
      // });
      stigsList =  [...new Map(stigsList.map(item =>[item['id'], item])).values()];

      return utils.response(statusCodes.SUCCESS, stigsList, req, res);
    } catch (err) {
      console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
      console.log(err)
      console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}export-deviations`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      if (!fs.existsSync(dataPath + "/Deviations-Vulnerabilities")) {
        fs.mkdirSync(dataPath + "/Deviations-Vulnerabilities");
      }

      for (let index = 0; index < req.body.length; index++) {
        const element = req.body[index];
        await writeToCSVFile(element.name, element.DeviationVulnerabilities)
      }

      const archiver = require('archiver');

      var output = fs.createWriteStream(dataPath + '/Deviations-Vulnerabilities.zip');
      var archive = archiver('zip');

      output.on('close', async function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        if (fs.existsSync(dataPath + "/Deviations-Vulnerabilities")) {
          deleteFolderRecursive(dataPath + "/Deviations-Vulnerabilities")
        }
        if (fs.existsSync(dataPath + "/Deviations-Vulnerabilities.zip")) {
          const contents = await fs.promises.readFile(dataPath + "/Deviations-Vulnerabilities.zip", {encoding: 'base64'});
          fs.unlink(dataPath + "/Deviations-Vulnerabilities.zip", (err => {
            if (err) console.log(err);
            else console.log("\nDeleted");
          }))
          return utils.response(statusCodes.SUCCESS, {"data": contents}, req, res);
        }
      });

      archive.on('error', function (err) {
        throw err;
      });

      archive.pipe(output);

      // append files from a sub-directory and naming it `new-subdir` within the archive
      archive.directory(dataPath + "/Deviations-Vulnerabilities/", 'Deviations-Vulnerabilities');

      archive.finalize();

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}import-deviations`, [authenticationMiddleware.decodeJWT], async (req, res) => {

    try {
      const {path} = req.body;
      if (!fs.existsSync(path)) {
        return utils.response(statusCodes.BAD_REQUEST, "File Not Found", req, res);
      }
      const result = await CSVtoJSON(path);

      await addDataDeviationsWithRelationsToDB(result);
      return utils.response(statusCodes.SUCCESS, "success", req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });



  async function get_IA_Controls() {
    var IA_Controls = []
  
    const data = fs.readFileSync(path.join(dataPath, 'U_CCI_List.xml'), 'utf8');
  
    const options = {
      attributeNamePrefix: "@_",
      attrNodeName: "attr", //default is 'false'
      textNodeName: "#text",
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      parseTrueNumberOnly: false,
      arrayMode: false, //"strict"
      attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
      tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
      stopNodes: ["parse-me-as-string"]
    };
  
    if (parser.validate(data) !== true) {
      console.log("NOT VALID");
      return null;
    }
    let jsonObj = parser.parse(data, options);
    jsonObj = JSON.stringify(jsonObj);
  
    fs.writeFileSync(path.join(dataPath, 'U_CCI_List.json'), jsonObj);
    return await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(path.join(dataPath, 'U_CCI_List.json'), {encoding: 'utf8'});
      stream.pipe(JSONStream.parse('cci_list.cci_items.cci_item.*')).pipe(es.mapSync(function (data) {
        if (data.references.reference) {
          if (Array.isArray(data.references.reference)) {
            data.references.reference.forEach(element => {
              if (element.attr['@_version'] == 4) {
                IA_Controls[data.attr['@_id']] = element.attr['@_index']
              }
            });
          } else if (typeof (data.references.reference) === "object") {
            if (data.references.reference.attr['@_version'] == 4) {
              IA_Controls[data.attr['@_id']] = data.references.reference.attr['@_index']
            }
          }
        }
      }))
      stream.on("error", err => reject(err));
      stream.on("end", () => resolve(IA_Controls));
    });
  
  }
  
  async function build_vulnerabilities_list() {
    var controls = []
    let IA_Controls = await get_IA_Controls()
    let stig_ref = await get_stig_ref()
    return await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), {encoding: 'utf8'});
      stream.pipe(JSONStream.parse('Benchmark.Group.*')).pipe(es.mapSync(async function (data) {
        let CCI_REF = ''
        if (Array.isArray(data.Rule.ident)) {
          data.Rule.ident.forEach(element => {
            CCI_REF = (element["#text"].substr(0, "CCI".length).toUpperCase() == "CCI".toUpperCase()) ? element["#text"] : null
          });
        } else if (typeof (data.Rule.ident) === "object") {
          CCI_REF = (data.Rule.ident["#text"].substr(0, "CCI".length).toUpperCase() == "CCI".toUpperCase()) ? data.Rule.ident["#text"] : null
        }
  
        let descriptionObj = await parse_description(data.Rule.description)
        if (!IA_Controls[CCI_REF]) return
        controls.push({
          Vuln_Num: data.attr['@_id'],
          Rule_ID: data.Rule.attr['@_id'],
          Severity: data.Rule.attr['@_severity'],
          IA_Controls: IA_Controls[CCI_REF].split(" ")[0],
          CCI_REF: CCI_REF,
          Group_Title: data.title,
          Rule_Title: data.Rule.title,
          Rule_Ver: data.Rule.version,
          Vuln_Discuss: descriptionObj.description.VulnDiscussion[0],
          Mitigations: descriptionObj.description.Mitigations[0],
          Mitigation_Control: descriptionObj.description.MitigationControl[0],
          False_Positives: descriptionObj.description.FalsePositives[0],
          False_Negatives: descriptionObj.description.FalseNegatives[0],
          Third_Party_Tools: descriptionObj.description.ThirdPartyTools[0],
          Documentable: descriptionObj.description.Documentable[0],
          Security_Override_Guidance: descriptionObj.description.SeverityOverrideGuidance[0],
          Potential_Impact: descriptionObj.description.PotentialImpacts[0],
          Responsibility: descriptionObj.description.Responsibility[0],
          TargetKey: data.Rule.reference['dc:identifier'],
          Check_Content: data.Rule.check['check-content'],
          Check_Content_Ref: data.Rule.check['check-content-ref']['attr']['@_name'],
          Fix_Text: data.Rule.fixtext['#text'],
          STIGRef: stig_ref,
        })
      }))
      stream.on("error", err => reject(err));
      stream.on("end", () => resolve(controls));
    });
  
  }
  
  async function get_stig_ref() {
    let stig_ref = ''
    let plain_text = await get_plain_text()
    return await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), {encoding: 'utf8'});
      stream.pipe(JSONStream.parse('Benchmark')).pipe(es.mapSync(async function (data) {
        stig_ref = `${data.title} :: Version ${data.version}, ${plain_text}`
      }))
      stream.on("error", err => reject(err));
      stream.on("end", () => resolve(stig_ref));
    });
  }
  
  async function get_plain_text() {
    let plain_text = ''
  
    return await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), {encoding: 'utf8'});
      stream.pipe(JSONStream.parse('Benchmark.plain-text.*')).pipe(es.mapSync(async function (data) {
        if (data.attr['@_id'] == 'release-info') {
          plain_text = `${data['#text']}`
  
        }
  
      }))
      stream.on("error", err => reject(err));
      stream.on("end", () => resolve(plain_text));
    });
  
  }
  
  async function parse_description(description) {
    let descriptionObj = ''
    var parseString = require('xml2js').parseString;
    parseString(`<description>${description}</description>`, async function (err, result) {
      descriptionObj = result;
    });
    return descriptionObj
  
  }
  
  async function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
  
      fs.readdirSync(path).forEach(function (file) {
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
  
  async function CSVtoJSON(pathUrl) {
    return new Promise(async (resolve, reject) => {
      const result = [];
      const extension = path.extname(pathUrl);
      const isZipFile = extension === ".zip";
  
      if (!isZipFile) {
        const rows = await readCSVFile(pathUrl);
        const deviationsName = path.basename(pathUrl, extension);
        result.push({deviationsName: deviationsName, vulnerabilities: rows});
  
        return resolve(result);
      }
      var AdmZip = require('adm-zip');
      const zip = new AdmZip(pathUrl);
  
      console.log('Entries read: ' + zip.getEntryCount());
      const pathDir = './extracted';
  
      const entries = zip.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.isDirectory) {
          return reject("zip file not valid to import , please enter zip file has only .csv files");
        }
        const fileEx = path.extname(entry.name);
        if (fileEx !== ".csv") {
          return reject("zip file not valid to import , please enter zip file has only .csv files");
        }
        await zip.extractEntryTo(entry, pathDir, true, true, entry.name);
      }
  
      const dir = fs.readdirSync(pathDir);
      for (let i = 0; i < dir.length; i++) {
        const filePath = pathDir + "/" + dir[i];
        const deviationsName = path.basename(dir[i], path.extname(dir[i]));
        const rows = await readCSVFile(filePath);
        result.push({deviationsName: deviationsName, vulnerabilities: rows});
        await fs.unlinkSync(filePath);
      }
  
      resolve(result);
  
    });
  }
  
  function writeToCSVFile(filename, Vulnerabilities) {
    const filePath = dataPath + "/Deviations-Vulnerabilities/" + filename + ".csv";
    const {header, rows} = extractAsCSV(Vulnerabilities);
    writeDataToCSV(filePath, header, rows).then((r) => {
      console.log(`File ${filename} Written successfully !`);
    }).catch((err) => {
      console.log("EEEE : ", err);
    })
  }
  
  function extractAsCSV(Vulnerabilities) {
    var model_attributes = [];
    Object.keys(app.get("models").DeviationVulnerability.rawAttributes).filter(function (attribute) {
      if (!['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'attrsToSkip'].includes(attribute)) return model_attributes.push(`vulnerabilities.${attribute}`)
    })
    Object.keys(app.get("models").DeviationCommand.rawAttributes).filter(function (attribute) {
      if (!['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'attrsToSkip'].includes(attribute)) return model_attributes.push(`deviation_commands.${attribute}`)
    });
    const rows = Vulnerabilities.map((Vulnerability) => {
      const obj = {};
      model_attributes.forEach(key => {
        let value = Vulnerability[key];
        if (key.includes("deviation_commands.")) {
          const myKey = key.replace("deviation_commands.", "");
          value = Vulnerability.commands && Vulnerability.commands[myKey] !== null ? Vulnerability.commands[myKey] : null;
        } else if (key.includes("vulnerabilities.")) {
          const myKey = key.replace("vulnerabilities.", "");
          value = Vulnerability[myKey];
        }
        obj[key] = value ? value.toString() : "";
      });
      return obj;
    });
  
    return {
      header: model_attributes.map((ele) => {
        return {id: ele, title: ele}
      }), rows: rows
    };
  }
  
  async function addDataDeviationsWithRelationsToDB(deviationsWithVulnerabilitiesArr) {
    try {
      const userId = await global.Auth.get_user_id();
      const promises = deviationsWithVulnerabilitiesArr.map((ele) => insertDeviationsFileWithVulns(ele, userId));
      await Promise.all(promises);
    } catch (err) {
      console.log("EEEEE : ", err);
  
    }
  }
  
  async function insertDeviationsFileWithVulns(item, userId) {
    try {
      const date = Date.now();
      const {deviationsName, vulnerabilities} = item;
      const deviationObj = {
        name: deviationsName + "-imported-" + date,
        user_id: userId,
        status: true
      };
      const deviationResult = await app.get("models").Deviation.create(deviationObj);
      const deviationsVulnArr = [];
      vulnerabilities.forEach((item) => {
        const vulnObj = {
          user_id: userId,
          group_title: item['vulnerabilities.group_title'],
          vuln_num: item['vulnerabilities.vuln_num'],
          rule_id: item['vulnerabilities.rule_id'],
          rule_ver: item['vulnerabilities.rule_ver'],
          severity: item['vulnerabilities.severity'],
          status: !!item['vulnerabilities.status'],
          finding_details: item['vulnerabilities.finding_details'],
          comments: item['vulnerabilities.comments'],
          target_key: +item['vulnerabilities.target_key'],
          cci_ref: item['vulnerabilities.cci_ref'],
          rule_title: item['vulnerabilities.rule_title'],
          vuln_discuss: item['vulnerabilities.vuln_discuss'],
          ia_controls: item['vulnerabilities.ia_controls'],
          check_content: item['vulnerabilities.check_content'],
          fix_text: item['vulnerabilities.fix_text'],
          false_positives: item['vulnerabilities.false_positives'],
          false_nigatives: item['vulnerabilities.false_nigatives'],
          documentable: !!item['vulnerabilities.documentable'],
          mitigations: item['vulnerabilities.mitigations'],
          potential_impact: item['vulnerabilities.potential_impact'],
          third_party_tools: item['vulnerabilities.third_party_tools'],
          mitigation_control: item['vulnerabilities.mitigation_control'],
          responsibility: item['vulnerabilities.responsibility'],
          security_override_guidance: item['vulnerabilities.security_override_guidance'],
          check_content_ref: item['vulnerabilities.check_content_ref'],
          class: item['vulnerabilities.class'],
          stig_ref: item['vulnerabilities.stig_ref'],
          severity_override: item['vulnerabilities.severity_override'],
          severity_justification: item['vulnerabilities.severity_justification'],
          deviation_id: deviationResult.id
        };
        if (item['deviation_commands.validation_cmd']) {
          const cmd = {
            vuln_num: item['deviation_commands.vuln_num'],
            validation_cmd: item['deviation_commands.validation_cmd'],
            remediation_cmd: item['deviation_commands.remediation_cmd'],
            validation_expected: item['deviation_commands.validation_expected'],
            validation_result: item['deviation_commands.validation_result'],
            validation_ip: item['deviation_commands.validation_ip'],
            remediation_expected: item['deviation_commands.remediation_expected'],
            remediation_result: item['deviation_commands.remediation_result'],
            remediation_ip: item['deviation_commands.remediation_ip'],
            done: !!item['deviation_commands.done'],
            status: !!item['deviation_commands.status'],
            user_id: userId
          };
          vulnObj['commandObj'] = cmd;
        }
        deviationsVulnArr.push(vulnObj);
      });
  
      let vulnCommands = [];
      vulnCommands = await insertVulns(deviationsVulnArr, vulnCommands);
      if (vulnCommands.length) {
        await app.get("models").DeviationCommand.bulkCreate(vulnCommands);
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  }
  
  async function insertVulns(vulnerabilitiesArr, vulnCommands) {
    for (let i = 0; i < vulnerabilitiesArr.length; i++) {
      const vulnObj = vulnerabilitiesArr[i];
      const vulnResult = await app.get("models").DeviationVulnerability.create(vulnObj);
      if (vulnObj.commandObj) {
        vulnObj.commandObj['deviation_vulnerability_id'] = vulnResult.id;
        vulnCommands.push(vulnObj.commandObj);
        // await app.get("models").DeviationCommand.create(vulnObj.commandObj);
      }
    }
    return vulnCommands;
  }
  
  async function readCSVFile(path) {
    return new Promise((resolve) => {
      const rows = [];
      fs.createReadStream(path).pipe(csvParser()).on('data', (row) => {
        rows.push(row);
      }).on('end', () => {
        console.log('CSV file successfully processed');
        resolve(rows);
      });
    })
  
  }
  
  async function writeDataToCSV(path, header, data) {
    const csvWriter = createCsvWriter({
      path: path,
      header: header
    });
    return csvWriter.writeRecords(data);
  }
  

};

