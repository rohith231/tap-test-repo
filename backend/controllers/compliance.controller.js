const { utils, constants } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");

const { statusCodes } = constants;
const prefix = `/api/v1/compliance/`;

const { Op } = require('sequelize');
module.exports = (app) => {
  app.get(`${prefix}devices`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, framework, pageNumber, itemsPerPage, query_search, sortKey, descSort } = req.query;

      if (!system_id) {
        return utils.response(statusCodes.EXPECTATION_FAILED, "System couldn't be empty", req, res);
      }

      const device_conditions = { system_id: system_id, connectable: true };
      if (query_search) {
        device_conditions[Op.or] = [
          { ip_addr: { [Op.iLike]: `%${query_search}%` } },
          { mac_address: { [Op.iLike]: `%${query_search}%` } },
          { host_name: { [Op.iLike]: `%${query_search}%` } },
          { os_type: { [Op.iLike]: `%${query_search}%` } },
        ]

        if (query_search.toUpperCase() == 'CONNECTED') {
          device_conditions[Op.or].push({ connectable: true })
        } else if (query_search.toUpperCase() == 'WAITING') {
          device_conditions[Op.or].push({ touched_at: null })
        } else if (query_search.toUpperCase() == 'FAILED CONNECTION' || query_search.toUpperCase() == 'FAILED') {
          device_conditions[Op.not] = {
            touched_at: null,
            connectable: true
          }
        } else if (query_search == 0 || query_search == false || query_search == "false") {
          device_conditions[Op.or].push({ remediate: false })
          device_conditions[Op.or].push({ validate: false })
        } else if (query_search == 1 || query_search == true || query_search == "true") {
          device_conditions[Op.or].push({ remediate: true })
          device_conditions[Op.or].push({ validate: true })
        }
      }
      let order =
        sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
          ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
          : [['id', 'desc']]

      var custom_data = [];

      // Get Devices
      const deviceResult = await app.get("models").Device.findAndCountAll({
        where: device_conditions,
        order,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        })
      })
      const vulResult = await app.get("models").Vulnerability.findAndCountAll({ attributes: ['rule_title', 'severity', 'vuln_num', 'stig_ref', 'vuln_discuss', 'check_content', 'fix_text'] })
      const Vul_Array = []
      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : (framework == 'NIST80053R5' ? 'NIST80053R5CheckControl' :'NIST800171R2CheckControl')
      // Vul_Array = vulResult.rows
      // console.log("Vul_Array: ", vulResult.rows.length, deviceResult.rows.length)
      for (let device of deviceResult.rows) {
        let controls = []
        let totalVulnerabilities = 0, passCount = 0, failCount = 0, otherCount = 0
        const validationResult = await app.get("models").Validation.findAndCountAll({ where: { device_id: device.id } })

        for (let validation of validationResult.rows) {
          let control = null, vulPassCnt = 0, vulFailCnt = 0, vulOtherCnt = 0, ctrlPassCnt = 0, ctrlFailCnt = 0, ctrlOtherCnt = 0
          let isCustomControl = false
          let control_status = null
          let validation_cmd_status = false
          let remediation_cmd_status = false

          // SEARCH FOR PARENT CONTROL
          control = await app.get('models')[check_control_model_name].findOne({ where: { id: validation.control_id } })
          if (!control) {
            isCustomControl = true
            control = await app.get('models').CustomCheckControl.findOne({ where: { id: validation.control_id } })
          }

          // NORMAL CONTROLS
          if (control) {

            let controlName = control.framework_id == -1 ? isCustomControl ? control.control_number : control.name : control.control_number;

            var old_control = controls.filter(function (control) {
              return control.name == controlName;
            });
            var vulnerabilities = []
            controls = controls.filter(function (control) {
              return control.name != controlName
            })

            validation.status = validation.status === 'success' ? "COMPLIANT" : "NON-COMPLIANT";

            const vul = control.validation_controls.find(vc => vc.vuln_num === validation.vuln_num)
            const stig_commands = await app.get('models').StigCommand.findOne({ where: { vuln_num: validation.vuln_num } })
            if (stig_commands && vul) {
              validation_cmd_status = stig_commands && stig_commands.validation_cmd ? true : false
              remediation_cmd_status = stig_commands && stig_commands.remediation_cmd ? true : false
              if (vul.compliance_status && vul.compliance_status !== 'AUTOMATED') validation.status = vul.compliance_status
            }
            if (validation.status.toUpperCase() == "COMPLIANT") {
              vulPassCnt = vulPassCnt + 1;
            } else if (validation.status.toUpperCase() == "NON-COMPLIANT") {
              vulFailCnt = vulFailCnt + 1;
            } else {
              vulOtherCnt = vulOtherCnt + 1;
            }
            if (old_control && old_control.length > 0) {
              old_control[0].vulnerabilities.push({
                status: validation.status,
                vuln_num: validation.vuln_num,
                vulnerability: vulResult.rows.find(v => v.vuln_num == validation.vuln_num),
                validation_cmd_status,
                remediation_cmd_status
              })
              vulnerabilities = old_control[0].vulnerabilities
              totalVulnerabilities = totalVulnerabilities + 1
            } else {
              vulnerabilities.push({
                status: validation.status,
                vuln_num: validation.vuln_num,
                vulnerability: vulResult.rows.find(v => v.vuln_num == validation.vuln_num),
                validation_cmd_status,
                remediation_cmd_status
              })
              totalVulnerabilities = totalVulnerabilities + 1
            }

            // SET CONTROL STATUS
            control_status = 'COMPLIANT'
            if (vulnerabilities.filter(v => v.status == "NON-COMPLIANT").length > 0) control_status = 'NON-COMPLIANT'

            // SET VULNERABILITY STATUS BASED ON CONTROL STATUS
            if (control.compliance_status === 'COMPLIANT') {
              console.log("control.compliance_status");
              vulPassCnt = 0;
              vulnerabilities.forEach((v) => {
                if (v.status.toUpperCase() == "NON-COMPLIANT") {
                  vulFailCnt = vulFailCnt - 1;
                } else if (v.status.toUpperCase() == "NOT-APPLICABLE") {
                  vulOtherCnt = vulOtherCnt - 1;
                }
                v.status = "COMPLIANT";
                vulPassCnt = vulPassCnt + 1;
              });
              control_status = 'COMPLIANT'
            } else if (control.compliance_status === 'NON-COMPLIANT') {
              console.log("control.compliance_status: Non");
              vulFailCnt = 0;
              vulnerabilities.forEach((v) => {
                if (v.status.toUpperCase() == "COMPLIANT") {
                  vulPassCnt = vulPassCnt - 1;
                } else if (v.status.toUpperCase() == "NOT-APPLICABLE") {
                  vulOtherCnt = vulOtherCnt - 1;
                }
                v.status = "NON-COMPLIANT";
                vulFailCnt = vulFailCnt + 1;
              });
              control_status = 'NON-COMPLIANT'
            } else if (control.compliance_status === 'NOT-APPLICABLE') {
              console.log("control.compliance_status: Not");
              vulOtherCnt = 0;
              vulnerabilities.forEach((v) => {
                if (v.status.toUpperCase() == "COMPLIANT") {
                  vulPassCnt = vulPassCnt - 1;
                } else if (v.status.toUpperCase() == "NON-COMPLIANT") {
                  vulFailCnt = vulFailCnt - 1;
                }
                v.status = "NON-APPLICABLE";
                vulOtherCnt = vulOtherCnt + 1;
              });
              control_status = 'NOT-APPLICABLE'
            }
            passCount = passCount + vulPassCnt;
            failCount = failCount + vulFailCnt;
            otherCount = otherCount + vulOtherCnt;
            vulnerabilities.forEach((v) => {
              if (v.status.toUpperCase() == "COMPLIANT") {
                ctrlPassCnt = ctrlPassCnt + 1;
              } else if (v.status.toUpperCase() == "NON-COMPLIANT") {
                ctrlFailCnt = ctrlFailCnt + 1;
              } else if (v.status.toUpperCase() == "NOT-APPLICABLE") {
                ctrlOtherCnt = ctrlOtherCnt + 1;
              }
            });
            controls.push({
              name: controlName,
              updated: validation.updated_at,
              vulnerabilities: vulnerabilities.sort(utils.sortAlphaNum),
              control_status: control_status,
              passCount: ctrlPassCnt,
              failCount: ctrlFailCnt,
              otherCount: ctrlOtherCnt,
              passPercentage: (ctrlPassCnt/vulnerabilities.length)*100,
              failPercentage: (ctrlFailCnt/vulnerabilities.length)*100,
              otherPercentage: (ctrlOtherCnt/vulnerabilities.length)*100,
              totalCount: vulnerabilities.length
            })
          }
        }

        var controlCOMPLIANT = controls.filter(function (control) {
          return control.control_status == "COMPLIANT"
        })

        let status = 'WAITING'

        // SET STATUS
        if (device.connectable) {
          status = controls.length === controlCOMPLIANT.length && controls.length > 0
            ? 'COMPLIANT'
            : controls.length == 0
              ? 'No CONTROLS ASSIGNED'
              : 'NON-COMPLIANT'
        }

        var stigdetails = "";
        if (controls.length > 0) {
          if (controls[0].vulnerabilities.length > 0) {
            stigdetails = controls[0].vulnerabilities[0].vulnerability.stig_ref
            // console.log("stigdetails: ", stigdetails);
          }
        }
        // FINAL DATA
        custom_data.push({
          host_name:device.host_name,
          os_info:device.os_info,
          ip_addr: device.ip_addr,
          mac_address: device.mac_address,
          id: device.id,
          status: status,
          passCount: passCount,
          failCount: failCount,
          otherCount: otherCount,
          passPercentage: (passCount/totalVulnerabilities)*100,
          failPercentage: (failCount/totalVulnerabilities)*100,
          otherPercentage: (otherCount/totalVulnerabilities)*100,
          totalCount: totalVulnerabilities,
          stig: stigdetails,
          controls: controls.sort(utils.sortAlphaNum)
        })
      }

      const resp = {
        rows: custom_data,
        count: deviceResult.count
      }

      return utils.response(statusCodes.SUCCESS, resp, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}controllers`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, framework, } = req.query;
      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res);
      }
      var custom_data = [];

      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : (framework == 'NIST80053R5' ? 'NIST80053R5CheckControl' :'NIST800171R2CheckControl')
      const controlsResult = await Promise.all([app.get("models")[check_control_model_name].findAll({
        where: {
          system_id: system_id,
          validate: true
        },
        include: [{
          model: app.get("models").Validation.unscoped(),
          required: false,
          include: [{
            model: app.get("models").Device.unscoped(),
            where: { connectable: true }
          }]
        }]
      }), app.get("models").CustomCheckControl.findAll({
        where: {
          system_id: system_id,
          validate: true
        },
        include: [{
          model: app.get("models").Validation.unscoped(),
          required: false,
          include: [{
            model: app.get("models").Device.unscoped(),
            where: { connectable: true }
          }]
        }]
      })])

      const controls = controlsResult[0].concat(controlsResult[1])
      // console.log("controls: ", controls.length)
      const vulResult = await app.get("models").Vulnerability.findAndCountAll({ attributes: ['rule_title', 'severity', 'vuln_num', 'stig_ref', 'vuln_discuss', 'check_content', 'fix_text'] })
      // console.log("Vul_Array: ", vulResult.rows.length)
      for (let index = 0; index < controls.length; index++) {
        let ctrlPassCnt = 0, ctrlFailCnt = 0, ctrlOtherCnt = 0;
        const control = controls[index];
        let devices = []

        let name = control.control_number;

        let validations = control.Validations

        let vulnerabilities = []
        let overallStatus = null

        for (let index = 0; index < validations.length; index++) {
          let devicePassCnt = 0, deviceFailCnt = 0, deviceOtherCnt = 0;
          const validation = validations[index];
          var devices_vulnerabilities = []

          // SET STATUS
          let validation_status = validation.status === 'success' ? "COMPLIANT" : "NON-COMPLIANT";
          overallStatus = validation.status === 'success' ? 'COMPLIANT' : 'NON-COMPLIANT'

          var validation_cmd_status = false
          var remediation_cmd_status = false

          const vul = control.validation_controls.find(vc => vc.vuln_num === validation.vuln_num)
          if (vul) {
            validation_cmd_status = vul.commands && vul.commands.validation_cmd ? true : false
            remediation_cmd_status = vul.commands && vul.commands.remediation_cmd ? true : false
            if (vul.compliance_status && vul.compliance_status !== 'AUTOMATED') validation_status = vul.compliance_status
          }

          vulnerabilities.push({
            status: validation_status,
            vuln_num: validation.vuln_num,
            vulnerability: vulResult.rows.find(v => v.vuln_num == validation.vuln_num),
            validation_cmd_status,
            remediation_cmd_status
          })
          devices_vulnerabilities.push({
            status: validation_status,
            vuln_num: validation.vuln_num,
            vulnerability: vulResult.rows.find(v => v.vuln_num == validation.vuln_num),
            validation_cmd_status,
            remediation_cmd_status
          })

          let device = validation.Device;
          let deviceIp_addr = device && device.ip_addr;
          var already_in_devices = devices.filter(function (dev) {
            return dev && dev.ip_addr == deviceIp_addr
          })

          if (already_in_devices && already_in_devices.length > 0) {
            devices_vulnerabilities = already_in_devices[0].vulnerabilities
          }
          devices_vulnerabilities.push({
            status: validation_status,
            vuln_num: validation.vuln_num,
            vulnerability: vulResult.rows.find(v => v.vuln_num == validation.vuln_num),
            validation_cmd_status,
            remediation_cmd_status
          })

          devices_vulnerabilities = devices_vulnerabilities.reduce((accumulator, current) => accumulator.some(x => x.vuln_num === current.vuln_num) ? accumulator : [...accumulator, current], [])

          // SET CONTROL STATUS
          overallStatus = 'COMPLIANT'
          if (vulnerabilities.filter(v => v.status == "NON-COMPLIANT").length > 0) overallStatus = 'NON-COMPLIANT'
          if (devices_vulnerabilities.filter(v => v.status == "NON-COMPLIANT").length > 0) overallStatus = 'NON-COMPLIANT'

          // SET VULNERABILITY STATUS BASED ON CONTROL STATUS
          if (control.compliance_status === 'COMPLIANT') {
            vulnerabilities.forEach(v => v.status = "COMPLIANT")
            devices_vulnerabilities.forEach(v => v.status = "COMPLIANT")
            overallStatus = 'COMPLIANT'
          } else if (control.compliance_status === 'NON-COMPLIANT') {
            vulnerabilities.forEach(v => v.status = "NON-COMPLIANT")
            devices_vulnerabilities.forEach(v => v.status = "NON-COMPLIANT")
            overallStatus = 'NON-COMPLIANT'
          } else if (control.compliance_status === 'NOT-APPLICABLE') {
            vulnerabilities.forEach(v => v.status = "NOT-APPLICABLE")
            devices_vulnerabilities.forEach(v => v.status = "NOT-APPLICABLE")
            overallStatus = 'NOT-APPLICABLE'
          }
          devices_vulnerabilities.forEach(v => {
            if (v.status.toUpperCase() == "COMPLIANT") {
              devicePassCnt = devicePassCnt + 1;
            }
            else if (v.status.toUpperCase() == "NON-COMPLIANT") {
              deviceFailCnt = deviceFailCnt + 1;
            } else if (v.status.toUpperCase() == "NOT-APPLICABLE") {
              deviceOtherCnt = deviceOtherCnt + 1;
            }
          })
          devices.push({
            ip_addr: (device) ? device.ip_addr : '',
            updated: validation.updated_at,
            totalCount: devices_vulnerabilities.length,
            passCount: devicePassCnt,
            failCount: deviceFailCnt,
            otherCount: deviceOtherCnt,
            passPercentage: (devicePassCnt/devices_vulnerabilities.length)*100,
            failPercentage: (deviceFailCnt/devices_vulnerabilities.length)*100,
            otherPercentage: (deviceOtherCnt/devices_vulnerabilities.length)*100,
            vulnerabilities: devices_vulnerabilities.sort(utils.sortAlphaNum),
            device_status: overallStatus
          })

        }
        vulnerabilities = vulnerabilities.reduce((accumulator, current) => accumulator.some(x => x.vuln_num === current.vuln_num) ? accumulator : [...accumulator, current], [])
        devices = devices.reduce((accumulator, current) => accumulator.some(x => x.ip_addr === current.ip_addr) ? accumulator : [...accumulator, current], [])

        if (vulnerabilities.length > 0) {
          vulnerabilities.forEach(v => {
            if (v.status.toUpperCase() == "COMPLIANT") {
              ctrlPassCnt = ctrlPassCnt + 1;
            }
            else if (v.status.toUpperCase() == "NON-COMPLIANT") {
              ctrlFailCnt = ctrlFailCnt + 1;
            } else if (v.status.toUpperCase() == "NOT-APPLICABLE") {
              ctrlOtherCnt = ctrlOtherCnt + 1;
            }
          })
          custom_data.push({
            name: name,
            id: control.id,
            CheckControl: control,
            totalCount: vulnerabilities.length,
            passCount: ctrlPassCnt,
            failCount: ctrlFailCnt,
            otherCount: ctrlOtherCnt,
            passPercentage: (ctrlPassCnt/vulnerabilities.length)*100,
            failPercentage: (ctrlFailCnt/vulnerabilities.length)*100,
            otherPercentage: (ctrlOtherCnt/vulnerabilities.length)*100,
            vulnerabilities: vulnerabilities.sort(utils.sortAlphaNum),
            status: overallStatus,
            devices: devices
          })
        }
      }

      // Sort by control name
      custom_data.sort(utils.sortAlphaNum)

      return utils.response(statusCodes.SUCCESS, custom_data, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`${prefix}reset`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      await app.get("models").Validation.destroy({
        where: {},
        truncate: true,
        force: true
      });
      return utils.response(statusCodes.SUCCESS, [], req, res);
    } catch (err) {
      console.error(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
}
