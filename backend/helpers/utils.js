const { messagesResponse } = require('./constants.js');
const config = require("../config");
const { ENVIROMENT, KEYS } = require("../../common/config/env");
const CryptoJS = require("crypto-js");
const XLSX = require("xlsx");
const path = require('path');
const { log } = require('console');
const reA = /[^a-zA-Z]/g;
const reN = /[^0-9]/g;

exports.response = (statusCode, result, req, res) => {
  let data = {
    statusCode: statusCode,
    result,
    message: messagesResponse[statusCode],
  }
  console.log("ENVIROMENT.isdev is ", ENVIROMENT.isdev)
  if (!ENVIROMENT.isdev) {
    console.log("Its a prod env hence encryptind data")
    res.send(CryptoJS.AES.encrypt(JSON.stringify(data), KEYS.passphrase).toString()) }
  else { 
    log("This is dev so sending data as it is ")
    res.send(data) }
};

exports.response_report = (statusCode, result, req, res) => {
  let data = {
    statusCode: statusCode,
    result,
    message: messagesResponse[statusCode],
  }
  console.log("ENVIROMENT.isdev is ", ENVIROMENT.isdev)
  res.send(data) 
};

exports.isDevelopment = () => {
  return !ENVIROMENT.isdev;
}

exports.uuidv4 = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

exports.paginate = ({ pageNumber = 0, itemsPerPage = 10 }) => {
  // no pagination
  if (itemsPerPage === -1 || pageNumber === -1) {
    return {};
  }

  itemsPerPage = itemsPerPage || config.itemsPagination;
  pageNumber = pageNumber === 0 ? 0 : pageNumber - 1
  let offset = Number(pageNumber * itemsPerPage);
  let limit = itemsPerPage
  offset = isNaN(offset) ? 0 : Math.abs(offset);
  return { offset, limit };
};

exports.getOffsetPagination = (pageNumber, itemsPagination = -1) => {
  if (!pageNumber) {
    pageNumber = 1;
  }
  if (!itemsPagination || itemsPagination == -1) {
    itemsPagination = config.itemsPagination;
  }
  return itemsPagination * (+pageNumber - 1);
};

exports.getPagesCount = (itemsCount) => {
  if (itemsCount <= 0) {
    return 0;
  }
  return Math.ceil(itemsCount / config.itemsPagination);
}

exports.filteredAttributes = (model) => {
  switch (model) {
    case 'Users':
      return ['display_name', 'email']
    case 'Systems':
      return ['name', 'abbreviation']
    case 'Roles':
      return ['name', 'name'];
  }
}

exports.XlsxToJSON = (file) => {
  const workbook = XLSX.readFile(file)
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets['STIG Data']);
  const extension = path.extname(file);
  const stigName = path.basename(file, extension);

  return {
    stigName: stigName,
    vulnerabilities: jsonData
  }
}

exports.sortAlphaNum = (a, b) => {
  const keyA = a.name ? a.name : a.vuln_num
  const keyB = b.name ? b.name : b.vuln_num

  var aA = keyA.replace(reA, "");
  var bA = keyB.replace(reA, "");
  if (aA === bA) {
    var aN = parseInt(keyA.replace(reN, ""), 10);
    var bN = parseInt(keyB.replace(reN, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
}