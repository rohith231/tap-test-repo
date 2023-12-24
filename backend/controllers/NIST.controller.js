const { ENVIROMENT } = require('../../common/config/env')
const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");
const {statusCodes} = constants;
const prefix = `/api/v1/nist/`;

const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");
const xml2js = require("xml2js");
const {Op} = require('sequelize');


module.exports = (app) => {
  app.get(`${prefix}fetchNISTXML`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    
    try {
      const {itemPerPage, framework} = req.query;
      let control_file_name = framework == 'NIST80053R4' ? 'NIST-800-53-controls.xml' : 'NIST-800-171-controls.xlsx'
      if(framework=='NIST80053R5'){
        control_file_name = 'NIST_800-53_v5_controls.xml'
      }
      console.log("fetchNISTXML: ", req.query, global.AppPath,);
      const dataPath = !ENVIROMENT.isdev
        ? path.join(global.AppPath, '../../common/extraResources')
        : path.join(process.resourcesPath, '/common/extraResources');

      const filepath = path.join(dataPath, control_file_name)

      if (framework == 'NIST80053R4' || 'NIST80053R5') {
        var nist = fs.readFileSync(filepath, 'utf8', function read(err, data) {
          console.log("data")

          if (err) {
            throw err;
          } else {
            console.log(data)
          }
        });
        var parser = new xml2js.Parser();
        await parser.parseString(nist, async function (err, result) {
          var jsonNist = JSON.stringify(result)
          var self = {}
          // console.log(JSON.parse(jsonNist)['controls:controls']['controls:control'])
          self.filecontrols = JSON.parse(jsonNist)['controls:controls']['controls:control']
          self.rawXML = JSON.parse(jsonNist)


          var i;
          var ii;

          let xmlcontrols = self.rawXML['controls:controls']['controls:control']
          var controlsFromXML = []
          var control = {}


          for (i in xmlcontrols) {
            let baseline = null
            let withdrawn = null
            let guidance = null
            let priority = null
            let enhancements = null
            if (Array.isArray(xmlcontrols[i]['baseline-impact']) && xmlcontrols[i]['baseline-impact'].length !== 0) {
              baseline = xmlcontrols[i]['baseline-impact']
            }
            if (Array.isArray(xmlcontrols[i]['supplemental-guidance']) && xmlcontrols[i]['supplemental-guidance'].length !== 0) {
              guidance = xmlcontrols[i]['supplemental-guidance'][0]
            }
            if (Array.isArray(xmlcontrols[i]['withdrawn']) && xmlcontrols[i]['withdrawn'].length !== 0) {
              withdrawn = xmlcontrols[i]['withdrawn'][0]
            }

            if (Array.isArray(xmlcontrols[i]['control-enhancements']) && xmlcontrols[i]['control-enhancements'].length !== 0) {
              enhancements = xmlcontrols[i]['control-enhancements'][0]['control-enhancement']
            }

            // typeof xmlcontrols[i]['priority'] !== 'undefined'
            if (typeof xmlcontrols[i]['priority'] !== 'undefined') {
              priority = xmlcontrols[i]['priority']
            }

            control = {
              'number': xmlcontrols[i].number[0],
              'title': xmlcontrols[i].title[0],
              'family': xmlcontrols[i].family[0],
              'baseline_impact': baseline,
              'withdrawn': withdrawn,
              'statement': xmlcontrols[i].statement[0],
              'supplemental-guidance': guidance,
              'control-enhancements': enhancements,
              'priority': priority,
              'parent': null,
              'framework': framework,
              'updated_at': new Date(),
            }
            controlsFromXML.push(control)
            control = {}

            if (Array.isArray(xmlcontrols[i]['control-enhancements']) && xmlcontrols[i]['control-enhancements'].length !== 0) {
              let ibaseline = null
              let iwithdrawn = null
              let iguidance = null
              let ipriority = null

              for (ii in xmlcontrols[i]['control-enhancements'][0]['control-enhancement']) {

                if (Array.isArray(xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['baseline-impact']) && xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['baseline-impact'].length !== 0) {
                  ibaseline = xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['baseline-impact']
                }


                if (Array.isArray(xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['supplemental-guidance']) && xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['supplemental-guidance'].length !== 0) {
                  iguidance = xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii]['supplemental-guidance'][0]
                }


                if (Array.isArray(xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].withdrawn) && xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].withdrawn.length !== 0) {
                  iwithdrawn = xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].withdrawn[0]
                }


                if (Array.isArray(xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].priority) && xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].priority.length !== 0) {
                  ipriority = xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].priority
                }

                control = {
                  'number': xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].number[0],
                  'title': xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].title[0],
                  'family': xmlcontrols[i].family[0],
                  'baseline_impact': ibaseline,
                  'withdrawn': iwithdrawn,
                  'statement': xmlcontrols[i]['control-enhancements'][0]['control-enhancement'][ii].statement[0],
                  'supplemental-guidance': iguidance,
                  'priority': ipriority,
                  'parent': xmlcontrols[i].number[0],
                  'framework': 1,
                  'updated_at': new Date(),
                }
                controlsFromXML.push(control)
                control = {}
              }
            }
          }

          self.controls = controlsFromXML
          if(framework == 'NIST80053R4'){
          await save_NIST80053R4_controls(controlsFromXML, 1);
          }else{
            await save_NIST80053R5_controls(controlsFromXML, 1);
          }
          const respData = await getNISTControls(1, itemPerPage, null, "createdAt", false, framework);
          return utils.response(statusCodes.SUCCESS, respData, req, res);
        });

      } else {

        let workbook = XLSX.readFile(filepath);
        let sheet_name_list = workbook.SheetNames;
        let file_rows = [];
        let data = [];
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
              headers[col] = value.trim();
              continue;
            }


            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;

            console.log(headers[col]);
            console.log(value);
          }

          //drop those first two rows which are empty
          data.shift();
          data.shift();
        });

        await save_NIST800171R2_controls(data);
        const respData = await getNISTControls(1, itemPerPage, null, "createdAt", false, framework);
        return utils.response(statusCodes.SUCCESS, respData, req, res);
      }
    } catch (error) {
      console.log("fetchNISTXML error: ", error);
      return utils.response(statusCodes.SERVER_ERROR, error, req, res);
    }
  });
  app.get(`${prefix}controllers`, [authenticationMiddleware.decodeJWT], async (req, res) => {

    try {
      console.log("req.query")
      console.log(req.query)
      console.log("req.query")
      let {pageNumber, itemsPerPage, query_search, sortKey, descSort, framework} = req.query;


      const result = await getNISTControls(pageNumber, itemsPerPage, query_search, sortKey, descSort, framework);
      return utils.response(statusCodes.SUCCESS, result, req, res);

    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  async function getNISTControls(pageNumber = 1, itemsPerPage = 10, query_search = null, sortKey = null, descSort = false, framework = 'NIST80053R4') {

    console.log("framework: ", framework);
    var modelName = framework == 'NIST80053R4' ? 'NIST80053R4Control' : 'NIST800171R2Control'
    if (framework == 'NIST80053R5') {
      modelName = 'NIST80053R5Control'
    }
    try {
      var NIST_conditions = {}
      if (query_search) {

        if (framework == 'NIST80053R4' || framework == 'NIST80053R5') {
          NIST_conditions = {
            [Op.or]: [
              {number: {[Op.iLike]: `%${query_search}%`}},
              {family: {[Op.iLike]: `%${query_search}%`}},
              {title: {[Op.iLike]: `%${query_search}%`}},
              {baseline_impact: {[Op.contains]: [query_search.toUpperCase()]}},
              {priority: {[Op.contains]: [query_search.toUpperCase()]}},

            ]
          }

        } else {
          NIST_conditions = {
            [Op.or]: [
              {number: {[Op.iLike]: `%${query_search}%`}},
              {family: {[Op.iLike]: `%${query_search}%`}},
              {title: {[Op.iLike]: `%${query_search}%`}},
              {NIST80053r4_controls: {[Op.contains]: [query_search.toUpperCase()]}},
              {discussion: {[Op.iLike]: `%${query_search}%`}},

            ]
          }
        }
      }
      let order = sortKey && sortKey !=null && sortKey !== 'null' && sortKey !== 'undefined'   && typeof sortKey !== 'undefined'? [[sortKey, descSort ? "desc" : "asc"]] : [["updatedAt", "desc"]];

      const data = await app.get("models")[modelName].findAndCountAll({
        distinct: true,
        where: NIST_conditions,
        ...app.get("models").paginate({
          pageNumber,
          itemsPerPage
        }),
        order
      });

      return data;
    } catch (err) {
      // console.log(`f on add a new log with data with err = ${JSON.stringify(err)}`);
      return {
        rows: 0,
        count: 0
      };
    }
  }
  async function save_NIST80053R4_controls(frameControls, frameworkId) {
    try {
      await app.get("models").NIST80053R4Control.destroy({
        where: {},
        truncate: true
      });
      const dataToInsert = frameControls.map((ele) => {
        return {
          number: ele.number,
          title: ele.title,
          framework_id: frameworkId,
          family: ele.family,
          baseline_impact: ele['baseline_impact'],
          withdrawn: ele.withdrawn,
          statement: ele.statement,
          control_enhancements: ele['control-enhancements'],
          guidance: ele['supplemental-guidance'],
          priority: ele.priority,
          parent: ele.parent,
          updated_at: ele['updated_at'],
        }
      });
      await app.get("models").NIST80053R4Control.bulkCreate(dataToInsert);
    } catch (err) {
      console.log('ERROR!! : ' + err)
    }
  }
  async function save_NIST80053R5_controls(frameControls, frameworkId) {
    try {
      await app.get("models").NIST80053R5Control.destroy({
        where: {},
        truncate: true
      });
      const dataToInsert = frameControls.map((ele) => {
        return {
          number: ele.number,
          title: ele.title,
          framework_id: frameworkId,
          family: ele.family,
          baseline_impact: ele['baseline_impact'],
          withdrawn: ele.withdrawn,
          statement: ele.statement,
          control_enhancements: ele['control-enhancements'],
          guidance: ele['supplemental-guidance'],
          priority: ele.priority,
          parent: ele.parent,
          updated_at: ele['updated_at'],
        }
      });
      await app.get("models").NIST80053R5Control.bulkCreate(dataToInsert);
    } catch (err) {
      console.log('ERROR!! : ' + err)
    }
  }
  async function save_NIST800171R2_controls(controls) {
    try {
      await app.get("models").NIST800171R2Control.destroy({
        where: {},
        truncate: true
      });
      const dataToInsert = controls.map((ele) => {
        console.log({
          number: ele['NIST 800-171 r2'],
          title: ele['Title'],
          family: ele['family'],
          family_abbreviation: ele['family abbreviation'],
          family_id: ele['family id'],
          discussion: ele['DISCUSSION'],
          NIST80053r4_controls: ele['NIST 800-53 r4'].split(","),

        });
        return {
          number: ele['NIST 800-171 r2'],
          title: ele['Title'],
          family: ele['family'],
          family_abbreviation: ele['family abbreviation'],
          family_id: ele['family id'],
          discussion: ele['DISCUSSION'],
          DoD_value: ele['DoD Value'],
          DoD_guidance: ele['DoD Guidance'],
          NIST80053r4_controls: ele['NIST 800-53 r4'].split(","),

        }
      });
      await app.get("models").NIST800171R2Control.bulkCreate(dataToInsert);
    } catch (err) {
      console.log('ERROR!! : ' + err)
    }
  }
}
