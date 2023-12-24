if (typeof window !== 'undefined' && !('process' in window)) {
  // @ts-ignore
  window.process = {}
}

const path = require("path");
const nunjucks = require("nunjucks");
console.log("__dirname ", __dirname)
const templatePath = global.IsDevMode
  ? path.join(__dirname, '..', 'backend', 'templates')
  : path.join(__dirname, '..', 'backend', 'templates')
console.log("template path ", templatePath)
nunjucks.configure(path.resolve(templatePath), { autoescape: false });

const packageJson = require('../../package.json')
// helper functions

const moment = require('moment');

const { log } = require("console");
let reportDate = null;

function formatReportDate(date) {
  return moment(date).format('MMMM DD, YYYY')
}

function getCustomSecurityDate(date) {
  return moment(date).format('MMMM DD, YYYY');
}

function setReportDate(date) {
  reportDate = moment(date).format('YYYY MMMM DD');
}
function getReportDate() {
  return reportDate;
}


function getConcat(param1, param2) {
  return param1 + " " + param2;
}

function getValue(value) {
  return value || "---";
}
function getDeviceStatus(connectable_info, touched_at) {
  if (connectable_info) {
    return "CONNECTED";
  }
  if (touched_at == null) {
    return "WAITING";
  }
  return "FAILED CONNECTION";
}
function checkIfInclude(arr, item) {
  if (arr.includes(item)) {
    return "&#10004;";
  }
  return "&times;";
}
function checkIfExistValue(value) {
  if (value) {
    return "&#10004;";
  }
  return "&times;";
}
function getFileIcon(fileType) {
  if (fileType == "image") {
    return "{#asset ./images/img.jpeg @encoding=dataURI}";
  }
  if (fileType == "excel") {
    return "{#asset ./images/excel.jpg @encoding=dataURI}";
  }
  if (fileType == "file") {
    return "{#asset ./images/pdf.png @encoding=dataURI}";
  }
  return "{#asset ./images/pdf.png @encoding=dataURI}";
}

function checkLength(array) {
  if (array && array.length > 0) {
    return true
  }
  return false
}

