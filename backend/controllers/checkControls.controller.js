const { utils, constants } = require('../helpers')
const authenticationMiddleware = require('../middlewares/authentication')

const { statusCodes } = constants
const prefix = `/api/v1/checkControls/`

const { Op, Sequelize } = require('sequelize')

module.exports = (app) => {
  app.get(`${prefix}system/framework`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let sortOrder
    try {
      const {
        system_id,
        framework_id,
        pageNumber,
        itemsPerPage,
        query_search,
        sortKey,
        descSort,
        framework,
      } = req.query

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }
      let ssp_model_name = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : 'NIST800171R2SSP'
      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : 'NIST800171R2CheckControl'
      let control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4Control' : 'NIST800171R2Control'
      let audit_control_model_name = 'AuditControl';
        if(framework=="NIST80053R5"){
          ssp_model_name="NIST80053R5SSP"
          check_control_model_name="NIST80053R5CheckControl"
          control_model_name="NIST80053R5Control"
          audit_control_model_name="AuditR5Control"
        }
      let searchWhere = {}
      console.log("ssp_model_name: ", ssp_model_name, check_control_model_name, control_model_name);
      //means nest controls
      if (Number(framework_id) == 1) {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          if (framework == 'NIST80053R4') {
            searchWhere[Op.or] = [
              { '$NIST80053R4CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R4CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R4CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else if (framework == 'NIST80053R5') {
            searchWhere[Op.or] = [
              { '$NIST80053R5CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R5CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R5CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else {
            searchWhere[Op.or] = [
              { '$NIST800171R2CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST800171R2CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST800171R2CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { NIST80053r4_controls: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          }
        }

        const where = {
          ...searchWhere,
        }
        if (framework == 'NIST80053R4' || framework=='NIST80053R5') {
          let Ssps = await app.get('models')[ssp_model_name].findOne({
            where: {
              system_id: system_id,
              active: true,
            },
          })
          let securityCat = ''
          if (Ssps) {
            securityCat = [Ssps.baseline_security_cat.toUpperCase()]
          } else {
            // return utils.response(statusCodes.BAD_REQUEST, "Please complete the system categorization in the system security plan (SSP).", req, res);
          }

          if (!where[Op.or]) {
            where[Op.or] = [
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ]
          } else {
            where[Op.or].push([
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ])
          }
          where['framework_id'] = framework_id
          where['withdrawn'] = null
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
            
        if (sortKey === 'number' && descSort !== undefined) {
          sortOrder = descSort === 'true' ? 'DESC' : 'ASC'
          order = [
            Sequelize.literal(
              `SUBSTRING(number FROM '[A-Z]+') ${sortOrder},COALESCE(SUBSTRING(number FROM '(?<=-)[0-9]+')::INTEGER, 0) ${sortOrder},SUBSTRING(number FROM '(?<=\\()[0-9]+')::BIGINT ${sortOrder} NULLS FIRST`,
            ),
          ]
        }

        const include = [
          {
            model: app.get('models')[check_control_model_name].scope(null),
            required: false,
            where: {
              system_id: system_id,
            },
            order: [[app.get('models')[audit_control_model_name], 'updatedAt', 'ASC']],
            include: [
              {
                model: app.get('models')[audit_control_model_name].scope(null),
                required: false,
                limit: 1,
                order: [['updatedAt', 'DESC']],
                where: {
                  is_draft: false,
                },
              },
            ],
          },
        ]
        console.log("where: ", where);
        if (framework == 'NIST80053R5') {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        } else {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        }
      } else {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          searchWhere[Op.or] = [
            { name: { [Op.iLike]: `%${query_search}%` } },
            { os: { [Op.iLike]: `%${query_search}%` } },
            { sensitivity_level: { [Op.iLike]: `%${query_search}%` } },
          ]
          if (query_search == 0 || query_search == false || query_search == 'false') {
            searchWhere[Op.or].push({ remediate: false })
          } else if (query_search == 1 || query_search == true || query_search == 'true') {
            searchWhere[Op.or].push({ remediate: true })
          }
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
        const controls = await app.get('models').CustomCheckControl.findAndCountAll({
          order,
          where: {
            system_id: system_id,
            ...searchWhere,
          },
          ...app.get('models').paginate({
            pageNumber,
            itemsPerPage,
          }),
        })
        return utils.response(statusCodes.SUCCESS, controls, req, res)
      }
    } catch (err) {
      console.log("checkcontrol err: ",err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(`${prefix}system/allframework`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let sortOrder
    try {
      const {
        system_id,
        framework_id,
        pageNumber,
        itemsPerPage,
        query_search,
        sortKey,
        descSort,
        framework,
      } = req.query

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }
      let ssp_model_name = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : 'NIST800171R2SSP'
      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : 'NIST800171R2CheckControl'
      let control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4Control' : 'NIST800171R2Control'
      let audit_control_model_name = 'AuditControl';
        if(framework=="NIST80053R5"){
          ssp_model_name="NIST80053R5SSP"
          check_control_model_name="NIST80053R5CheckControl"
          control_model_name="NIST80053R5Control"
          audit_control_model_name="AuditR5Control"
        }
      let searchWhere = {}
      console.log("ssp_model_name: ", ssp_model_name, check_control_model_name, control_model_name);
      //means nest controls
      if (Number(framework_id) == 1) {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          if (framework == 'NIST80053R4') {
            searchWhere[Op.or] = [
              { '$NIST80053R4CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R4CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R4CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else if (framework == 'NIST80053R5') {
            searchWhere[Op.or] = [
              { '$NIST80053R5CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R5CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R5CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else {
            searchWhere[Op.or] = [
              { '$NIST800171R2CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST800171R2CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST800171R2CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { NIST80053r4_controls: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          }
        }

        const where = {
          ...searchWhere,
        }
        if (framework == 'NIST80053R4' || framework=='NIST80053R5') {
          let Ssps = await app.get('models')[ssp_model_name].findOne({
            where: {
              system_id: system_id,
              active: true,
            },
          })
          let securityCat = ''
          if (Ssps) {
            securityCat = [Ssps.baseline_security_cat.toUpperCase()]
          } else {
            // return utils.response(statusCodes.BAD_REQUEST, "Please complete the system categorization in the system security plan (SSP).", req, res);
          }

          if (!where[Op.or]) {
            where[Op.or] = [
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ]
          } else {
            where[Op.or].push([
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ])
          }
          where['framework_id'] = framework_id
          where['withdrawn'] = null
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
            
        if (sortKey === 'number' && descSort !== undefined) {
          sortOrder = descSort === 'true' ? 'DESC' : 'ASC'
          order = [
            Sequelize.literal(
              `SUBSTRING(number FROM '[A-Z]+') ${sortOrder},COALESCE(SUBSTRING(number FROM '(?<=-)[0-9]+')::INTEGER, 0) ${sortOrder},SUBSTRING(number FROM '(?<=\\()[0-9]+')::BIGINT ${sortOrder} NULLS FIRST`,
            ),
          ]
        }

        const include = [
          {
            model: app.get('models')[check_control_model_name].scope(null),
            required: false,
            where: {
              system_id: system_id,
            },
            order: [[app.get('models')[audit_control_model_name], 'updatedAt', 'ASC']],
            include: [
              {
                model: app.get('models')[audit_control_model_name].scope(null),
                required: false,
                limit: 1,
                order: [['updatedAt', 'DESC']],
                where: {
                  is_draft: false,
                },
              },
            ],
          },
        ]
        console.log("where: ", where);
        if (framework == 'NIST80053R5') {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              // ...app.get('models').paginate({
              //   pageNumber,
              //   itemsPerPage,
              // }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        } else {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              // ...app.get('models').paginate({
              //   pageNumber,
              //   itemsPerPage,
              // }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        }
      } else {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          searchWhere[Op.or] = [
            { name: { [Op.iLike]: `%${query_search}%` } },
            { os: { [Op.iLike]: `%${query_search}%` } },
            { sensitivity_level: { [Op.iLike]: `%${query_search}%` } },
          ]
          if (query_search == 0 || query_search == false || query_search == 'false') {
            searchWhere[Op.or].push({ remediate: false })
          } else if (query_search == 1 || query_search == true || query_search == 'true') {
            searchWhere[Op.or].push({ remediate: true })
          }
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
        const controls = await app.get('models').CustomCheckControl.findAndCountAll({
          order,
          where: {
            system_id: system_id,
            ...searchWhere,
          },
          // ...app.get('models').paginate({
          //   pageNumber,
          //   itemsPerPage,
          // }),
        })
        return utils.response(statusCodes.SUCCESS, controls, req, res)
      }
    } catch (err) {
      console.log("checkcontrol err: ",err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })

  app.get(`${prefix}assessmentsystems/framework`, /*[authenticationMiddleware.decodeJWT],*/ async (req, res) => {
    let sortOrder
    try {
      const {
        system_id,
        framework_id,
        pageNumber,
        itemsPerPage,
        query_search,
        sortKey,
        descSort,
        framework,
      } = req.query

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }
      let ssp_model_name = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : 'NIST800171R2SSP'
      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : 'NIST800171R2CheckControl'
      let control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4Control' : 'NIST800171R2Control'
      let audit_control_model_name = 'AuditControl';
       let control_name = 'AuditControls';
     
      if (framework == "NIST80053R5") {
        ssp_model_name = "NIST80053R5SSP"
        check_control_model_name = "NIST80053R5CheckControl"
        control_model_name = "NIST80053R5Control"
        audit_control_model_name = "AuditR5Control"
        control_name = "AuditR5Controls"
      }
      let searchWhere = {}
      console.log("ssp_model_name: ", ssp_model_name, check_control_model_name, control_model_name);
      //means nest controls
      if (Number(framework_id) == 1) {


        const auditcontrols = await app.get("models")[audit_control_model_name].findAll({
          attributes: [
            // specify an array where the first element is the SQL function and the second is the alias
            [Sequelize.fn('DISTINCT', Sequelize.col('control_number')), 'control_number'],

            // specify any additional columns, e.g. country_code
            // 'country_code'

          ]
        });

        var finalauditcontrols =[];
        auditcontrols.forEach(auditcontrol => {
          finalauditcontrols.push(auditcontrol.control_number)
          });
          const where = {
            number : finalauditcontrols
          }
        let order =
          sortKey &&
            sortKey != null &&
            sortKey !== 'null' &&
            sortKey !== 'undefined' &&
            typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]

        if (sortKey === 'number' && descSort !== undefined) {
          sortOrder = descSort === 'true' ? 'DESC' : 'ASC'
          order = [
            Sequelize.literal(
              `SUBSTRING(number FROM '[A-Z]+') ${sortOrder},COALESCE(SUBSTRING(number FROM '(?<=-)[0-9]+')::INTEGER, 0) ${sortOrder},SUBSTRING(number FROM '(?<=\\()[0-9]+')::BIGINT ${sortOrder} NULLS FIRST`,
            ),
          ]
        }

        const include = [
          {
            model: app.get('models')[check_control_model_name].scope(null),
            required: false,
            where: {
              system_id: system_id,
            },
            order: [[app.get('models')[audit_control_model_name], 'updatedAt', 'ASC']],
            include: [
              {
                model: app.get('models')[audit_control_model_name].scope(null),
                required: false,
                limit: 1,
                order: [['updatedAt', 'DESC']],
                where: {
                  is_draft: false,
                },
              },
            ],
          },
        ]
        console.log("where: ", where);
        if (framework == 'NIST80053R5') {
          const assessmentrows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              // where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
            var rows =[];
            assessmentrows.forEach(row => {
              if(row[check_control_model_name]!=null && row[check_control_model_name][control_name].length>0){
                 rows.push(row)
              }
              });
            var count = rows.length
          
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        } else {
          const assessmentrows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
            var rows =[];
            assessmentrows.forEach(row => {
             if(row[check_control_model_name]!=null && row[check_control_model_name][control_name].length>0){
                 rows.push(row)
              }
              });
            var count = rows.length
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res);
        }
        } else {
          if (
            query_search &&
            typeof query_search !== 'undefined' &&
            query_search !== 'null' &&
            query_search !== 'undefined'
          ) {
            searchWhere[Op.or] = [
              { name: { [Op.iLike]: `%${query_search}%` } },
              { os: { [Op.iLike]: `%${query_search}%` } },
              { sensitivity_level: { [Op.iLike]: `%${query_search}%` } },
            ]
            if (query_search == 0 || query_search == false || query_search == 'false') {
              searchWhere[Op.or].push({ remediate: false })
            } else if (query_search == 1 || query_search == true || query_search == 'true') {
              searchWhere[Op.or].push({ remediate: true })
            }
          }
          let order =
            sortKey &&
              sortKey != null &&
              sortKey !== 'null' &&
              sortKey !== 'undefined' &&
              typeof sortKey !== 'undefined'
              ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
              : [['updatedAt', 'desc']]
          const controls = await app.get('models').CustomCheckControl.findAndCountAll({
            order,
            where: {
              system_id: system_id,
              ...searchWhere,
            },
            ...app.get('models').paginate({
              pageNumber,
              itemsPerPage,
            }),
          })
          return utils.response(statusCodes.SUCCESS, controls, req, res)
        }
      } catch (err) {
        console.log("checkcontrol err: ", err)
        return utils.response(statusCodes.SERVER_ERROR, err, req, res)
      }
    })
  app.get(`${prefix}system/assessmentframework`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    let sortOrder
    try {
      const {
        system_id,
        framework_id,
        pageNumber,
        itemsPerPage,
        query_search,
        sortKey,
        descSort,
        framework,
      } = req.query

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }
      let ssp_model_name = framework == 'NIST80053R4' ? 'NIST80053R4SSP' : 'NIST800171R2SSP'
      let check_control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : 'NIST800171R2CheckControl'
      let control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4Control' : 'NIST800171R2Control'
        let audit_control_model_name = 'AuditControl';
        if(framework=="NIST80053R5"){
          ssp_model_name="NIST80053R5SSP"
          check_control_model_name="NIST80053R5CheckControl"
          control_model_name="NIST80053R5Control"
          audit_control_model_name="AuditR5Control"
        }
      let searchWhere = {}
      console.log("ssp_model_name: ", ssp_model_name, check_control_model_name, control_model_name);
      //means nest controls
      if (Number(framework_id) == 1) {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          if (framework == 'NIST80053R4') {
            searchWhere[Op.or] = [
              { '$NIST80053R4CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R4CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R4CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else if (framework == 'NIST80053R5') {
            searchWhere[Op.or] = [
              { '$NIST80053R5CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST80053R5CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST80053R5CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { baseline_impact: { [Op.contains]: [query_search.toUpperCase()] } },
              { priority: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          } else {
            searchWhere[Op.or] = [
              { '$NIST800171R2CheckControl.name$': { [Op.iLike]: `%${query_search}%` } },
              { '$NIST800171R2CheckControl.os$': { [Op.iLike]: `%${query_search}%` } },
              {
                '$NIST800171R2CheckControl.sensitivity_level$': { [Op.iLike]: `%${query_search}%` },
              },
              { number: { [Op.iLike]: `%${query_search}%` } },
              { title: { [Op.iLike]: `%${query_search}%` } },
              { NIST80053r4_controls: { [Op.contains]: [query_search.toUpperCase()] } },
            ]
          }
        }

        const where = {
          ...searchWhere,
        }
        if (framework == 'NIST80053R4' || framework=='NIST80053R5') {
          let Ssps = await app.get('models')[ssp_model_name].findOne({
            where: {
              system_id: system_id,
              active: true,
            },
          })
          let securityCat = ''
          if (Ssps) {
            securityCat = [Ssps.baseline_security_cat.toUpperCase()]
          } else {
            // return utils.response(statusCodes.BAD_REQUEST, "Please complete the system categorization in the system security plan (SSP).", req, res);
          }

          if (!where[Op.or]) {
            where[Op.or] = [
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ]
          } else {
            where[Op.or].push([
              {
                baseline_impact: {
                  [Op.contains]: securityCat,
                },
              },
              {
                baseline_impact: null,
              },
            ])
          }
          where['framework_id'] = framework_id
          where['withdrawn'] = null
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
            
        if (sortKey === 'number' && descSort !== undefined) {
          sortOrder = descSort === 'true' ? 'DESC' : 'ASC'
          order = [
            Sequelize.literal(
              `SUBSTRING(number FROM '[A-Z]+') ${sortOrder},COALESCE(SUBSTRING(number FROM '(?<=-)[0-9]+')::INTEGER, 0) ${sortOrder},SUBSTRING(number FROM '(?<=\\()[0-9]+')::BIGINT ${sortOrder} NULLS FIRST`,
            ),
          ]
        }

        const include = [
          {
            model: app.get('models')[check_control_model_name].scope(null),
            required: false,
            where: {
              system_id: system_id,
            },
            order: [[app.get('models')[audit_control_model_name], 'updatedAt', 'ASC']],
            include: [
              {
                model: app.get('models')[audit_control_model_name].scope(null),
                required: false,
                limit: 1,
                order: [['updatedAt', 'DESC']],
                where: {
                  is_draft: false,
                },
              },
            ],
          },
        ]
        console.log("where: ", where);
        if (framework == 'NIST80053R5') {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            // where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              // where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        } else {
          const count = await app.get('models')[control_model_name].scope(null).count({
            distinct: true,
            include,
            subQuery: false,
            where,
          })

          const rows = await app
            .get('models')
          [control_model_name].scope(null)
            .findAll({
              distinct: true,
              subQuery: false,
              where,
              include,
              order,
              ...app.get('models').paginate({
                pageNumber,
                itemsPerPage,
              }),
            })
          return utils.response(statusCodes.SUCCESS, { rows, count }, req, res)
        }
      } else {
        if (
          query_search &&
          typeof query_search !== 'undefined' &&
          query_search !== 'null' &&
          query_search !== 'undefined'
        ) {
          searchWhere[Op.or] = [
            { name: { [Op.iLike]: `%${query_search}%` } },
            { os: { [Op.iLike]: `%${query_search}%` } },
            { sensitivity_level: { [Op.iLike]: `%${query_search}%` } },
          ]
          if (query_search == 0 || query_search == false || query_search == 'false') {
            searchWhere[Op.or].push({ remediate: false })
          } else if (query_search == 1 || query_search == true || query_search == 'true') {
            searchWhere[Op.or].push({ remediate: true })
          }
        }
        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]
        const controls = await app.get('models').CustomCheckControl.findAndCountAll({
          order,
          where: {
            system_id: system_id,
            ...searchWhere,
          },
          ...app.get('models').paginate({
            pageNumber,
            itemsPerPage,
          }),
        })
        return utils.response(statusCodes.SUCCESS, controls, req, res)
      }
    } catch (err) {
      console.log("checkcontrol err: ",err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  
  app.get(`${prefix}control/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id } = req.params
      const { framework, control_number, framework_id } = req.query
      const control_model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4Control' : (framework == 'NIST80053R5' ?'NIST80053R5Control' :'NIST800171R2Control')
      const model_name =
        framework_id != -1
          ? framework == 'NIST80053R4'
            ? 'NIST80053R4CheckControl'
            : (framework == 'NIST80053R5'
            ? 'NIST80053R5CheckControl'
            :'NIST800171R2CheckControl')
          : 'CustomCheckControl'
      console.log("model_name: ", control_model_name,  model_name);
      if (framework_id != -1) {
        if (id != null && id != 'null') {
          var control = await app.get('models')[model_name].findOne({
            where: {
              id,
            },
            include: [
              {
                model: app.get('models')[control_model_name],
                required: false,
              },
            ],
          })

          control = JSON.parse(JSON.stringify(control))
          if(control.validation_controls){
          var validation_controls = control.validation_controls;
          }
          var validation_controls2 = control.validation_controls;
          // console.log("validation_controls: ", validation_controls);
          if (validation_controls != null) {
            const temp = validation_controls.reduce((acc, { stig_ref, stig_id }) => {
              acc[stig_ref] = acc[stig_ref] || { stig_ref, stig_id };
              return acc;
            }, {});

            // console.log("temp: ", temp);
            const results = Object.values(temp).map(({ stig_ref, stig_id }) => ({ stig_ref, stig_id: stig_id, validation_controls: [] }));
            results.forEach((v) => {
              validation_controls2.forEach((v1) => {
                if (v.stig_ref == v1.stig_ref) {
                  v.validation_controls.push(v1)
                }
              })
            })
            control['validation_controls1'] = results
          }else{
            control['validation_controls1'] =[]
          }
        } else {
          var control = await app.get('models')[model_name].build({
            control_type: {
              type: '',
            },
            implementation: {
              status: [],
            },
          })
          control = JSON.parse(JSON.stringify(control))
          control['Poams'] = []
          control['validation_controls1'] = []
          control['is_new'] = true
          control[control_model_name] = await app.get('models')[control_model_name].findOne({
            where: {
              number: control_number,
            },
          })
        }
      } else {
        if (id != null && id != 'null' && id != 'new') {
          var control = await app.get('models')[model_name].findOne({
            where: {
              id,
            },
          })
          control = JSON.parse(JSON.stringify(control))
          control['validation_controls1'] = []
        } else {
          let text = ''
          let chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

          for (let i = 0; i < 5; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length))
          }

          var control = await app.get('models')[model_name].build({
            name: 'custom-' + text,
            control_type: {
              type: '',
            },
            implementation: {
              status: [],
            },
          })
          control = JSON.parse(JSON.stringify(control))
          control['Poams'] = []
          control['validation_controls1'] = []
          control['is_new'] = true
        }
      }

      return utils.response(statusCodes.SUCCESS, control, req, res)
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.post(`${prefix}control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { controlData, type } = req.body
      const model_name =
        controlData.framework_id != -1
          ? controlData.framework == 'NIST80053R4'
            ? 'NIST80053R4CheckControl'
            : (controlData.framework == 'NIST80053R5'?'NIST80053R5CheckControl':'NIST800171R2CheckControl')
          : 'CustomCheckControl'
      let controlId = controlData.controlId

      controlData.idnt = type === 'custom' ? controlData.idnt : controlData.control_number

      //  controlData.name != null  controlData.name != '' controlData.name != false

      if (type != 'custom' || (controlData.name && controlData.idnt && controlData.os)) {
        // UPDATE METHOD
        if (controlId) {
          await app.get('models')[model_name].update(
            {
              name: controlData.name,
              os: controlData.os,
              sensitivity_level: controlData.sensitivity_level,
              validate: controlData.validate,
              remediate: controlData.remediate,
              control_number: controlData.idnt,
              plugin_family: controlData.plugin_family,
              plugin_id: controlData.plugin_id,
              plugin_name: controlData.plugin_name,
              plugin_description: controlData.plugin_description,
              implementation: controlData.implementation,
              framework_id: controlData.framework_id,
              control_identification: controlData.control_identification,
              control_type: controlData.control_type,
              validation_controls: controlData.validation_controls,
              inheritable: controlData.inheritable,
              inherited_from: controlData.inherited_from,
              compliance_status: controlData.compliance_status,
              system_id: controlData.system_id,
              user_id: controlData.user_id,
              control_process_step: 'Create',
            },
            {
              where: {
                id: controlId,
              },
            },
          )

          await app.get('models').Poam.destroy({
            where: {
              control_id: controlId,
            },
          })

          for (const i in controlData.Poams) {
            delete controlData.Poams[i].id
            controlData.Poams[i].control_id = controlId
            controlData.Poams[i].system_id = controlData.system_id
            controlData.Poams[i].completed_by = controlData.user_name
            await app.get('models').Poam.build(controlData.Poams[i]).save()
          }

          await app.get('models').ValidationControl.destroy({
            where: {
              control_id: controlId,
            },
          })
          for (const i in controlData.validation_controls) {
            await app
              .get('models')
              .ValidationControl.build({
                validate: controlData.validate,
                remediate: controlData.remediate,
                validation_controls: controlData.validation_controls[i],
                control_id: controlId,
                system_id: controlData.system_id,
                framework_identifier: req.params.framework,
              })
              .save()
          }
          return utils.response(statusCodes.SUCCESS, controlData, req, res)
        }
        // CREATE METHOD
        else {
          const control = await app.get('models')[model_name].create({
            name: controlData.name,
            os: controlData.os,
            sensitivity_level: controlData.sensitivity_level,
            validate: controlData.validate,
            remediate: controlData.remediate,
            control_number: controlData.idnt,
            plugin_family: controlData.plugin_family,
            plugin_id: controlData.plugin_id,
            plugin_name: controlData.plugin_name,
            plugin_description: controlData.plugin_description,
            implementation: controlData.implementation,
            framework_id: controlData.framework_id,
            control_identification: controlData.control_identification,
            control_type: controlData.control_type,
            validation_controls: controlData.validation_controls,
            inheritable: controlData.inheritable,
            inherited_from: controlData.inherited_from,
            compliance_status: controlData.compliance_status,
            system_id: controlData.system_id,
            user_id: controlData.user_id,
          })

          await app.get('models').Poam.destroy({
            where: {
              control_id: control.id,
            },
          })

          for (const i in controlData.poams) {
            delete controlData.poams[i].id
            controlData.poams[i].control_id = control.id
            controlData.poams[i].system_id = controlData.system_id
            controlData.poams[i].completed_by = controlData.user_name
            await app.get('models').Poam.build(controlData.poams[i]).save()
          }

          await app.get('models').ValidationControl.destroy({
            where: {
              control_id: control.id,
            },
          })

          for (const i in controlData.validation_controls) {
            await app
              .get('models')
              .ValidationControl.build({
                validate: controlData.validate,
                remediate: controlData.remediate,
                validation_controls: controlData.validation_controls[i],
                control_id: control.id,
                system_id: controlData.system_id,
                framework_identifier: req.params.framework,
              })
              .save()
          }

          return utils.response(statusCodes.SUCCESS, control, req, res)
        }
      } else {
        if (!controlData.name) {
          return utils.response(statusCodes.BAD_REQUEST, 'Control name cannot be blank', req, res)
        } else if (!controlData.idnt) {
          return utils.response(statusCodes.BAD_REQUEST, 'Control id cannot be blank', req, res)
        } else if (!controlData.os) {
          return utils.response(
            statusCodes.BAD_REQUEST,
            'Operating System cannot be blank',
            req,
            res,
          )
        }
      }
    } catch (err) {
      console.error(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(
    `${prefix}fetch-inheritable/system/control/framework`,
    [authenticationMiddleware.decodeJWT],
    async (req, res) => {
      try {
        const { system_id, framework_id, control } = req.query
        if (!system_id) {
          return utils.response(
            statusCodes.BAD_REQUEST,
            "System number couldn't be empty",
            req,
            res,
          )
        }
        var conditions = {
          inheritable: true,
          system_id: {
            [Op.not]: system_id,
          },
        }

        if (framework_id != -1) {
          conditions[Op.and] = {
            [Op.or]: [
              {
                control_number: control,
              },
              {
                framework_id: -1,
              },
            ],
          }
        }

        const inheritables = await app.get('models').NIST80053R4CheckControl.findAll({
          where: conditions,
          include: [
            {
              model: app.get('models').System,
              required: true,
              attributes: ['id', 'name', 'abbreviation'],
            },
            // {
            //     model: app.get("models").CheckControl,
            //     where: {
            //         system_id: req.params.systemId
            //     },
            //     required: false
            // }
          ],
          //raw: true
        })
        return utils.response(statusCodes.SUCCESS, inheritables, req, res)
      } catch (err) {
        let errMessage = err
        if (
          err.name === 'SequelizeUniqueConstraintError' ||
          err.name === 'SequelizeValidationError'
        ) {
          errMessage = ' '
          err.errors.forEach((error) => {
            errMessage += ' ' + error.message + ' \n'
          })
        }
        return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
      }
    },
  )
  app.get(
    `${prefix}inheritance/system/:id`,
    [authenticationMiddleware.decodeJWT],
    async (req, res) => {
      try {
        const { id: system_id } = req.params
        let { pageNumber, itemsPerPage, query_search, sortKey, descSort } = req.query

        if (!system_id) {
          return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
        }

        let order =
          sortKey &&
          sortKey != null &&
          sortKey !== 'null' &&
          sortKey !== 'undefined' &&
          typeof sortKey !== 'undefined'
            ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
            : [['updatedAt', 'desc']]

        let infoSystem = await app.get('models').System.findOne({
          where: {
            id: system_id,
          },
          order,
          include: [
            {
              model: app.get('models').NIST80053R4SSP,
              required: false,
              where: {
                active: true,
              },
            },
          ],
        })
        if (!infoSystem) {
          return utils.response(statusCodes.BAD_REQUEST, 'System not found', req, res)
        }
        if (!infoSystem.NIST80053R4SSPs && infoSystem.NIST80053R4SSPs.length <= 0) {
          return utils.response(
            statusCodes.BAD_REQUEST,
            'Please complete the system categorization in the system security plan (SSP).',
            req,
            res,
          )
        }
        let inheritance_conditions = {
          system_id: {
            [Op.not]: system_id,
          },
          inheritable: true,
        }

        var inheritors = await app
          .get('models')
          .NIST80053R4CheckControl.scope(null)
          .findAll({
            where: {
              system_id: system_id,
              inheritable: false,
            },
          })
        if (query_search) {
          inheritance_conditions = {
            ...inheritance_conditions,
            [Op.or]: [
              { control_number: { [Op.iLike]: `%${query_search}%` } },
              { name: { [Op.iLike]: `%${query_search}%` } },
              { validation_controls: { [Op.contains]: [{ vuln_num: `${query_search}` }] } },
              { control_type: { [Op.contains]: { type: `${query_search}` } } },
              { '$System.abbreviation$': { [Op.iLike]: `%${query_search}%` } },
            ],
          }
        }

        await app
          .get('models')
          .NIST80053R4CheckControl.scope(null)
          .findAndCountAll({
            where: inheritance_conditions,
            subQuery: false,
            include: [
              {
                model: app.get('models').System.scope(null),
                required: false,
                include: [
                  {
                    model: app.get('models').NIST80053R4SSP.scope(null),
                    required: false,
                    where: {
                      active: true,
                    },
                  },
                ],
              },
              {
                model: app.get('models').NIST80053R4Control.scope(null),
                required: false,
              },
            ],
            ...app.get('models').paginate({
              pageNumber,
              itemsPerPage,
            }),
          })
          .then(async (data) => {
            var controls = data.rows
            var data,
              custom_data = []

            for (let index = 0; index < controls.length; index++) {
              const control = controls[index]
              var control_inheritors = inheritors.concat()
              var checked = false
              if (control.system_id != system_id && control.inheritable == true) {
                var control_type = ''

                var system_control = await app
                  .get('models')
                  .NIST80053R4CheckControl.scope(null)
                  .findOne({
                    where: {
                      system_id: system_id,
                      control_number: control.control_number,
                    },
                    include: [
                      {
                        model: app.get('models').NIST80053R4Control,
                        required: false,
                      },
                    ],
                  })
                if (system_control) {
                  if (system_control.framework_id == -1) {
                    control_type = 'Custom'
                  } else if (system_control.NIST80053R4Control) {
                    control_type = system_control.control_type
                      ? system_control.control_type.type
                      : ''
                  } else {
                    control_type = 'N/A'
                  }
                } else {
                  control_type = 'N/A'
                }
                var validation_controls = []
                if (control.validation_controls) {
                  control.validation_controls.forEach((validation) => {
                    validation_controls.push(validation.vuln_num)
                  })
                }
                var have_inherited_from = inheritors.filter(function (inheritor) {
                  return control.id == inheritor.inherited_from
                })

                checked = have_inherited_from && have_inherited_from.length > 0 ? true : false

                if (!checked) {
                  have_inherited_from = await app.get('models').Inheritance.count({
                    where: {
                      control_id: control.id,
                      system_id: system_id,
                    },
                  })
                  checked = have_inherited_from ? true : false
                }

                var control_name =
                  control.framework_id == -1 ? control.name : control.control_number

                let selectedInheritor = control_inheritors.filter(
                  (inherited_control) => inherited_control.inherited_from === control.id,
                )
                selectedInheritor = selectedInheritor.length > 0 ? selectedInheritor[0] : null

                if (control.framework_id == -1) {
                  for (let index = 0; index < control_inheritors.length; index++) {
                    const inherited_control = control_inheritors[index]

                    var inherited_control_name =
                      inherited_control.framework_id == -1
                        ? inherited_control.name
                        : inherited_control.control_number
                    if (control_name == inherited_control_name) {
                      control_inheritors[index].disabled = true
                    }
                    if (selectedInheritor) {
                      var selectedInheritor_control_name =
                        selectedInheritor.framework_id == -1
                          ? selectedInheritor.name
                          : selectedInheritor.control_number

                      if (inherited_control_name == selectedInheritor_control_name) {
                        control_inheritors[index].disabled = true
                      }
                    }
                  }
                }

                custom_data.push({
                  checked: checked,
                  name: control_name,
                  framework_id: control.framework_id,
                  system: control.System ? control.System.abbreviation : '',
                  createdAt: control.createdAt,
                  validation_controls: validation_controls,
                  inheritors: control_inheritors,
                  control_type: control_type,
                  control_id: control.id,
                  CheckControl: control,
                  selectedInheritor: selectedInheritor,
                })
                control_inheritors = []
              }
            }
            const resp = {
              rows: custom_data,
              count: data.count,
            }
            return utils.response(statusCodes.SUCCESS, resp, req, res)
          })
      } catch (err) {
        return utils.response(statusCodes.SERVER_ERROR, err, req, res)
      }
    },
  )
  app.post(
    `${prefix}inheritance/system/:id`,
    [authenticationMiddleware.decodeJWT],
    async (req, res) => {
      try {
        const { id: system_id } = req.params
        const { inheritance } = req.body
        if (!system_id) {
          return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
        }

        await Promise.all([
          app.get('models').NIST80053R4CheckControl.update(
            { inherited_from: null },
            {
              where: {
                system_id: system_id,
              },
            },
          ),
          app.get('models').Inheritance.destroy({
            where: {
              system_id: system_id,
            },
          }),
        ]).catch((err) => {
          console.log(err)
        })

        var controlData = inheritance
        for (let i = 0; i < controlData.length; i++) {
          if (controlData[i].checked) {
            if (controlData[i].framework_id == 1) {
              await app
                .get('models')
                .Inheritance.create({
                  system_id: system_id,
                  control_id: controlData[i].control_id,
                })
                .catch((err) => {
                  console.log(err)
                })
            } else if (controlData[i].framework_id == -1) {
              if (controlData[i].selectedInheritor) {
                await app.get('models').NIST80053R4CheckControl.update(
                  {
                    inherited_from: controlData[i].control_id,
                  },
                  {
                    where: {
                      id: controlData[i].selectedInheritor.id,
                    },
                  },
                )
              } else {
                await app
                  .get('models')
                  .Inheritance.create({
                    system_id: system_id,
                    control_id: controlData[i].control_id,
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }
            }
          }
        }
      } catch (err) {
        let errMessage = err
        if (
          err.name === 'SequelizeUniqueConstraintError' ||
          err.name === 'SequelizeValidationError'
        ) {
          errMessage = ' '
          ex.errors.forEach((error) => {
            errMessage += ' ' + error.message + ' \n'
          })
        }
        return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
      }
      return utils.response(statusCodes.SUCCESS, 'Update Successfully', req, res)
    },
  )
  app.delete(`${prefix}control/:id`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { id: control_id } = req.params
      await app.get('models').CustomCheckControl.destroy({
        where: {
          id: control_id,
        },
      })

      await app.get('models').ValidationControl.destroy({
        where: {
          control_id: control_id,
        },
      })

      await app.get('models').Poam.destroy({
        where: {
          control_id: control_id,
        },
      })
      return utils.response(statusCodes.SUCCESS, 'Control deleted successfully', req, res)
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.put(
    `${prefix}type/system/control`,
    [authenticationMiddleware.decodeJWT],
    async (req, res) => {
      try {
        const { system_id, framework, control_number, ...controlData } = req.body
        if (!system_id) {
          return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
        }

        const model_name =
          framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : (framework == 'NIST80053R5' ? 'NIST80053R5CheckControl' :'NIST800171R2CheckControl')

        const controlItem = await app
          .get('models')
          [model_name].scope(null)
          .findOne({
            where: {
              system_id: system_id,
              control_number: control_number,
            },
          })

        if (controlItem.control_type) {
          const control_type = controlItem.control_type
          control_type.type = controlData.type.title
          controlItem.control_type = control_type
          controlItem.save()
        }
        return utils.response(statusCodes.SUCCESS, 'Control updated successfully', req, res)
      } catch (err) {
        console.log(err)
        let errMessage = err
        if (
          err.name === 'SequelizeUniqueConstraintError' ||
          err.name === 'SequelizeValidationError'
        ) {
          errMessage = ' '
          err.errors.forEach((error) => {
            errMessage += ' ' + error.message + ' \n'
          })
        }
        return utils.response(statusCodes.SERVER_ERROR, errMessage, req, res)
      }
    },
  )
  app.get(`${prefix}poams/system`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { system_id, pageNumber, itemsPerPage, query_search, sortKey, descSort, framework } =
        req.query
      const model_name =
        framework == 'NIST80053R4' ? 'NIST80053R4CheckControl' : (framework == 'NIST80053R5' ? 'NIST80053R5CheckControl' :'NIST800171R2CheckControl')

      if (!system_id) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }

      let poams_conditions = {
        system_id: system_id,
      }
      // let query_search_status = null
      if (
        query_search &&
        typeof query_search !== 'undefined' &&
        query_search !== 'null' &&
        query_search !== 'undefined'
      ) {
        // if (query_search.toUpperCase() == 'INACTIVE' || query_search == 0) {
        //   query_search_status = false
        // } else if (query_search.toUpperCase() == 'ACTIVE' || query_search == 1) {
        //   query_search_status = true
        // }

        poams_conditions[Op.or] = [
          { weak_name: { [Op.iLike]: `%${query_search}%` } },
          { idnt: { [Op.iLike]: `%${query_search}%` } },
        ]
      }

      let order =
        sortKey &&
        sortKey != null &&
        sortKey !== 'null' &&
        sortKey !== 'undefined' &&
        typeof sortKey !== 'undefined'
          ? [[sortKey, descSort === 'true' ? 'desc' : 'asc']]
          : [['updatedAt', 'desc']]
      const count = await app.get('models').Poam.scope(null).count({
        distinct: true,
        subQuery: false,
        where: poams_conditions,
      })
      const rows = await app
        .get('models')
        .Poam.scope(null)
        .findAll({
          order,
          where: poams_conditions,
          include: [
            {
              model: app.get('models')[model_name],
              required: true,
            },
          ],
          ...app.get('models').paginate({ pageNumber, itemsPerPage }),
        })

      return utils.response(statusCodes.SUCCESS, { count, rows }, req, res)
    } catch (err) {
      console.log(err)
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
  app.get(`${prefix}related-controls`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      const { controls } = req.query
      if (!controls) {
        return utils.response(statusCodes.BAD_REQUEST, "System couldn't be empty", req, res)
      }
      const rows = await app
        .get('models')
        .NIST80053R4Control.scope(null)
        .findAll({
          where: { $number$: { [Op.in]: controls } },
        })

      return utils.response(statusCodes.SUCCESS, rows, req, res)
    } catch (err) {
      return utils.response(statusCodes.SERVER_ERROR, err, req, res)
    }
  })
}
