const { ENVIROMENT } = require('../../common/config/env')
const {utils, constants} = require("../helpers");
const authenticationMiddleware = require("../middlewares/authentication");

const csvParser = require('csv-parser');
const path = require("path");
const fs = require("fs");
const {statusCodes} = constants;
const prefix = `/api/v1/audit/`;

const {Op} = require('sequelize');

module.exports = (app) => {
  app.get(`${prefix}`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      let {parent, control_id, user_id, framework} = req.query;
      if (typeof (parent) === 'string') {
        parent = parent.split(',')
      }

      let where = {}
      if (control_id != -1) {
        where = {
          [Op.or]: [
            {
              check_control_id: control_id,
              is_draft: false
            },
            {
              check_control_id: control_id,
              is_draft: true,
              user_id: user_id
            }
          ]
        }
      }
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      let modelname='', controlModelName='';
      if (framework == 'NIST80053R4') {
        modelname = "Audit"
        controlModelName = "AuditControl"
      } else if (framework == 'NIST80053R5') {
        modelname = "AuditR5"
        controlModelName = "AuditR5Control"
      }
      console.log("modelname: ", modelname, controlModelName, parent);
      // console.log("audit query : ", modelname, controlModelName);
      const auditItem = await app.get("models")[modelname].findAll({
        where: {
          parent,
        },
        include: {
          model: app.get("models")[controlModelName],
          required: false,
          where

        },
        order: [
          ['updatedAt', 'DESC'],
          [app.get("models")[controlModelName], 'updatedAt', 'DESC'],
        ]
      });

      console.log(auditItem);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      if (!auditItem) return utils.response(statusCodes.SUCCESS, [], req, res);

      return utils.response(statusCodes.SUCCESS, auditItem, req, res);
    } catch (err) {
     
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });
  app.post(`${prefix}control`, [authenticationMiddleware.decodeJWT], async (req, res) => {
    try {
      //req.body.date = new Date();
      const { id, framework, ...restData } = req.body;
      // console.log("...restData: ", ...restData);
      let controlModelName=""
      if (framework == 'NIST80053R4') {
        controlModelName = "AuditControl"
      } else if (framework == 'NIST80053R5') {
        controlModelName = "AuditR5Control"
      }
      console.log("framework: ", framework);
      if (id) {
        await app.get("models")[controlModelName].update(restData, {
          where: {id}
        });
        return utils.response(statusCodes.SUCCESS, "Audit Control updated successfully", req, res);
      }
      await app.get("models")[controlModelName].create({...restData, date: new Date().toISOString()});
      return utils.response(statusCodes.SUCCESS, "Audit Control added successfully", req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`/api/v1/updateallaudit`, async (req, res) => {
    try {
      let { } = req.query;
      //const file_name = 'sp800-53ar5-assessment-procedures.csv'
      const file_name = 'NIST_SP-800-53_rev5_catalog.json';
      const dataPath = !ENVIROMENT.isdev
        ? path.join(global.AppPath, '../../common/extraResources')
        : path.join(process.resourcesPath, '/common/extraResources');
      const filepath = path.join(dataPath, file_name)
      const data = await readJSON(filepath);
      const Data = data.catalog.groups;
      const newdata = [];
      for (let i = 0; i < Data.length; i++) {
        var Controls = Data[i].controls;
        for (let j = 0; j < Controls.length; j++) {
          var Class = Controls[j].props[1].class;
          var childrens1 = [];
          if (Controls[j].params) {
            for (let k = 0; k < Controls[j].params.length; k++) {
              for (let l = 0; l < Controls[j].params[k].props.length; l++) {
                if (Controls[j].params[k].props[l].class == Class) {
                  if (Controls[j].params[k].guidelines && Controls[j].params[k].guidelines.length > 0) {
                    var decision = Controls[j].params[k].guidelines[0].prose;
                  } else if (Controls[j].params[k].select) {
                    var decision = "one or more of the following PARAMETER VALUES is/are selected: {" +
                      Controls[j].params[k].select.choice.join("; ") + "};";
                  } else {
                    var decision = "";
                  }
                  let json1 = {
                    "number": Controls[j].params[k].props[l].value,
                    "decision": decision,
                    "childrens": []
                  }
                  childrens1.push(json1)
                }
              }
            }
          }

          if (Controls[j].parts && Controls[j].parts.length > 2) {
            if (Controls[j].parts[2].parts) {
              for (let m = 0; m < Controls[j].parts[2].parts.length; m++) {
                var childrens2 = [];
                if (Controls[j].parts[2].parts[m].parts) {
                  for (let n = 0; n < Controls[j].parts[2].parts[m].parts.length; n++) {
                    var childrens3 = [];
                    if (Controls[j].parts[2].parts[m].parts[n].parts) {
                      for (let o = 0; o < Controls[j].parts[2].parts[m].parts[n].parts.length; o++) {
                        var childrens4 = [];
                        if (Controls[j].parts[2].parts[m].parts[n].parts[o].parts) {
                          for (let p = 0; p < Controls[j].parts[2].parts[m].parts[n].parts[o].parts.length; p++) {
                            var childrens5 = [];
                            if (Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].parts) {
                              for (let q = 0; q < Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].parts.length; q++) {
                                let json5 = {
                                  "number": Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].parts[q].props[0].value,
                                  "decision": Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].parts[q].prose,
                                  "childrens": []
                                }
                                childrens5.push(json5)
                              }
                            }
                            let json4 = {
                              "number": Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].props[0].value,
                              "decision": Controls[j].parts[2].parts[m].parts[n].parts[o].parts[p].prose,
                              "childrens": childrens5
                            }
                            childrens4.push(json4)
                          }
                        }
                        let json3 = {
                          "number": Controls[j].parts[2].parts[m].parts[n].parts[o].props[0].value,
                          "decision": Controls[j].parts[2].parts[m].parts[n].parts[o].prose,
                          "childrens": childrens4
                        }
                        childrens3.push(json3)
                      }
                    }
                    let json2 = {
                      "number": Controls[j].parts[2].parts[m].parts[n].props[0].value,
                      "decision": Controls[j].parts[2].parts[m].parts[n].prose,
                      "childrens": childrens3
                    }
                    childrens2.push(json2)
                  }
                }
                let json1 = {
                  "number": Controls[j].parts[2].parts[m].props[0].value,
                  "decision": Controls[j].parts[2].parts[m].prose,
                  "childrens": childrens2
                }
                childrens1.push(json1)
              }
            }
          }
          if (Controls[j].controls) {
            for (let s = 0; s < Controls[j].controls.length; s++) {
              var Childrens1 = [];
              if (Controls[j].controls[s].params) {
                for (let k = 0; k < Controls[j].controls[s].params.length; k++) {
                  for (let l = 0; l < Controls[j].controls[s].params[k].props.length; l++) {
                    if (Controls[j].controls[s].params[k].props[l].class == Class) {
                      if (Controls[j].controls[s].params[k].guidelines && Controls[j].controls[s].params[k].guidelines.length > 0) {
                        var decision = Controls[j].controls[s].params[k].guidelines[0].prose;
                      } else if (Controls[j].controls[s].params[k].select) {
                        var decision = "one or more of the following PARAMETER VALUES is/are selected: {" +
                          Controls[j].controls[s].params[k].select.choice.join("; ") + "};";
                      } else {
                        var decision = "";
                      }
                      let json1 = {
                        "number": Controls[j].controls[s].params[k].props[l].value,
                        "decision": decision,
                        "childrens": []
                      }
                      Childrens1.push(json1)
                    }
                  }
                }
                /*let Json = {
                  "number": Controls[j].controls[s].props[1].value,
                  "decision": "Determine if:",
                  "childrens": Childrens1
                }
                childrens1.push(Json)*/
              }
              if (Controls[j].controls[s].parts) {
                if (Controls[j].controls[s].parts && Controls[j].controls[s].parts.length > 2) {
                    if (Controls[j].controls[s].parts[2].parts) {
                    for (let m = 0; m < Controls[j].controls[s].parts[2].parts.length; m++) {
                      var childrens2 = [];
                      if (Controls[j].controls[s].parts[2].parts[m].parts) {
                        for (let n = 0; n < Controls[j].controls[s].parts[2].parts[m].parts.length; n++) {
                          var childrens3 = [];
                          if (Controls[j].controls[s].parts[2].parts[m].parts[n].parts) {
                            for (let o = 0; o < Controls[j].controls[s].parts[2].parts[m].parts[n].parts.length; o++) {
                              var childrens4 = [];
                              if (Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts) {
                                for (let p = 0; p < Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts.length; p++) {
                                  var childrens5 = [];
                                  if (Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].parts) {
                                    for (let q = 0; q < Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].parts.length; q++) {
                                      let json5 = {
                                        "number": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].parts[q].props[0].value,
                                        "decision": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].parts[q].prose,
                                        "childrens": []
                                      }
                                      childrens5.push(json5)
                                    }
                                  }
                                  let json4 = {
                                    "number": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].props[0].value,
                                    "decision": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].parts[p].prose,
                                    "childrens": childrens5
                                  }
                                  childrens4.push(json4)
                                }
                              }
                              let json3 = {
                                "number": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].props[0].value,
                                "decision": Controls[j].controls[s].parts[2].parts[m].parts[n].parts[o].prose,
                                "childrens": childrens4
                              }
                              childrens3.push(json3)
                            }
                          }
                          let json2 = {
                            "number": Controls[j].controls[s].parts[2].parts[m].parts[n].props[0].value,
                            "decision": Controls[j].controls[s].parts[2].parts[m].parts[n].prose,
                            "childrens": childrens3
                          }
                          childrens2.push(json2)
                        }
                      }
                      let json1 = {
                        "number": Controls[j].controls[s].parts[2].parts[m].props[0].value,
                        "decision": Controls[j].controls[s].parts[2].parts[m].prose,
                        "childrens": childrens2
                      }
                      Childrens1.push(json1)
                    }

                    /*let Json = {
                      "number": Controls[j].controls[s].parts[2].value,
                      "decision": "Determine if:",
                      "childrens": Childrens1
                    }
                    childrens1.push(Json)*/
                  }
                }
              }
              let Json = {
                "number": Controls[j].controls[s].props[1].value,
                "decision": "Determine if:",
                "childrens": Childrens1
              }
              childrens1.push(Json)
            }
          }
          var potentialAssessments = [];
          if (Controls[j].parts && Controls[j].parts.length > 3) {
            potentialAssessments = [
              {
                "data": ((Controls[j].parts[3].parts[0].prose).replaceAll('\n\n', ',')).split(','),
                "name": Controls[j].parts[3].props[0].value
              },
              {
                "data": ((Controls[j].parts[4].parts[0].prose).replaceAll('\n\n', ',')).split(','),
                "name": Controls[j].parts[4].props[0].value
              },
              {
                "data": Controls[j].parts ? [] : ((Controls[j].parts[5].parts[0].prose).replaceAll('\n\n', ',')).split(','),
                "name": Controls[j].parts ? "" : Controls[j].parts[5].props[0].value
              }
            ]
          }
          let json = {
            "parent": Controls[j].props[0].value,
            "data": {
              "title": Controls[j].title,
              "number": Controls[j].props[1].value,
              "decision": "Determine if:",
              "childrens": childrens1,
              "potentialAssessments": potentialAssessments
            },
            "framework": "NIST80053R5"
          }
          newdata.push(json)
        }
      }



      /*const filepath = path.join(dataPath, file_name)
      const rows = await readCSVFile(filepath);
      const newdata = [];
      var childrens = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].family == "") {
          let json1 = {
            "number": rows[i].identifier,
            "decision": rows[i].assessment_objective,
            "childrens": []
          }
          if (rows[i].identifier != "") {
            childrens.push(json1)
          }
 
        } else {
          //  childrens = []
          let data = {
            "title": rows[i].control_name,
            "number": rows[i].identifier,
            "decision": rows[i].assessment_objective,
            "childrens": childrens,
            "potentialAssessments": [
              {
                "data": rows[i].EXAMINE,
                "name": "EXAMINE"
              },
              {
                "data": rows[i].INTERVIEW,
                "name": "INTERVIEW"
              },
              {
                "data": rows[i].TEST,
                "name": "TEST"
              }
            ]
 
          }
          let json = {
            parent: rows[i].identifier,
            data: data,
            framework: "NIST80053R5"
          }
          if (childrens.length > 0) {
            newdata.push(json)
          }
          childrens = []
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].identifier == "") {
          for (let j = 0; j < newdata.length; j++) {
            for (let k = 0; k < newdata[j].data.childrens.length; k++) {
              if (rows[i].child == newdata[j].data.childrens[k].number) {
                var childs = [];
                childs = newdata[j].data.childrens[k].childrens;
                childs.push({
                  "number": rows[i].subchild,
                  "decision": rows[i].assessment_objective,
                  "childrens": []
                })
                newdata[j].data.childrens[k].childrens = childs;
              }
            }
          }
        }
      }
      newdata.forEach((data) => {
         app.get("models").Audit.create(data);
      });*/

      newdata.forEach((data) => {
         app.get("models").AuditR5.create(data);
      });
      return utils.response(statusCodes.SUCCESS, newdata, req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

  app.get(`/api/v1/getauditjson`, async (req, res) => {
    try {
      let { } = req.query;
      //const file_name = 'sp800-53ar5-assessment-procedures.csv'
      const file_name = 'NIST_SP-800-53_rev5_catalog.json';
      const dataPath = !ENVIROMENT.isdev
        ? path.join(global.AppPath, '../../common/extraResources')
        : path.join(process.resourcesPath, '/common/extraResources');
      const filepath = path.join(dataPath, file_name)
      const data = await readJSON(filepath);
      const newdata = data.catalog.groups;

      /*const filepath = path.join(dataPath, file_name)
      const rows = await readCSVFile(filepath);
      const newdata = [];
      var childrens = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].family == "") {
          let json1 = {
            "number": rows[i].identifier,
            "decision": rows[i].assessment_objective,
            "childrens": []
          }
          if (rows[i].identifier != "") {
            childrens.push(json1)
          }

        } else {
          //  childrens = []
          let data = {
            "title": rows[i].control_name,
            "number": rows[i].identifier,
            "decision": rows[i].assessment_objective,
            "childrens": childrens,
            "potentialAssessments": [
              {
                "data": rows[i].EXAMINE,
                "name": "EXAMINE"
              },
              {
                "data": rows[i].INTERVIEW,
                "name": "INTERVIEW"
              },
              {
                "data": rows[i].TEST,
                "name": "TEST"
              }
            ]

          }
          let json = {
            parent: rows[i].identifier,
            data: data,
            framework: "NIST80053R5"
          }
          if (childrens.length > 0) {
            newdata.push(json)
          }
          childrens = []
        }
      }
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].identifier == "") {
          for (let j = 0; j < newdata.length; j++) {
            for (let k = 0; k < newdata[j].data.childrens.length; k++) {
              if (rows[i].child == newdata[j].data.childrens[k].number) {
                var childs = [];
                childs = newdata[j].data.childrens[k].childrens;
                childs.push({
                  "number": rows[i].subchild,
                  "decision": rows[i].assessment_objective,
                  "childrens": []
                })
                newdata[j].data.childrens[k].childrens = childs;
              }
            }
          }
        }
      }
      newdata.forEach((data) => {
         app.get("models").Audit.create(data);
      });*/
      return utils.response(statusCodes.SUCCESS, newdata, req, res);
    } catch (err) {
      console.log(err);
      return utils.response(statusCodes.SERVER_ERROR, err, req, res);
    }
  });

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
  async function readJSON(path) {
    return new Promise((resolve) => {
      fs.readFile(path, function (err, data) {
        // Check for errors 
        if (err) throw err;
        resolve(JSON.parse(data));
        // Converting to JSON 
      });
    })

  }
}
