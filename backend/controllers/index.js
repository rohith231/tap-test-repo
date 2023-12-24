// var fs = require('fs');

// all controls
module.exports = function (app) {

  callControllers(app);
// fs.readdirSync('./backend/controllers')
//   .filter(function (file) {
//     //read just files .js
//     return (file.indexOf('.') !== 0) && file !== 'index.js' && (file.slice(-3) === '.js');
//   })
//   .forEach(async function (file) {
//     console.log(`./${file}`)
//     var controller = require(`./${file}`)
//     controller(app)
//   })
};


const callControllers = (app) => {
  require("./approvalProcess.controller")(app);
  require("./audit.controller")(app);
  require("./auth.controller")(app);
  require("./checkControls.controller")(app);
  require("./compliance.controller")(app);
  require("./dashboard.controller")(app);
  require("./database.controller")(app);
  require("./deviation.controller")(app);
  require("./device.controller")(app);
  require("./devicecategory.controller")(app);
  require("./framework.controller")(app);
  require("./interrogator.controller")(app);
  require("./ip.controller")(app);
  require("./NIST.controller")(app);
  require("./notification.controller")(app);
  require("./operatingSystem.controller")(app);
  require("./organization.controller")(app);
  require("./role.controller")(app);
  require("./setting.controller")(app);
  require("./ssp.controller")(app);
  require("./stig.controller")(app);
  require("./system.controller")(app);
  require("./users.controller")(app);
  require("./license.controller")(app);
}
