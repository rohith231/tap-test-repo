const XLSX = require('xlsx');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const parser = require('fast-xml-parser');
const he = require('he');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const https = require('https')
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { ENVIROMENT } = require('../../common/config/env')
const dataPath =
  !ENVIROMENT.isdev
    ? path.join(global.AppPath, '../../extraResources')
    : path.join(process.resourcesPath, '/extraResources');


const { utils, constants, flush } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const { statusCodes } = constants;
const prefix = `/api/v1/stigs/`;
const { Op, Sequelize } = require('sequelize');

module.exports = (app) => {
  app.get(`${prefix}status`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { pageNumber, itemsPerPage, query_search, status, sortKey, descSort } = req.query;
      const order = sortKey && sortKey != null ? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];

      let where = {};
      if (status === false || status === 0 || status === 1 || status === true) {
        where['status'] = !!status
      }


      if (query_search && typeof query_search !== 'undefined' && query_search !== 'null' && query_search !== 'undefined') {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${query_search}%` } }

        ];
      }
      let count
      const include = [{
        model: app.get("models").Vulnerability.unscoped(),
        required: false,
        include: [{
          model: app.get("models").StigCommand.unscoped(),
          required: false,
          as: "commands"
        }]
      }];
      if (pageNumber != -1) {

        count = await app.get("models").Stig.scope(null).count({
          distinct: true,
          subQuery: false,
          where
        });
      }
      const rows = await app.get("models").Stig.findAll({
        subQuery: true,
        distinct: true,
        where,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });
      return utils.response(statusCodes.SUCCESS, { rows, count }, req, res);
    } catch (err) {
      // console.log("STIG Error: ",err)
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
  app.get(`${prefix}all-vulnerabilities`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let sortOrder;
    try {
      const { pageNumber, itemsPerPage, query_search, status, sortKey, descSort } = req.query;
      let order = sortKey && sortKey != null && sortKey !== 'null' && sortKey !== 'undefined' && typeof sortKey !== 'undefined' ? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];

      let where = {};
      if (sortKey === 'vuln_num' && descSort !== undefined) {
        sortOrder = descSort === 'true' ? 'DESC' : 'ASC';
        order = [Sequelize.literal(`SUBSTRING(\"Vulnerability\".vuln_num FROM '([0-9]+)')::BIGINT ${sortOrder}, vuln_num`)]
      }

      if (sortKey === 'severity' && descSort !== undefined) {
        sortOrder = descSort === 'true' ? 'DESC' : 'ASC';
        order = [Sequelize.literal(`(case severity
          when 'low' then 1
          when 'medium' then 2
          when 'high' then 3
          end )  ${sortOrder}`)]
      }

      if (status === false || status === 0 || status === 1 || status === true) {
        where['status'] = !!status
      }

      if (query_search && typeof query_search !== 'undefined' && query_search !== 'null' && query_search !== 'undefined') {
        where[Op.or] = [
          { group_title: { [Op.iLike]: `%${query_search}%` } },
          { vuln_num: { [Op.iLike]: `%${query_search}%` } },
          { rule_ver: { [Op.iLike]: `%${query_search}%` } },
          { rule_id: { [Op.iLike]: `%${query_search}%` } },
          { severity: { [Op.iLike]: `%${query_search}%` } },
          { ia_controls: { [Op.iLike]: `%${query_search}%` } },
          { check_content_ref: { [Op.iLike]: `%${query_search}%` } },
        ];
      }

      let count
      const include = [{
        model: app.get("models").Stig.unscoped(),
        required: true,
      },
      {
        model: app.get("models").StigCommand.unscoped(),
        required: false,
        as: 'commands',
      }];
      if (pageNumber != -1) {

        count = await app.get("models").Vulnerability.scope(null).count({
          distinct: true,
          include,
          where
        });
      }
      const rows = await app.get("models").Vulnerability.findAll({
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
      return utils.response(statusCodes.SUCCESS, { rows, count }, req, res);
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
  app.post(`${prefix}fetch-file`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      let { file, name } = req.body;
      if (!fs.existsSync(file)) {
        return utils.response(statusCodes.BAD_REQUEST, "Please upload STIG file", req, res);
      }

      var stats = fs.statSync(file)
      var fileSizeInBytes = stats.size;
      // Convert the file size to megabytes (optional)
      var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMegabytes > 50) {
        return utils.response(statusCodes.BAD_REQUEST, "The file size is too large.", req, res);
      }

      if (!name) {
        let fileName = path.basename(file, path.extname(file))
        fileName = fileName.replace(/[^0-9a-zA-Z-]/g, '-')
        fileName = fileName.replace(/-{2,}/g, '-')
        name = fileName;
      }


      let STIGAlreadyExit = await app.get("models").Stig.scope(null).findOne({ paranoid: false, where: { name: name } })
      if (STIGAlreadyExit) {
        return utils.response(statusCodes.BAD_REQUEST, "STIG name already exists", req, res);
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
          attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
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


        const vulnerabilities_list = await build_vulnerabilities_list()
        if (vulnerabilities_list.length == 0 || !Array.isArray(vulnerabilities_list)) {
          return utils.response(statusCodes.BAD_REQUEST, "The file is not matching xccdf xml standard", req, res);
        }
        return utils.response(statusCodes.SUCCESS, vulnerabilities_list, req, res);
      } else if (path.extname(file) === '.xlsx') {
        // XLSX
        const stigData = req.body
        const statiHeader = ['Group_Title', 'Vuln_Num', 'Rule_ID', 'Rule_Ver', 'Severity', 'STATUS', 'FINDING_DETAILS', 'COMMENTS', 'TargetKey', 'CCI_REF', 'Rule_Ver', 'Vuln_Discuss', 'IA_Controls', 'Check_Content', 'Fix_Text', 'False_Positives', 'False_Negatives', 'Documentable', 'Mitigations', 'Potential_Impact', 'Third_Party_Tools', 'Mitigation_Control', 'Responsibility', 'Security_Override_Guidance', 'Check_Content_Ref', 'Class', 'STIGRef', 'SEVERITY_OVERRIDE', 'SEVERITY_JUSTIFICATION']

        var filepath = stigData.file;

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
            ;
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names

            if (row == 1 && value.trim()) {
              if (!statiHeader.includes(value)) {
                return new global.ResponseHandler(req, res).error("Excel sheet is not matching STIG standard")
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
              return new global.ResponseHandler(req, res).error("Excel sheet is not matching STIG standard")
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

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const stigData = req.body;
      const filepath = stigData.file;
      let name = "";
      if (stigData.name && stigData.name.trim() != '') {
        name = stigData.name;
      } else {
        if (!fs.existsSync(filepath)) {
          return new global.ResponseHandler(req, res).error("Please Upload Stig File")
        } else {
          let fileName = path.basename(filepath, path.extname(filepath))
          fileName = fileName.replace(/[^0-9a-zA-Z-]/g, '-')
          fileName = fileName.replace(/-{2,}/g, '-');
          name = fileName;
        }
      }
      const user_id = await global.Auth.get_user_id();
      const status = stigData.status == 1;
      const data = stigData.data;
      await app.get("models").Stig.create({
        name: name,
        user_id: user_id,
        status: status,

      }).then(async (stig, isCreated) => {
        var VulnerabilityDataAll = [];
        var vuln_nums = [];
        for (let index = 0; index < data.length; index++) {
          vuln_nums.push(data[index].Vuln_Num)
          let vulnerabilitiesData = {
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
        Object.keys(app.get("models").Vulnerability.rawAttributes).filter(function (attribute) {
          if (attribute === 'id') return model_attributes.push(attribute)
        })
        const vulnData = await app.get("models").Vulnerability.bulkCreate(VulnerabilityDataAll);

        const StigVulnerabilityDataAll = vulnData.map((ele) => {
          return {
            stig_id: stig.id,
            vulnerability_id: ele.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
          }
        });
        await app.get("models").StigVulnerability.bulkCreate(StigVulnerabilityDataAll)


        return utils.response(statusCodes.SUCCESS, stig, req, res);
      })
    } catch (err) {
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
  app.put(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: stig_id } = req.params;
      const stigData = req.body

      if (stigData.name && stigData.name.trim() != '') {
        var name = stigData.name;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "Stig Name Couldn't Be Empty", req, res);
      }

      if (stigData.user_id) {
        var user_id = stigData.user_id;
      } else {
        return utils.response(statusCodes.BAD_REQUEST, "User Couldn't Be Empty", req, res);
      }

      const status = stigData.status == 1;


      const isExists = await app.get("models").Stig.findOne({
        where: {
          id: { [Op.ne]: stig_id },
          name: name,
        }
      });
      if (isExists) {
        return utils.response(statusCodes.BAD_REQUEST, 'Stig name already taken.', req, res);
      }

      const stig = await app.get("models").Stig.update({
        name: name,
        user_id: user_id,
        status: status,
      }, {
        where: {
          id: stig_id
        },
      });

      return utils.response(statusCodes.SUCCESS, stig, req, res);
    } catch (err) {
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
  app.delete(`${prefix}:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params;
      await app.get("models").Stig.destroy({
        where: {
          id: id
        }
      });
      return utils.response(statusCodes.SUCCESS, "Stig Deleted Successfully", req, res);
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}vulnerabilities`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { stig_id } = req.query;
      if (!stig_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Stig Couldn't Be Empty", req, res);
      }

      const stig = await app.get("models").Stig.findAll({
        where: {
          id: stig_id
        },
        include: [{
          model: app.get("models").Vulnerability.unscoped(),
          required: false,
          include: [{
            model: app.get("models").StigCommand.unscoped(),
            required: false,
            as: 'commands',
          }]
        }]
      });
      return utils.response(statusCodes.SUCCESS, stig[0], req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}vulnerability-command`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { vuln_num } = req.query;
      if (!vuln_num) {
        return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
      }
      const stigCommand = await app.get("models").StigCommand.findOne({ where: { vuln_num: vuln_num } });
      return utils.response(statusCodes.SUCCESS, stigCommand, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}vulnerability`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { vuln_id } = req.query;
      if (!vuln_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Vulnerability Couldn't Be Empty", req, res);
      }
      let vulnerability = await app.get("models").Vulnerability.scope(null).findOne({
        where: { id: vuln_id },
        include: [{
          model: app.get("models").StigCommand.unscoped(),
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
  app.post(`${prefix}vulnerability-create-or-update`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const stigCommandData = req.body
      const status = stigCommandData.status == 1;
      const done = stigCommandData.done == 1;

      await app.get("models").StigCommand.findOrCreate({
        where: { vuln_num: req.body.vuln_num },
        defaults: {
          validation_cmd: stigCommandData.validation_cmd,
          remediation_cmd: stigCommandData.remediation_cmd,
          validation_expected: stigCommandData.validation_expected,
          validation_result: stigCommandData.validation_result,
          validation_ip: stigCommandData.validation_ip,
          remediation_expected: stigCommandData.remediation_expected,
          remediation_result: stigCommandData.remediation_result,
          remediation_ip: stigCommandData.remediation_ip,
          user_id: stigCommandData.user_id,
          vuln_num: stigCommandData.vuln_num,
          status: status,
          done: done,
        }
      }).spread(async function (stigCommand, created) {
        // userResult is the user instance
        if (!created) { // created will be true if a new user was created
          app.get("models").StigCommand.update({
            validation_cmd: stigCommandData.validation_cmd,
            remediation_cmd: stigCommandData.remediation_cmd,
            validation_expected: stigCommandData.validation_expected,
            validation_result: stigCommandData.validation_result,
            validation_ip: stigCommandData.validation_ip,
            remediation_expected: stigCommandData.remediation_expected,
            remediation_result: stigCommandData.remediation_result,
            remediation_ip: stigCommandData.remediation_ip,
            user_id: stigCommandData.user_id,
            status: status,
            done: done,
          }, {
            where: { vuln_num: req.body.vuln_num }
          });
        }
      });
      return utils.response(statusCodes.SUCCESS, "success", req, res);
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
  app.post(`${prefix}exec-command`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    const stigCommandData = req.body
    console.log('data for stig is ' + stigCommandData.cmd + ' ---- ' + stigCommandData.ip + ' +++ ' + stigCommandData.vuln_num)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    let output_text = ''
    // let cmd = null
    // let ip = null
    /* https://stackoverflow.com/questions/48058838/neterr-insecure-response-in-electron */
    const agent = new https.Agent({
      rejectUnauthorized: false,
      requestCert: false,
      agent: false
    })

    const cmd = stigCommandData.cmd
    const ip = stigCommandData.ip
    let url = 'https://3.209.91.44:5000/executeControl';
    const setting = await app.get("models").Setting.findOne({
      where: {
        setting_key: "api_validation_test"
      },
    });
    if (setting) {
      url = setting.setting_value
    }
    await axios.post(url, {
      "ip": ip,
      "cmd": cmd,
      "token": "cee9806c-ebe0-4b38-8d6a-eeeda7277783",
      "vuln_num": stigCommandData.vuln_num,
      "control_id": "testcontrolid"
    }).then(response => {
      console.log(response)
      console.log(response.data)
      output_text = response.data.output_text;
      return utils.response(statusCodes.SUCCESS, output_text, req, res);
    }).catch(err => {
      console.log(err)
      return utils.response(statusCodes.SUCCESS, output_text, req, res);
    })
    return utils.response(statusCodes.SERVER_ERROR, "not able to exec Stig Command", req, res);
  });
  app.get(`${prefix}vulnerabilities/framework/control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { stig_id, control_number, system_id, framework, type } = req.query;
      if (!stig_id) {
        return utils.response(statusCodes.BAD_REQUEST, "Stig Couldn't Be Empty", req, res);
      }

      let where = {}

      // Get System Sensitivity
      const systemData = await getNISTBySystemId(system_id, framework)
      if (systemData && systemData.ssp_data && systemData.ssp_data.sensitivity_level) {
        let filters = []
        if (systemData.ssp_data.sensitivity_level === 'low') filters = ['low']
        else if (systemData.ssp_data.sensitivity_level === 'moderate') filters = ['low', 'medium']
        else if (systemData.ssp_data.sensitivity_level === 'high') filters = ['low', 'medium', 'high']
        else filters = ['low', 'medium', 'high']

        if (type === 'custom') filters = ['low', 'medium', 'high']

        where = { ...where, severity: { [Op.in]: filters } }
      }

      if (control_number && control_number != 'undefined') {
        //let fetch = false
        let iaControls = []
        // console.log("control number is : ", control_number);
        if (typeof (control_number) === 'string') {
          iaControls = [control_number.split(' ')[0]]
        } else {
          iaControls = control_number.filter((number) => number.split(' ')[0])
        }

        if (iaControls) {
          where = {
            ...where,
            ia_controls: { [Op.in]: iaControls }
          }
        } else {
          //fetch = true
          where = { ...where/*, ia_controls: null*/ }
        }
      } else {
        where = { ...where /*, ia_controls: null*/ }
      }

      // console.log("where: ", where)
      // console.log("system id: ", system_id)
      const stig = await app.get("models").Stig.findAll({
        where: {
          id: stig_id,
        },
        include: [{
          model: app.get("models").Vulnerability.unscoped(),
          include: [{
            model: app.get("models").StigCommand.unscoped(),
            as: 'commands',
          }],
          required: false,
          where: where
        }]
      });

      // Sort vulnerabilities by vuln_name
      // console.log("stigs", stig[0].Vulnerabilities)
      stig[0].Vulnerabilities = stig[0].Vulnerabilities.sort(function (a, b) {
        if (a.vuln_num < b.vuln_num) return -1
        if (a.vuln_num > b.vuln_num) return 1
        return 0
      })

      return utils.response(statusCodes.SUCCESS, stig[0], req, res);

    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}framework/control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { framework_id, control_number } = req.query;
      let where = {}
      //let fetch = false
      let iaControls = []
      if (typeof (control_number) === 'string') {
        iaControls = [control_number.split(' ')[0]]
      } else {
        iaControls = control_number.filter((number) => number.split(' ')[0])
      }
      if (iaControls) {
        where = {
          [Op.or]: [
            { ia_controls: { [Op.in]: iaControls } },
            { ia_controls: null }
          ]
        }
      } else {
        //fetch = true
        where = { ia_controls: null }
      }



      const vulnerabilities = await app.get("models").Vulnerability.findAll({
        where,
        include: [{
          model: app.get("models").Stig.unscoped(),
          required: true,
          subQuery: true,
          distinct: true,
          where: {}
        }]
      });
      let stigsList = [];
      for (let i = 0; i < vulnerabilities.length; i++) {
        for (let j = 0; j < vulnerabilities[i].Stigs.length; j++) {
          stigsList.push(vulnerabilities[i].Stigs[j])
        }
      }
      // let stigsList = vulnerabilities.map(Vulnerability => Vulnerability.Stigs[0]);
      // stigsList = [...new Set(stig sList.map(item => item.id))];
      stigsList = [...new Map(stigsList.map(item => [item['id'], item])).values()];
      return utils.response(statusCodes.SUCCESS, stigsList, req, res);
    } catch (err) {

      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.post(`${prefix}export-stigs`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      if (!fs.existsSync(dataPath + "/STIGs-Vulnerabilities")) {
        fs.mkdirSync(dataPath + "/STIGs-Vulnerabilities");
      }

      for (let index = 0; index < req.body.length; index++) {
        const element = req.body[index];
        await writeToCSVFile(element.name, element.Vulnerabilities)
      }

      const archiver = require('archiver');

      const output = fs.createWriteStream(dataPath + '/STIGs-Vulnerabilities.zip');
      const archive = archiver('zip');

      output.on('close', async function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        if (fs.existsSync(dataPath + "/STIGs-Vulnerabilities")) {
          deleteFolderRecursive(dataPath + "/STIGs-Vulnerabilities")
        }
        if (fs.existsSync(dataPath + "/STIGs-Vulnerabilities.zip")) {
          const contents = await fs.promises.readFile(dataPath + "/STIGs-Vulnerabilities.zip", { encoding: 'base64' });
          fs.unlink(dataPath + "/STIGs-Vulnerabilities.zip", (err => {
            if (err) console.log(err);
            else console.log("\nDeleted");
          }))
          return utils.response(statusCodes.SUCCESS, { "data": contents }, req, res);
        }
      });

      archive.on('error', function (err) {
        throw err;
      });

      archive.pipe(output);

      // append files from a sub-directory and naming it `new-subdir` within the archive
      archive.directory(dataPath + "/STIGs-Vulnerabilities/", 'STIGs-Vulnerabilities');

      archive.finalize();

    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}import-stigs`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { path, isOverride } = req.body;
      if (!fs.existsSync(path)) {
        return utils.response(statusCodes.BAD_REQUEST, "File Not found", req, res);
      }

      const result = await utils.XlsxToJSON(req.body.path);
      await addDataSTIGSWithRelationsToDB(result, isOverride);
      return utils.response(statusCodes.SUCCESS, null, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.post(`${prefix}upload-file`, async (req, res) => {
    try {
      return utils.response(statusCodes.SUCCESS, null, req, res);
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
      attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
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
      const stream = fs.createReadStream(path.join(dataPath, 'U_CCI_List.json'), { encoding: 'utf8' });
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
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), { encoding: 'utf8' });
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
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), { encoding: 'utf8' });
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
      const stream = fs.createReadStream(path.join(dataPath, 'vulnerabilities_list.json'), { encoding: 'utf8' });
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
      const extension = path.extname(pathUrl); const isZipFile = extension === ".zip";

      if (!isZipFile) {
        const rows = await readCSVFile(pathUrl);
        const stigName = path.basename(pathUrl, extension);
        result.push({ stigName: stigName, vulnerabilities: rows });
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
        const stigName = path.basename(dir[i], path.extname(dir[i]));
        const rows = await readCSVFile(filePath);
        result.push({ stigName: stigName, vulnerabilities: rows });
        await fs.unlinkSync(filePath);
      }

      resolve(result);

    });
  }

  function writeToCSVFile(filename, Vulnerabilities) {
    const filePath = dataPath + "/STIGs-Vulnerabilities/" + filename + ".csv";
    const { header, rows } = extractAsCSV(Vulnerabilities);
    writeDataToCSV(filePath, header, rows).then((r) => {
      console.log(`File ${filename} Written successfully !`);
    }).catch((err) => {
      console.log("EEEE : ", err);
    })
  }

  function extractAsCSV(Vulnerabilities) {
    var model_attributes = [];
    Object.keys(app.get("models").Vulnerability.rawAttributes).filter(function (attribute) {
      if (!['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'attrsToSkip'].includes(attribute)) return model_attributes.push(`vulnerabilities.${attribute}`)
    })
    Object.keys(app.get("models").StigCommand.rawAttributes).filter(function (attribute) {
      if (!['id', 'createdAt', 'updatedAt', 'deletedAt', 'user_id', 'attrsToSkip'].includes(attribute)) return model_attributes.push(`stig_commands.${attribute}`)
    });
    // const headersArr = [];
    // const header = model_attributes.join(" , ")
    const rows = Vulnerabilities.map((Vulnerability) => {
      // var row = [];
      const obj = {};
      model_attributes.forEach(key => {
        let value = Vulnerability[key];
        if (key.includes("stig_commands.")) {
          const myKey = key.replace("stig_commands.", "");
          value = Vulnerability.commands && Vulnerability.commands[myKey] !== null ? Vulnerability.commands[myKey] : null;
        } else if (key.includes("vulnerabilities.")) {
          const myKey = key.replace("vulnerabilities.", "");
          value = Vulnerability[myKey];
        }
        // (!value) ? row.push("") : row.push(`${value.toString().trim().replace(/,/g, "\,")}`);
        obj[key] = value ? value.toString() : "";
        // (!value) ? row.push("") : row.push(`${value.toString()}`);
      });
      return obj;
      // return row.join(" , ");
    });

    return {
      header: model_attributes.map((ele) => {
        return { id: ele, title: ele }
      }), rows: rows
    };
    // return [header].concat(rows).join("\r\n");
  }

  async function addDataSTIGSWithRelationsToDB(stigData, isOverride = false) {
    try {
      const userId = await global.Auth.get_user_id();
      await insertStigFileWithVulns(stigData, userId, isOverride)
    } catch (err) {
      console.log("ERROR addDataSTIGSWithRelationsToDB : ", err);
    }
  }

  async function insertStigFileWithVulns(stigData, userId, isOverride) {
    console.log("insertStigFileWithVulns called with userId", userId, " isOverride: ", isOverride);
    try {
      const date = Date.now();
      const { stigName, vulnerabilities } = stigData;
      const STIGRef = vulnerabilities[0].STIGRef;
      var stig;
      let where = {};
      const order= {};
      if (isOverride) {
        /*const stigname  = stigName + '-imported-';
        where[Op.or] = [
          { name: { [Op.iLike]: `%${stigname}%` } }
        ];*/

        const stig1 = await app.get("models").Stig.findOne({
          where: {
          user_id: userId,
          status: true,
          stigref: STIGRef,
          },
          order: [["createdAt", 'DESC']],
        });
        if(!stig1){
          stig = await app.get("models").Stig.create({
            name: stigName + "-imported-" + date,
            user_id: userId,
            status: true,
            stigref: STIGRef
          });
        }else{
         // stig = stig1;
          await app.get("models").Stig.update({
            name: stigName + "-imported-" + date,
            updatedAt:new Date()
          },
          { 
            where: {
            id: stig1.id
            }
          });
          stig = await app.get("models").Stig.findOne({
            where: {
            id: stig1.id
            },
            order: [["createdAt", 'DESC']],
          });
        }
      } else {
        stig = await app.get("models").Stig.create({
          name: stigName + "-imported-" + date,
          user_id: userId,
          status: true,
          stigref: STIGRef
        });
      }
      const vulnerabilitiesArr = [];
      const stigCommandsArr = [];
      vulnerabilities.forEach((item) => {
        const description = item.Vuln_Discuss.replace(/(<([^>]+)>)/ig, '')
        const checkContent = item.Check_Content.replace(/(<([^>]+)>)/ig, '')
        const fixText = item.Fix_Text.replace(/(<([^>]+)>)/ig, '')
        const vulnObj = {
          user_id: userId,
          group_title: item.Group_Title,
          vuln_num: item.Vuln_Num,
          rule_id: item.Rule_ID,
          rule_ver: item.Rule_Ver,
          severity: item.Severity,
          status: true,
          finding_details: item.FINDING_DETAILS,
          comments: item.COMMENTS,
          target_key: item.TargetKey,
          cci_ref: item.CCI_REF,
          rule_title: item.Rule_Title,
          vuln_discuss: description,
          ia_controls: item.rmf,
          check_content: checkContent,
          fix_text: fixText,
          documentable: item.Documentable,
          false_positives: item.False_Positives,
          false_nigatives: item.False_Negatives,
          mitigations: item.Mitigations,
          potential_impact: item.Potential_Impact,
          third_party_tools: item.Third_Party_Tools,
          mitigation_control: item.Mitigation_Control,
          responsibility: item.Responsibility,
          security_override_guidance: item.Security_Override_Guidance,
          check_content_ref: item.Check_Content_Ref,
          class: item.Class,
          stig_ref: item.STIGRef,
          severity_override: item.SEVERITY_OVERRIDE,
          severity_justification: item.SEVERITY_JUSTIFICATION,
          stig_id: stig.id,
        };
        if (item['validation_cmd']) {
          const cmd = {
            vuln_num: item.Vuln_Num,
            validation_cmd: item.validation_cmd,
            remediation_cmd: item.remediation_cmd,
            validation_expected: item.validation_expected,
            validation_result: item.validation_result,
            validation_ip: item.validation_ip,
            remediation_expected: item.remediation_expected,
            remediation_result: item.remediation_result,
            remediation_ip: item.remediation_ip,
            done: !!item.done,
            status: !!item.status,
            user_id: userId,
            updatedAt: new Date(),
            stig_id: stig.id,
          };
          // vulnObj['StigCommand'] = cmd;
          stigCommandsArr.push(cmd)
        }
        vulnerabilitiesArr.push(vulnObj);
      });
      /*if(isOverride){
      let vulnerabilitiesinDb = await app.get("models").Vulnerability.findAll({ where: { stig_id: stig.id } });
      console.log("vulnerabilitiesinDblength : ", vulnerabilitiesinDb.length)
      console.log("vulnerabilitiesinDb : ", vulnerabilitiesinDb)
      vulnerabilities.forEach((item1) => {
      })
      }*/
      const [vulnsIds] = await Promise.all([
        insertVulns(vulnerabilitiesArr, isOverride),
        insertStigCommand(stigCommandsArr, isOverride)
      ]);
      if (vulnsIds && vulnsIds.length) {
        const stigsVuln = vulnsIds.map((id) => {
          return {
            stig_id: stig.id,
            vulnerability_id: id
          }
        });
        await app.get("models").StigVulnerability.bulkCreate(stigsVuln);
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  }
  async function insertVulns(vulnerabilitiesArr, withUpdate) {
    console.log("Inside insertVulns with withUpdate : ", withUpdate);
    const vulnsIds = [];
    if (!vulnerabilitiesArr || !vulnerabilitiesArr.length) {
      return vulnsIds;
    }
    for (let i = 0; i < vulnerabilitiesArr.length; i++) {
      const ele = vulnerabilitiesArr[i];
      let vulnObj;
      console.log("STIGId",ele.stig_id)
      if(withUpdate){
        let vulnObj1 = await app.get("models").Vulnerability.findOne({ where: { vuln_num: ele.vuln_num, stig_id: ele.stig_id } });
      if (!vulnObj1) {
        vulnObj = await app.get("models").Vulnerability.create(ele);
      } else {
        vulnObj = vulnObj1;
        delete ele['vuln_num'];
        await vulnObj.update(ele);
      }
      }else{
        vulnObj = await app.get("models").Vulnerability.create(ele);
      }
      vulnsIds.push(vulnObj.id);
    }
    return vulnsIds;
  }

  async function insertVulns1(vulnerabilitiesArr, withUpdate) {
    console.log("Inside insertVulns with withUpdate : ", withUpdate);
    const vulnsIds = [];
    if (!vulnerabilitiesArr || !vulnerabilitiesArr.length) {
      return vulnsIds;
    }
    for (let i = 0; i < vulnerabilitiesArr.length; i++) {
      const ele = vulnerabilitiesArr[i];
      let vulnObj = await app.get("models").Vulnerability.findOne({ where: { vuln_num: ele.vuln_num } });
      if (!vulnObj) {
        vulnObj = await app.get("models").Vulnerability.create(ele);
      } else if (withUpdate) {
        delete ele['vuln_num'];
        await vulnObj.update(ele);
      }
      
      vulnsIds.push(vulnObj.id);
    }
    return vulnsIds;
  }

  async function insertStigCommand(stigCommandsArr, withUpdate) {
    if (!stigCommandsArr || !stigCommandsArr.length) {
      return;
    }
    for (let i = 0; i < stigCommandsArr.length; i++) {
      const ele = stigCommandsArr[i];
      let stigCommandObj;
      if(withUpdate){
        let stigCommandObj1 = await app.get("models").StigCommand.findOne({ where: { vuln_num: ele.vuln_num, stig_id: ele.stig_id } });
        if (!stigCommandObj1) {
          stigCommandObj = await app.get("models").StigCommand.create(ele).then(sc => {
            console.log("Insertion done for : ", ele.vuln_num);
          });
         } else {
          stigCommandObj = stigCommandObj1;
        vuln = ele.vuln_num
        delete ele['vuln_num'];
        await stigCommandObj.update(ele, {
          where: { vuln_num: vuln, stig_id: ele.stig_id}
        }).then(() => {
          console.log("Update complete for : ", vuln);
        });
      }
      }else{
        stigCommandObj = await app.get("models").StigCommand.create(ele).then(sc => {
          console.log("Insertion done for : ", ele.vuln_num);
        });
      }
    }
  }
  async function insertStigCommand1(stigCommandsArr, withUpdate = false) {
    if (!stigCommandsArr || !stigCommandsArr.length) {
      return;
    }
    for (let i = 0; i < stigCommandsArr.length; i++) {
      const ele = stigCommandsArr[i];
      let stigCommandObj = await app.get("models").StigCommand.findOne({ where: { vuln_num: ele.vuln_num } });
      if (!stigCommandObj) {
        stigCommandObj = await app.get("models").StigCommand.create(ele).then(sc => {
          console.log("Insertion done for : ", ele.vuln_num);
        });
      } else if (withUpdate) {
        vuln = ele.vuln_num
        delete ele['vuln_num'];
        await stigCommandObj.update(ele, {
          where: { vuln_num: vuln }
        }).then(() => {
          console.log("Update complete for : ", vuln);
        });
      }
    }
  }

  function parseCSVFileData(dataToParse) {
    const array = dataToParse.toString().split("\r\n");
    const [headerRow, ...restRows] = array;
    let headers = headerRow.split(" , ");
    return restRows.map((row) => {
      const values = row.split(" , ");
      return mergeLabelsValues(headers, values);
    });
  }

  function mergeLabelsValues(labelsArr, valuesArr) {
    const result = {};
    for (let i = 0; i < labelsArr.length; i++) {
      result[labelsArr[i]] = valuesArr[i] ? valuesArr[i].replace("\,", ",") : "";
    }
    return result;
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

  function slashEscape(contents) {
    return contents
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
  }

  function slashUnescape(contents) {
    var replacements = { '\\\\': '\\', '\\n': '\n', '\\"': '"' };
    return contents.replace(/\\(\\|n|")/g, function (replace) {
      return replacements[replace];
    });
  }

  async function getNISTBySystemId(systemId, framework = 'NIST80053R4') {

    var modelName = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : (framework == 'NIST80053R5' ? 'NIST80053R5SSP' :'NIST800171R2SSP')

    try {
      var NIST_conditions = {
        system_id: systemId,
        active: true
      }

      const data = await app.get("models")[modelName].findOne({
        where: NIST_conditions
      });

      return data.dataValues;
    } catch (err) {
      console.log(`Error in getNISTBySystemId = ${JSON.stringify(err)}`);
      return null;
    }
  }
}
