const { utils, constants, cache } = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const { statusCodes } = constants;
const prefix = `/api/v1/dashboard/`;

const { Op } = require('sequelize');
module.exports = (app) => {
  app.post(`${prefix}widget`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const data = req.body;
      const dashboard_widget = data.dashboard_widget;
      const id = await global.Auth.get_user_id();
      if (id) {
        await app.get("models").User.update({ dashboard_widget: dashboard_widget }, { where: { id } });
        cache.deleteItem('user-info');
        return utils.response(statusCodes.SUCCESS, "Dashboard widget updated successfully", req, res);
      }
      await app.get("models").AuditControl.create(data);
      return utils.response(statusCodes.SUCCESS, "Dashboard widget added successfully", req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  })
  app.get(`${prefix}charts/audit/controllers`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, framework } = req.query;
      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res);
      }

      var statistic = {
        num_of_WAITING: 0,
        num_of_COMPLIANT: 0,
        num_of_NONCOMPLIANT: 0,
        total: 0
      }

      var custom_data = [], modelName="";
      if (framework == 'NIST80053R4') {
        modelName = 'NIST80053R4CheckControl'
      }else if(framework == 'NIST80053R5'){
        modelName = 'NIST80053R5CheckControl'
      }else{
        modelName = 'NIST800171R2CheckControl'
      }

      const controlsResult = await Promise.all([app.get("models")[modelName].findAll({
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
      // console.log("controls: ",controls.length);
      for (let index = 0; index < controls.length; index++) {
        const control = controls[index];
        let devices = []

        let name = control.control_number;

        let validations = control.Validations

        let vulnerabilities = []
        let validation_status = null
        let overallStatus = null

        for (let index = 0; index < validations.length; index++) {
          const validation = validations[index];
          var devices_vulnerabilities = []

          // SET STATUS
          validation_status = validation.status === 'success' ? "COMPLIANT" : "NON-COMPLIANT";
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
            validation_cmd_status,
            remediation_cmd_status
          })
          devices_vulnerabilities.push({
            status: validation_status,
            vuln_num: validation.vuln_num,
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

          devices.push({
            ip_addr: (device) ? device.ip_addr : '',
            updated: validation.updated_at,
            vulnerabilities: devices_vulnerabilities.sort(utils.sortAlphaNum),
            device_status: overallStatus
          })

        }
        vulnerabilities = vulnerabilities.reduce((accumulator, current) => accumulator.some(x => x.vuln_num === current.vuln_num) ? accumulator : [...accumulator, current], [])
        devices = devices.reduce((accumulator, current) => accumulator.some(x => x.ip_addr === current.ip_addr) ? accumulator : [...accumulator, current], [])

     
        if (vulnerabilities.length > 0) {
          if (!name.includes('custom')) {
            if (overallStatus == 'COMPLIANT') {
              statistic.num_of_COMPLIANT++;
              statistic.total++;
            } else if (overallStatus == 'NON-COMPLIANT') {
              statistic.num_of_NONCOMPLIANT++;
              statistic.total++;
            } else {
              statistic.num_of_WAITING++;
              statistic.total++;
            }
          }

          custom_data.push({
            name: name,
            id: control.id,
            CheckControl: control,
            vulnerabilities: vulnerabilities.sort(utils.sortAlphaNum),
            status: overallStatus,
            devices: devices
          })
        }
      }

      var statsInPercentage = {};

      for (var key in statistic) {
        if (key !== 'total') {
          var percentage = (statistic[key] / statistic.total) * 100;
          statsInPercentage[key] = isNaN(percentage) ? 0 : (percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2));
        }
      }

      // Sort by control name
      custom_data.sort(utils.sortAlphaNum)

      return utils.response(statusCodes.SUCCESS, statsInPercentage, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}charts/compliance/devices`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, pageNumber, itemsPerPage, query_search, framework } = req.query;

      if (!system_id) {
        return utils.response(statusCodes.EXPECTATION_FAILED, "System couldn't be empty", req, res);
      }

      var statistic = {
        num_of_WAITING: 0,
        num_of_COMPLIANT: 0,
        num_of_NONCOMPLIANT: 0,
        total: 0,
      }

      const device_conditions = { system_id: system_id };
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

      var custom_data = [], modelName="";
      if (framework == 'NIST80053R4') {
        modelName = 'NIST80053R4CheckControl'
      }else if(framework == 'NIST80053R5'){
        modelName = 'NIST80053R5CheckControl'
      }else{
        modelName='NIST800171R2CheckControl'
      }

      // Get Devices
      const deviceResult = await app.get("models").Device.findAndCountAll({
        where: device_conditions,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        })
      })

// console.log("devices count: ", deviceResult.rows.length);

      for (let device of deviceResult.rows) {
        let controls = []
        const validationResult = await app.get("models").Validation.findAndCountAll({ where: { device_id: device.id } })

        for (let validation of validationResult.rows) {
          let control = null
          let isCustomControl = false
          let control_status = null
          let validation_cmd_status = false
          let remediation_cmd_status = false

          // SEARCH FOR PARENT CONTROL
          control = await app.get('models')[modelName].findOne({ where: { id: validation.control_id } })
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

            if (old_control && old_control.length > 0) {
              old_control[0].vulnerabilities.push({
                status: validation.status,
                vuln_num: validation.vuln_num,
                validation_cmd_status,
                remediation_cmd_status
              })
              vulnerabilities = old_control[0].vulnerabilities
            } else {
              vulnerabilities.push({
                status: validation.status,
                vuln_num: validation.vuln_num,
                validation_cmd_status,
                remediation_cmd_status
              })
            }

            // SET CONTROL STATUS
            control_status = 'COMPLIANT'
            if (vulnerabilities.filter(v => v.status == "NON-COMPLIANT").length > 0) control_status = 'NON-COMPLIANT'

            // SET VULNERABILITY STATUS BASED ON CONTROL STATUS
            if (control.compliance_status === 'COMPLIANT') {
              vulnerabilities.forEach(v => v.status = "COMPLIANT")
              control_status = 'COMPLIANT'
            } else if (control.compliance_status === 'NON-COMPLIANT') {
              vulnerabilities.forEach(v => v.status = "NON-COMPLIANT")
              control_status = 'NON-COMPLIANT'
            } else if (control.compliance_status === 'NOT-APPLICABLE') {
              vulnerabilities.forEach(v => v.status = "NOT-APPLICABLE")
              control_status = 'NOT-APPLICABLE'
            }

            controls.push({
              name: controlName,
              updated: validation.updated_at,
              vulnerabilities: vulnerabilities.sort(utils.sortAlphaNum),
              control_status: control_status,
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
              ? 'WAITING'
              : 'NON-COMPLIANT'
        }


        if (status == 'WAITING') {
          statistic.num_of_WAITING++;
          statistic.total++;
        } else if (status == 'COMPLIANT') {
          statistic.num_of_COMPLIANT++;
          statistic.total++;
        } else if (status == 'NON-COMPLIANT') {
          statistic.num_of_NONCOMPLIANT++;
          statistic.total++;
        }

        // FINAL DATA
        custom_data.push({
          ip_addr: device.ip_addr,
          mac_address: device.mac_address,
          id: device.id,
          status: status,
          controls: controls.sort(utils.sortAlphaNum)
        })
      }

      var statsInPercentage = {};

      for (var key in statistic) {
        if (key !== 'total') {
          var percentage = (statistic[key] / statistic.total) * 100;
          statsInPercentage[key] = isNaN(percentage) ? 0 : (percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2));
        }
      }

      return utils.response(statusCodes.SUCCESS, statsInPercentage, req, res);
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.get(`${prefix}charts/compliance/controllers`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, framework } = req.query;
      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res);
      }

      var statistic = {
        num_of_WAITING: 0,
        num_of_COMPLIANT: 0,
        num_of_NONCOMPLIANT: 0,
        total: 0,
      }

      var custom_data = [], modelName="";
      if (framework == 'NIST80053R4') {
        modelName = 'NIST80053R4CheckControl'
      }else if(framework == 'NIST80053R5'){
        modelName = 'NIST80053R5CheckControl'
      } else {
        modelName ='NIST800171R2CheckControl'
      }
      const controlsResult = await Promise.all([app.get("models")[modelName].findAll({
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
      // console.log("device_controls: ", controls.length);
      for (let index = 0; index < controls.length; index++) {
        const control = controls[index];
        let devices = []

        let name = control.control_number;

        let validations = control.Validations

        let vulnerabilities = []
        let overallStatus = null

        for (let index = 0; index < validations.length; index++) {
          const validation = validations[index];
          var devices_vulnerabilities = []

          // SET STATUS
          validation_status = validation.status === 'success' ? "COMPLIANT" : "NON-COMPLIANT";
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
            validation_cmd_status,
            remediation_cmd_status
          })
          devices_vulnerabilities.push({
            status: validation_status,
            vuln_num: validation.vuln_num,
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

          devices.push({
            ip_addr: (device) ? device.ip_addr : '',
            updated: validation.updated_at,
            vulnerabilities: devices_vulnerabilities.sort(utils.sortAlphaNum),
            device_status: overallStatus
          })

        }
        vulnerabilities = vulnerabilities.reduce((accumulator, current) => accumulator.some(x => x.vuln_num === current.vuln_num) ? accumulator : [...accumulator, current], [])
        devices = devices.reduce((accumulator, current) => accumulator.some(x => x.ip_addr === current.ip_addr) ? accumulator : [...accumulator, current], [])


        if (vulnerabilities.length > 0) {
          if (overallStatus == 'COMPLIANT') {
            statistic.num_of_COMPLIANT++;
            statistic.total++;
          } else if (overallStatus == 'NON-COMPLIANT') {
            statistic.num_of_NONCOMPLIANT++;
            statistic.total++;
          } else {
            statistic.num_of_WAITING++;
            statistic.total++;
          }

          custom_data.push({
            name: name,
            id: control.id,
            CheckControl: control,
            vulnerabilities: vulnerabilities.sort(utils.sortAlphaNum),
            status: overallStatus,
            devices: devices
          })
        }
      }

      var statsInPercentage = {};

      for (var key in statistic) {
        if (key !== 'total') {
          var percentage = (statistic[key] / statistic.total) * 100;
          statsInPercentage[key] = isNaN(percentage) ? 0 : (percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2));
        }
      }

      // Sort by control name
      custom_data.sort(utils.sortAlphaNum)

      return utils.response(statusCodes.SUCCESS, statsInPercentage, req, res);
    } catch (err) {
      console.log({ err })
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
}