function DateFormatted(date) {
  return moment(date).tz('America/Phoenix').format('YYYY-MM-DD HH:mm:ss')
}
function renderDeviceIcon(device){
  var iconid=device.ip_addr;
  var div=`<i id="${iconid}" onclick="myFunction(this)" style="color: #145DA0; font-size: 20px;" class="fa fa-plus-circle"></i>`
  return div 
}
function renderDeviceOuterdiv(device){
  var divId=device.ip_addr+"contentWrap";
  var div =`<div id="${divId}" class="displayclass" style="overflow: auto;">`
  return div
}
function renderCollapsibleIcon(device){
  var divId=device.ip_addr;
  var div =`<i id="${divId}" onclick="colapser(this)" class="h4 mb-0 ico-plus"></i>`
  return div
}
function renderPassFailOtherProgress(passCount,failCount,otherCount,totalCount){
  var passPercentage = (passCount / totalCount) * 100
  var passstyle = "width:" + passPercentage + "%";
  var failPercentage = (failCount / totalCount) * 100
  var failstyle = "width:" + failPercentage + "%";
  var otherPercentage = (otherCount / totalCount) * 100
  var otherstyle = "width:" + otherPercentage + "%";

  var progressDiv = `<div class="progress">
  <div class="progress-bar progress-bar-success" style="${passstyle}">${passCount} pass
  </div>
  <div class="progress-bar bg-danger" style="${failstyle}">${failCount} fail
  </div>
  <div class="progress-bar bg-warning" style="${otherstyle}">${otherCount} other
  </div>
</div>`
  // console.log("progressDiv: ", progressDiv);
  return progressDiv
}
function renderProgress(passPercentage, failPercentage, otherPercentage) {
  var passstyle = "width:" + passPercentage + "%";
  passPercentage=Math.round(passPercentage*100)/100
  failPercentage = failPercentage + otherPercentage;
  var failstyle = "width:" + failPercentage + "%";
  failPercentage = Math.round(failPercentage * 100) / 100
  var progressDiv = `<div class="progress" style="margin-top: .5em;">
  <div class="progress-bar progress-bar-success" style="${passstyle}">${passPercentage}% Compliant</div>
  <div class="progress-bar bg-danger" style="${failstyle}">${failPercentage}% Fail</div>
</div>`
  // console.log("progressDiv: ", progressDiv);
  return progressDiv
}
function renderControl(device, control){
  var passstyle = "width:" + control.passPercentage + "%";
  var passPercentage=Math.round(control.passPercentage*100)/100
  var failPercentage=control.failPercentage
  failPercentage=failPercentage+control.otherPercentage
  var failstyle = "width:" + failPercentage + "%";
  failPercentage=Math.round(failPercentage*100)/100
  var name = control.name.replace(" ", "_") + device.ip_addr.replace(".", "_");
  name = name.replace("-", "_");
  var id=name
  var className = "collaps-head"
  var controlDiv=`<tr data-th-id="${id}" class="${className}">
  <td class="t-colaps-head" style="padding-left: 20px">
  <a class="colaps-btn" onclick="colapsTr(this)"  id="${id}"></a> <strong>${control.name}</strong>
    </td>
      <td colspan="3">
      <div class="progress">
        <div class="progress-bar progress-bar-success" style="${passstyle}">${passPercentage}% Pass</div>
        <div class="progress-bar bg-danger" style="${failstyle}">${failPercentage}% Fail</div>
    </div>
  </td>
  <td>${DateFormatted(control.updated)}</td>
</tr>`
forEach = Array.prototype.forEach;
forEach.call(control.vulnerabilities, function (vul) {
  var vulname=vul.vuln_num.replace(" ", "_")+ device.ip_addr.replace(".", "_");
  vulname = vulname.replace("-", "_");
  var vulid=vulname
  var vulclassName="colaps-body"
  var severity="";
  if(vul.vulnerability.severity){
    if ((vul.vulnerability.severity).toLowerCase() == "high") {
      severity = "CAT I (" + vul.vulnerability.severity + ")";
    }else if ((vul.vulnerability.severity).toLowerCase() == "medium") {
      severity = "CAT II (" + vul.vulnerability.severity + ")";
    }else if ((vul.vulnerability.severity).toLowerCase() == "low") {
      severity = "CAT III (" + vul.vulnerability.severity + ")";
    }
  }
  var btn1id=vulid+'btn1';
  var btn1CntId=btn1id+'contentWrap';
  var btn2id=vulid+'btn2';
  var btn2CntId=btn2id+'contentWrap';
  var btn3id=vulid+'btn3';
  var btn3CntId=btn3id+'contentWrap';
  controlDiv=controlDiv+`<tr data-th-id="${vulid}" class="${vulclassName}" id="${vulid}" data-thb-id="${id}">
  <td>
      <a>${vul.vuln_num}</a>
  </td>
  <td>${vul.vulnerability.rule_title}
  <div>
  <h4><i id="${btn1id}" onclick="colapser(this)" class="ico-plus"></i>Description</h4>
  <div style="display:none;" class="displayclass" id="${btn1CntId}">
  ${vul.vulnerability.vuln_discuss}
  </div>
  </div>
  <div>
  <h4><i id="${btn2id}" onclick="colapser(this)" class="ico-plus"></i>Check Text</h4>
  <div style="display:none;" class="displayclass" id="${btn2CntId}">${vul.vulnerability.check_content}</div>
  </div>
  <div>
  <h4><i id="${btn3id}" onclick="colapser(this)" class="ico-plus"></i>Fix Text</h4>
  <div style="display:none;" class="displayclass" id="${btn3CntId}">${vul.vulnerability.fix_text}</div>
  </div>
  </td>
  <td class="text-capitalize" style="text-align: center">${severity}</td>
  <td  style="text-align: center">
      <div class=" ${vul.status=="COMPLIANT"?"btn-green":"btn-red"}">
      ${vul.status=="COMPLIANT"?"Pass":"Fail"}
      </div>
  </td>
  <td></td>
</tr>`
})
  // console.log("controlDiv: ", controlDiv);
  return controlDiv
}
function renderComplianceControl(control){
  var passstyle = "width:" + control.passPercentage + "%";
  var passPercentage=Math.round(control.passPercentage*100)/100
  var failPercentage=control.failPercentage
  failPercentage=failPercentage+control.otherPercentage
  var failstyle = "width:" + failPercentage + "%";
  failPercentage=Math.round(failPercentage*100)/100
  var name=control.name.replace(" ", "_")
  name = name.replace("-", "_");
  var id=name
  var className = "collaps-head"
  var controlDiv=`<tr data-th-id="${id}" class="${className}">
  <td class="t-colaps-head" style="padding-left: 20px">
  <a class="colaps-btn" onclick="colapsTr(this)" id="${id}"></a> <strong>${control.name}</strong>
    </td>
      <td colspan="4">
      <div class="progress">
        <div class="progress-bar progress-bar-success" style="${passstyle}">${passPercentage}% Pass</div>
        <div class="progress-bar bg-danger" style="${failstyle}">${failPercentage}% Fail</div>
    </div>
  </td>
  <td>${DateFormatted(control.updated)}</td>
</tr>`
forEach = Array.prototype.forEach;
forEach.call(control.devices, function (device) {
forEach.call(device.vulnerabilities, function (vul) {
  var vulname=vul.vuln_num.replace(" ", "_")
  vulname = vulname.replace("-", "_");
  var vulid = vulname
  var vulclassName="colaps-body"
  var severity="";
  if(vul.vulnerability.severity){
    if ((vul.vulnerability.severity).toLowerCase() == "high") {
      severity = "CAT I (" + vul.vulnerability.severity + ")";
    }else if ((vul.vulnerability.severity).toLowerCase() == "medium") {
      severity = "CAT II (" + vul.vulnerability.severity + ")";
    }else if ((vul.vulnerability.severity).toLowerCase() == "low") {
      severity = "CAT III (" + vul.vulnerability.severity + ")";
    }
  }
  var btn1id=vulid+'btn1';
  var btn1CntId=btn1id+'contentWrap';
  var btn2id=vulid+'btn2';
  var btn2CntId=btn2id+'contentWrap';
  var btn3id=vulid+'btn3';
  var btn3CntId=btn3id+'contentWrap';
  controlDiv=controlDiv+`<tr data-th-id="${vulid}" class="${vulclassName}" id="${vulid}" data-thb-id="${id}">
  <td>
      ${vul.vuln_num}
  </td>
  <td>
      ${device.ip_addr}
  </td>
  <td>${vul.vulnerability.rule_title}
  <div>
  <h4><i id="${btn1id}" onclick="colapser(this)" class="ico-plus"></i>Description</h4>
  <div style="display:none;" class="displayclass" id="${btn1CntId}">
  ${vul.vulnerability.vuln_discuss}
  </div>
  </div>
  <div>
  <h4><i id="${btn2id}" onclick="colapser(this)" class="ico-plus"></i>Check Text</h4>
  <div style="display:none;" class="displayclass" id="${btn2CntId}">${vul.vulnerability.check_content}</div>
  </div>
  <div>
  <h4><i id="${btn3id}" onclick="colapser(this)" class="ico-plus"></i>Fix Text</h4>
  <div style="display:none;" class="displayclass" id="${btn3CntId}">${vul.vulnerability.fix_text}</div>
  </div>
  </td>
  <td class="text-capitalize" style="text-align: center">${severity}</td>
  <td style="text-align: center">
      <div class="${vul.status=="COMPLIANT"?"btn-green":"btn-red"}">
      ${vul.status=="COMPLIANT"?"Pass":"Fail"}
      </div>
  </td>
  <td></td>
</tr>`
})
})
  // console.log("controlDiv: ", controlDiv);
  return controlDiv
}
function renderVersion(){
  var versionDiv=`<div>Generated using <strong>HTAP</strong> ${packageJson.version}</div>`
  return versionDiv
}
function version(){
  return packageJson.version
}
var AuditTable = '';
var auditNumbers = [];
function renderAudit(current, first_time = false) {
  if (!current) return

  var children = current.childrens,
    forEach = Array.prototype.forEach;
  if (!children) return
  if (first_time) {
    AuditTable = ''
  }
  AuditTable = AuditTable ? AuditTable + `<ol>` : `<ol class="rectangle-list" style=" page-break-inside: avoid;">`;
  forEach.call(children, function (c) {
    if (auditNumbers.includes(c.number)) return
    auditNumbers.push(c.number)
    var decision = c.decision ? c.decision : c.number
    var policeStatusSelected = c.policeStatusSelected ? c.policeStatusSelected : 'NOT-APPLICABLE'
    var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
    var class_name = ''
    if (policeStatusSelected == 'COMPLIANT') {
      class_name = "btn-green";
    } else if (policeStatusSelected == 'NON-COMPLIANT') {
      class_name = "btn-red";
    } else {
      class_name = "btn-gray";
    }
    AuditTable += `<li style=" page-break-inside: avoid;">
    <a style="${style}" text="${c.number}">`;
    if (decision) {
      AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
        <span>${decision}</span>`;
    }
    if (typeof c.description != 'undefined') {
      AuditTable += `<br><span><b> Description : </b><span>${c.description}</span></span>`;
    }
    if (c.filePaths) {
      c.filePaths.forEach(path => {
        AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
      });
    }
    AuditTable += `</a></li>`;
    renderAudit(c);
  });
  AuditTable += `</ol>`;
  // console.log(AuditTable)
  return AuditTable;
}
function renderAuditFor(c){

}
function renderAuditNew(current, first_time = false) {
  if (!current) return

  var children = current.childrens,
    forEach = Array.prototype.forEach;
  if (!children) return
  // if (first_time) {
    AuditTable = ''
  AuditTable += `<ul>`
  AuditTable+=`<li style=" page-break-inside: avoid;">
  <input type="checkbox" checked>
  <i class="arrow" style="left:10; margin-top:5px"></i>
  <span style="margin-left:20px">
  <b>${current.number} </b> ${current.title}</span>`;

  AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
  if (current.decision) {
    AuditTable += `<br><span>${current.decision} </span><br>`;
  }

// }
AuditTable += `<ul style="margin-top: 8px">`
  forEach.call(children, function (c) {
    if (auditNumbers.includes(c.number)) return
    auditNumbers.push(c.number)
    AuditTable += `<li style=" page-break-inside: avoid;">
    <input type="checkbox" checked>
              <i class="arrow" style="left:10; margin-top:5px"></i>
    <span style="margin-left:20px">${c.number}</span>`;
    if(c.childrens.length>0){
      AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
      if (c.decision) {
        AuditTable += `<br><span>${c.decision} </span><br>`;
      }
      AuditTable += `<ul style="margin-top: 8px">`
      forEach.call(c.childrens, function (c1) {
        if (auditNumbers.includes(c1.number)) return
        auditNumbers.push(c1.number)
        AuditTable += `<li style=" page-break-inside: avoid;">
        <input type="checkbox" checked>
                  <i class="arrow" style="left:10; margin-top:5px"></i>
        <span style="margin-left:20px">${c1.number}</span>`;

        if(c1.childrens.length>0){
          AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
          if (c1.decision) {
            AuditTable += `<br><span>${c1.decision} </span><br>`;
          }
          AuditTable += `<ul style="margin-top: 8px">`
          forEach.call(c1.childrens, function (c2) {
            if (auditNumbers.includes(c2.number)) return
            auditNumbers.push(c2.number)
            AuditTable += `<li style=" page-break-inside: avoid;">
            <input type="checkbox" checked>
                      <i class="arrow" style="left:10; margin-top:5px"></i>
            <span style="margin-left:20px">${c2.number}</span>`;

            if(c2.childrens.length>0){
              AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
              if (c2.decision) {
                AuditTable += `<br><span>${c2.decision} </span><br>`;
              }
              AuditTable += `<ul style="margin-top: 8px">`
              forEach.call(c2.childrens, function (c3) {
                if (auditNumbers.includes(c3.number)) return
                auditNumbers.push(c3.number)
                AuditTable += `<li style=" page-break-inside: avoid;">
                <input type="checkbox" checked>
                          <i class="arrow" style="left:10; margin-top:5px"></i>
                <span style="margin-left:20px">${c3.number}</span>`;

                if(c3.childrens.length>0){
                  AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
                  if (c3.decision) {
                    AuditTable += `<br><span>${c3.decision} </span><br>`;
                  }
                  AuditTable += `<ul style="margin-top: 8px">`
                  forEach.call(c3.childrens, function (c4) {
                    if (auditNumbers.includes(c4.number)) return
                    auditNumbers.push(c4.number)
                    AuditTable += `<li style=" page-break-inside: avoid;">
                    <input type="checkbox" checked>
                              <i class="arrow" style="left:10; margin-top:5px"></i>
                    <span style="margin-left:20px">${c4.number}</span>`;

                    if(c4.childrens.length>0){
                      AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
                      if (c4.decision) {
                        AuditTable += `<br><span>${c4.decision} </span><br>`;
                      }
                      AuditTable += `<ul style="margin-top: 8px">`
                      forEach.call(c4.childrens, function (c5) {
                        if (auditNumbers.includes(c5.number)) return
                        auditNumbers.push(c5.number)
                        AuditTable += `<li style=" page-break-inside: avoid;">
                        <input type="checkbox" checked>
                                  <i class="arrow" style="left:10; margin-top:5px"></i>
                        <span style="margin-left:20px">${c5.number}</span>`;
                        AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
                        var decision = c5.decision ? c5.decision : ""
                        var policeStatusSelected = c5.policeStatusSelected ? c5.policeStatusSelected : 'NOT-APPLICABLE'
                        var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
                        var class_name = ''
                        if (policeStatusSelected == 'COMPLIANT') {
                          class_name = "btn-green";
                        } else if (policeStatusSelected == 'NON-COMPLIANT') {
                          class_name = "btn-red";
                        } else {
                          class_name = "btn-gray";
                        }
                        if (decision) {
                          AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
              <span>${decision}</span>`;
                        }
                        if (typeof c5.description != 'undefined') {
                          AuditTable += `<br><span><b> Description : </b><span>${c5.description}</span></span>`;
                        }
                        if (c5.filePaths) {
                          c5.filePaths.forEach(path => {
                            AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
                          });
                        }
                        AuditTable += `</div>`
                        AuditTable += `</li>`
                      })
                      AuditTable += `</ul>`
                      AuditTable += `</div>`
                    }else{
                      AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
                      var decision = c4.decision ? c4.decision : ""
                      var policeStatusSelected = c4.policeStatusSelected ? c4.policeStatusSelected : 'NOT-APPLICABLE'
                      var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
                      var class_name = ''
                      if (policeStatusSelected == 'COMPLIANT') {
                        class_name = "btn-green";
                      } else if (policeStatusSelected == 'NON-COMPLIANT') {
                        class_name = "btn-red";
                      } else {
                        class_name = "btn-gray";
                      }
                      if (decision) {
                        AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
                              <span>${decision}</span>`;
                      }
                      if (typeof c4.description != 'undefined') {
                        AuditTable += `<br><span><b> Description : </b><span>${c4.description}</span></span>`;
                      }
                      if (c4.filePaths) {
                        c4.filePaths.forEach(path => {
                          AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
                        });
                      }
                      AuditTable += `</div>`
                    }

                    AuditTable += `</li>`
                  })
                  AuditTable += `</ul>`
                  AuditTable += `</div>`
                }else{
                  AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
                  var decision = c3.decision ? c3.decision : ""
                  var policeStatusSelected = c3.policeStatusSelected ? c3.policeStatusSelected : 'NOT-APPLICABLE'
                  var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
                  var class_name = ''
                  if (policeStatusSelected == 'COMPLIANT') {
                    class_name = "btn-green";
                  } else if (policeStatusSelected == 'NON-COMPLIANT') {
                    class_name = "btn-red";
                  } else {
                    class_name = "btn-gray";
                  }
                  if (decision) {
                    AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
                          <span>${decision}</span>`;
                  }
                  if (typeof c3.description != 'undefined') {
                    AuditTable += `<br><span><b> Description : </b><span>${c3.description}</span></span>`;
                  }
                  if (c3.filePaths) {
                    c3.filePaths.forEach(path => {
                      AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
                    });
                  }
                  AuditTable += `</div>`
                }

                AuditTable += `</li>`
              })
              AuditTable += `</ul>`
              AuditTable += `</div>`
            }else{
              AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
              var decision = c2.decision ? c2.decision : ""
              var policeStatusSelected = c2.policeStatusSelected ? c2.policeStatusSelected : 'NOT-APPLICABLE'
              var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
              var class_name = ''
              if (policeStatusSelected == 'COMPLIANT') {
                class_name = "btn-green";
              } else if (policeStatusSelected == 'NON-COMPLIANT') {
                class_name = "btn-red";
              } else {
                class_name = "btn-gray";
              }
              if (decision) {
                AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
                      <span>${decision}</span>`;
              }
              if (typeof c2.description != 'undefined') {
                AuditTable += `<br><span><b> Description : </b><span>${c2.description}</span></span>`;
              }
              if (c2.filePaths) {
                c2.filePaths.forEach(path => {
                  AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
                });
              }
              AuditTable += `</div>`
            }

            AuditTable += `</li>`
          })
          AuditTable += `</ul>`
          AuditTable += `</div>`
        }else{
          AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
          var decision = c1.decision ? c1.decision : ""
          var policeStatusSelected = c1.policeStatusSelected ? c1.policeStatusSelected : 'NOT-APPLICABLE'
          var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
          var class_name = ''
          if (policeStatusSelected == 'COMPLIANT') {
            class_name = "btn-green";
          } else if (policeStatusSelected == 'NON-COMPLIANT') {
            class_name = "btn-red";
          } else {
            class_name = "btn-gray";
          }
          if (decision) {
            AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
                  <span>${decision}</span>`;
          }
          if (typeof c1.description != 'undefined') {
            AuditTable += `<br><span><b> Description : </b><span>${c1.description}</span></span>`;
          }
          if (c1.filePaths) {
            c1.filePaths.forEach(path => {
              AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
            });
          }
          AuditTable += `</div>`
        }

        AuditTable += `</li>`
      })
      AuditTable += `</ul>`
      AuditTable += `</div>`
    }else{
      AuditTable += `<div style="margin-left:20px;margin-top:5px;margin-bottom:5px;">`
      var decision = c.decision ? c.decision : ""
      var policeStatusSelected = c.policeStatusSelected ? c.policeStatusSelected : 'NOT-APPLICABLE'
      var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
      var class_name = ''
      if (policeStatusSelected == 'COMPLIANT') {
        class_name = "btn-green";
      } else if (policeStatusSelected == 'NON-COMPLIANT') {
        class_name = "btn-red";
      } else {
        class_name = "btn-gray";
      }
      if (decision) {
        AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
              <span>${decision}</span>`;
      }
      if (typeof c.description != 'undefined') {
        AuditTable += `<br><span><b> Description : </b><span>${c.description}</span></span>`;
      }
      if (c.filePaths) {
        c.filePaths.forEach(path => {
          AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
        });
      }
      AuditTable += `</div>`
    }
    
    AuditTable += `</li>`
  })
  AuditTable += `</ul>`

  if (current.potentialAssessments){
    forEach.call(current.potentialAssessments, function (assessment) {
    AuditTable += `<br><span><b>${assessment.name}: </b></span>`;
      if (assessment.others_explanation) {
        AuditTable += `<span>${assessment.others_explanation} </span><br>`;
      } else {
        AuditTable += `<span>${assessment.title} </span><br>`;
      }
    })
  }
  AuditTable += `</div>`
  AuditTable += `</li>`
  AuditTable += `</ul>`
  // AuditTable += `<ol class="rectangle-list" style=" page-break-inside: avoid;">`;
  // forEach.call(children, function (c) {
  //   if (auditNumbers.includes(c.number)) return
  //   auditNumbers.push(c.number)
  //   var decision = c.decision ? c.decision : c.number
  //   var policeStatusSelected = c.policeStatusSelected ? c.policeStatusSelected : 'NOT-APPLICABLE'
  //   var style = decision ? "" : "background: #fff;margin: 2px  25px 22px 25px !important;height: 3px;"
  //   var class_name = ''
  //   if (policeStatusSelected == 'COMPLIANT') {
  //     class_name = "btn-green";
  //   } else if (policeStatusSelected == 'NON-COMPLIANT') {
  //     class_name = "btn-red";
  //   } else {
  //     class_name = "btn-gray";
  //   }
  //   AuditTable += `<li style=" page-break-inside: avoid;">
  //   <a style="${style}" text="${c.number}">`;
  //   if (decision) {
  //     AuditTable += `<span class="${class_name}" style="float:right;margin: 2px 0">${policeStatusSelected}</span>
  //       <span>${decision}</span>`;
  //   }
  //   if (typeof c.description != 'undefined') {
  //     AuditTable += `<br><span><b> Description : </b><span>${c.description}</span></span>`;
  //   }
  //   if (c.filePaths) {
  //     c.filePaths.forEach(path => {
  //       AuditTable += `<br><span class="pl-2 pt-1">${path}</span>`;
  //     });
  //   }
  //   AuditTable += `</a></li>`;
  //   renderAuditNew(c);
  // });
  // AuditTable += `</ol>`;
  // console.log("AuditTable: ", AuditTable);
  return AuditTable;
}

function renderCollapsibleAuditIcon(control){
  var divId=control;
  var div =`<i id="${divId}" onclick="colapaudit(this)" class="h4 mb-0 ico-plus"></i>`
  return div
}
function renderAuditOuterdiv(control){
  var divId=control+"contentWrap1Audit";
  var div =`<div id="${divId}" class="displayclass" style=" page-break-inside: avoid;">`
  return div
}

function getAuditClass(compliant_status) {
  if (compliant_status == 'COMPLIANT') {
    return "btn-green";
  } else if (compliant_status == 'NON-COMPLIANT') {
    return "btn-red";
  } else {
    return "btn-gray";
  }
}
function getAuditStatus(compliant_status){
  if (compliant_status == 'COMPLIANT') {
    return "COMPLIANT";
  }else if (compliant_status == 'NON-COMPLIANT') {
    return "NON-COMPLIANT";
  } else {
    return "Not applicable";
  }
}

function getComplianceStatusClass(status) {
  if (status == 'COMPLIANT') {
    return "btn-green";
  } else if (status == 'NON-COMPLIANT') {
    return "btn-red";
  } else {
    return "btn-gray";
  }
}

function show_section(chapters, key, options) {
  if (JSON.stringify(chapters).indexOf(key) > -1)
    return options.fn(this)
  else
    return options.inverse(this);
}

function getCurrentYear() {
  return new Date().getFullYear()
}




exports.getParsedTemplate = ({ template_name, values }) => {
  console.log("Inside getParsedTemplate")
  values.moment = moment
  values.reportDate = reportDate
  values.formatReportDate = formatReportDate
  values.getCustomSecurityDate = getCustomSecurityDate
  values.setReportDate = setReportDate
  values.getReportDate = getReportDate
  values.getConcat = getConcat
  values.getValue = getValue
  values.getDeviceStatus = getDeviceStatus
  values.checkIfInclude = checkIfInclude
  values.checkIfExistValue = checkIfExistValue
  values.getFileIcon = getFileIcon
  values.checkLength = checkLength
  values.DateFormatted = DateFormatted
  values.AuditTable = AuditTable
  values.auditNumbers = auditNumbers
  values.renderAudit = renderAudit
  values.getAuditClass = getAuditClass
  values.getComplianceStatusClass = getComplianceStatusClass
  values.show_section = show_section
  values.getCurrentYear = getCurrentYear

  values.renderPassFailOtherProgress = renderPassFailOtherProgress
  values.renderProgress = renderProgress
  values.renderControl=renderControl
  values.renderComplianceControl=renderComplianceControl
  values.renderVersion=renderVersion
  values.version = version
  values.renderDeviceIcon = renderDeviceIcon
  values.renderDeviceOuterdiv = renderDeviceOuterdiv
  values.renderCollapsibleIcon = renderCollapsibleIcon
  values.renderAuditNew= renderAuditNew
  values.getAuditStatus = getAuditStatus
  values.renderCollapsibleAuditIcon = renderCollapsibleAuditIcon

  values.renderAuditOuterdiv=renderAuditOuterdiv
  try {
    return_val = nunjucks.render(template_name, values);
  } catch (error) {
    console.log(error)
    return_val = ""
  }  
  return return_val
}