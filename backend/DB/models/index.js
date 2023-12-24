const Sequelize = require('sequelize')
const pg = require('pg');
// import * as pg from 'pg';
var notifier = require('../../../common/Notifier')

module.exports = function(app) {
  var db = {}
  const { host, username, password, port, database } =
    app.get('cache').getItem('db-connection') || {}

  if (host && username && password && database) {
    const DB_URL =
      'postgres://' +
      encodeURIComponent(username) +
      ':' +
      // encodeURIComponent(password) +
      password+
      '@' +
      encodeURIComponent(host) +
      ':' +
      port +
      '/' +
      encodeURIComponent(database)
    const connection = new Sequelize(
      encodeURIComponent(database),
      encodeURIComponent(username),
      // encodeURIComponent(password),
      password,
      {
        host: encodeURIComponent(host),
        port: port,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        dialectOptions: {
          decimalNumbers: true,
          maxPreparedStatements: 100,
          multipleStatements: true,
          connectTimeout: 60000,
          statement_timeout: 1000000,
          idle_in_transaction_session_timeout: 50000,
          options: {
            connectTimeout: 100000,
            requestTimeout: 300000,
          },
        },
        pool: {
          min: 10,
          max: 50,
          acquire: 100000,
          idle: 10000,
        },
      }
    )

    const models = callModels(connection, Sequelize)
    db = {
      ...db,
      ...models,
    }

    for (var DBkey of Object.keys(db)) {
      // if (db[DBkey].validator) { // validator
      //   db[DBkey].validator(modelValidator);
      // }
      if (db[DBkey].associate) {
        // associates all relations for all models
        db[DBkey].associate(db)
      }
      if (db[DBkey].scopes) {
        // scopes
        db[DBkey].scopes(db)
      }
      if (db[DBkey].hooks) {
        // hooks
        db[DBkey].hooks(db)
      }
    }

    // Sequelize
    db['Sequelize'] = Sequelize

    // DB hellpers
    db['paginate'] = ({ pageNumber = 1, itemsPerPage = 10 }) => {
      if (itemsPerPage == -1 || pageNumber == -1) {
        return {}
      }
      pageNumber = pageNumber - 1 < 0 ? 0 : pageNumber - 1
      const offset = Number(pageNumber * itemsPerPage)
      const limit = Number(itemsPerPage)
      return {
        offset,
        limit,
      }
    }

    db['notificationListener'] = (host, port, database, user, password) => {
      // console.log("notificationListener: ", host, port, database, user, password);
      const pgClient = new pg.Client({
        host: host,
        port: port,
        database: database,
        user: user,
        password: password
      })
      pgClient.connect()

      pgClient.on('notification', function(data) {
        // console.log(data)
        try {
          notifier.emit('event', JSON.parse(data.payload))
        } catch (error) {}

        // callback(JSON.parse(data.payload));
        // global.mainWindow.webContents.send("notification", notification);
      })
      pgClient.query(`LISTEN notify_new_notification`)
    }
  }

  return db
}

const callModels = (connection, Sequelize) => {
  const db = {};
  db['ApprovalProcess'] = require("./ApprovalProcess")(connection, Sequelize);
  db['ApprovalProcessHistory'] = require("./ApprovalProcessHistory")(connection, Sequelize);
  db['ApprovalProcessRole'] = require("./ApprovalProcessRole")(connection, Sequelize);
  db['ApprovalProcessUser'] = require("./ApprovalProcessUser")(connection, Sequelize);
  db['Audit'] = require("./Audit")(connection, Sequelize);
  db['AuditControl'] = require("./AuditControl")(connection, Sequelize);
  db['AuditR5'] = require("./AuditR5")(connection, Sequelize);
  db['AuditR5Control'] = require("./AuditR5Control")(connection, Sequelize);
  db['CustomCheckControl'] = require("./CustomCheckControl")(connection, Sequelize);
  db['Deviation'] = require("./Deviation")(connection, Sequelize);
  db['DeviationCommand'] = require("./DeviationCommand")(connection, Sequelize);
  db['DeviationVulnerability'] = require("./DeviationVulnerability")(connection, Sequelize);
  db['Device'] = require("./Device")(connection, Sequelize);
  db['Devicecategory'] = require("./Devicecategory")(connection, Sequelize);
  db['Flush'] = require("./Flush")(connection, Sequelize);
  db['Framework'] = require("./Framework")(connection, Sequelize);
  db['Inheritance'] = require("./Inheritance")(connection, Sequelize);
  db['Interrogator'] = require("./Interrogator")(connection, Sequelize);
  db['Ip'] = require("./Ip")(connection, Sequelize);
  db['Logs'] = require("./Logs")(connection, Sequelize);
  db['NIST80053R4CheckControl'] = require("./NIST80053R4CheckControl")(connection, Sequelize);
  db['NIST80053R4Control'] = require("./NIST80053R4Control")(connection, Sequelize);
  db['NIST80053R4SSP'] = require("./NIST80053R4SSP")(connection, Sequelize);
  db['NIST80053R5CheckControl'] = require("./NIST80053R5CheckControl")(connection, Sequelize);
  db['NIST80053R5Control'] = require("./NIST80053R5Control")(connection, Sequelize);
  db['NIST80053R5SSP'] = require("./NIST80053R5SSP")(connection, Sequelize);
  db['NIST800171R2CheckControl'] = require("./NIST800171R2CheckControl")(connection, Sequelize);
  db['NIST800171R2Control'] = require("./NIST800171R2Control")(connection, Sequelize);
  db['NIST800171R2SSP'] = require("./NIST800171R2SSP")(connection, Sequelize);
  db['Notification'] = require("./Notification")(connection, Sequelize);
  db['OperatingSystem'] = require("./OperatingSystem")(connection, Sequelize);
  db['Organization'] = require("./Organization")(connection, Sequelize);
  db['permission'] = require("./Permission")(connection, Sequelize);
  db['Permission'] = require("./Permission")(connection, Sequelize);
  db['Poam'] = require("./Poam")(connection, Sequelize);
  db['Role'] = require("./Role")(connection, Sequelize);
  db['RolePermission'] = require("./RolePermission")(connection, Sequelize);
  db['Setting'] = require("./Setting")(connection, Sequelize);
  db['SettingRole'] = require("./SettingRole")(connection, Sequelize);
  db['Stig'] = require("./Stig")(connection, Sequelize);
  db['StigCommand'] = require("./StigCommand")(connection, Sequelize);
  db['StigVulnerability'] = require("./StigVulnerability")(connection, Sequelize);
  db['System'] = require("./System")(connection, Sequelize);
  db['SystemFramework'] = require("./SystemFramework")(connection, Sequelize);
  db['User'] = require("./User")(connection, Sequelize);
  db['UserRole'] = require("./UserRole")(connection, Sequelize);
  db['UserSystem'] = require("./UserSystem")(connection, Sequelize);
  db['Validation'] = require("./Validation")(connection, Sequelize);
  db['ValidationControl'] = require("./ValidationControl")(connection, Sequelize);
  db['Vulnerability'] = require("./Vulnerability")(connection, Sequelize);
  db['SystemCredentials'] = require("./SystemCredentials")(connection, Sequelize);
  db['License'] = require("./License")(connection, Sequelize);

  return db
}
