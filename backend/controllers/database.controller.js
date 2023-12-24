const Sequelize = require('sequelize')
const pg = require('pg');
const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')
const { utils, constants } = require('../helpers')
const { statusCodes } = constants
const { ImportPgDatabase, CreateNewPgDatabase } = require('../helpers/database')

const H3OPath = path.resolve(path.join(process.platform === 'win32' ? 'c:/Progra~1/H3OLabs' : path.join(process.env.HOME, 'H3OLabs')))

const checkConfigDirectory = () => {
  return new Promise((resolve, reject) => {
    const configFolderPath = path.join(H3OPath, 'config')
    try {
      if (fs.existsSync(configFolderPath)) {
        console.log('Directory exists.')
        resolve(true)
      } else {
        fs.mkdirSync(configFolderPath, { recursive: true })
        resolve(true)
      }
    } catch (e) {
      console.log('Could not create Config Folder')
      reject(e)
    }
  })
}

const createInterrogatorConfig = (pg_host, pg_port, pg_db, pg_user, pg_password) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkConfigDirectory()

      const configPath = path.join(H3OPath, 'config', 'interrogator.cfg')
      console.log('introgator path : ', configPath)
      const data = `[db]
pg_host = ${pg_host}
pg_port = ${pg_port}
pg_db = ${pg_db}
pg_user = ${pg_user}
pg_password = ${pg_password}

[api]
key = cee9806c-ebe0-4b38-8d6a-eeeda7277783

[security]
key = fcda0ssdegfffc94415812w3edaxswer
iv = 8f25c84e73298d8a
`

      fs.writeFile(configPath, data, (err) => {
        if (err) {
          console.log('An error occurred while writing the file : interrogator.cfg : ', err)
          reject(err)
        } else {
          console.log('File created and data written successfully.')
          resolve(true)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

const executeNSSAServices = () => {
  return new Promise(async (resolve, reject) => {

      exec(path.join(H3OPath, 'nssm') + ' restart TAPFingerPrinter', (err, stdout, stderr) => {
        if(err) {
          console.log('Error : Cound not start TAPFingerPrinter');
          console.log('Error: ', err);
        } else {
          console.log('stdout : ', stdout);
          console.log('stderr : ', stderr);
          console.log('TAPFingerPrinter: running fine');
        }
      });


      exec(path.join(H3OPath, 'nssm') + ' restart TAPInterrogator', (err, stdout, stderr) => {
        if(err) {
          console.log('Error : Cound not start TAPInterrogator');
          console.log('Error: ', err);
        } else {
          console.log('stdout : ', stdout);
          console.log('stderr : ', stderr);
          console.log('TAPInterrogator: running fine');
        }
      });
      resolve(true);
  })
}

// This sets the mock adapter on the default instance
module.exports = function (app) {
  app.post('/api/v1/db/database-connection', [], async function (req, res) {
    const { operation } = req.body

    try {
      console.time()
      const { host, username, password, port, database } =
        operation == 'check' && app.get('cache').hasItem('db-connection')
          ? app.get('cache').getItem('db-connection')
          : req.body
      if (!host || !username) {
        console.timeEnd()
        return utils.response(statusCodes.EXPECTATION_FAILED, 'Please select database', req, res)
      }

      const connection = new Sequelize(
        encodeURIComponent(database),
        encodeURIComponent(username),
        // encodeURIComponent(password),
        password,
        {
          host: encodeURIComponent(host),
          port: port,
          dialect: 'postgres',
          dialectModule: pg
        }

        // 'postgres://' +
        //   encodeURIComponent(username) +
        //   ':' +
        //   encodeURIComponent(password) +
        //   '@' +
        //   encodeURIComponent(host) +
        //   ':' +
        //   port +
        //   '/' +
        //   encodeURIComponent(database),
      )

      connection
        .authenticate()
        .then(async function () {
          if (operation != 'test') {
            // if(operation == 'set') app.get("cache").reset()
            try {
              await createInterrogatorConfig(host, port, database, username, password)
              executeNSSAServices()
            } catch (error) {
              console.log('SOMETHING WENT WRONG IN createInterrogatorConfig & executeNSSAServices : ', error);
            }
            console.info('Introgator setup successfully')
            app.get('cache').setItem('db-connection', {
              host,
              username,
              password,
              port,
              database,
            })

            require('fs').watchFile(require('path').resolve('../DB/models'), () => {
              console.log(`require.cache[require.resolve('../DB/models')]`)
              // console.log(require.cache[require.resolve('../DB/models')])
              delete require.cache[require.resolve('../DB/models')]
            })
            const models = require('../DB/models')
            app.set('models', models(app))

            const EventEmitter = require('events')

            class MyEmitter extends EventEmitter {}

            const myEmitter = new MyEmitter()

            app.set('myEmitter', myEmitter)
            app.get('models').notificationListener(host, port, database, username, password)

            if (operation == 'set') {
              setTimeout(() => {
                const { app } = require('electron')
                app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
                app.exit(0)
              }, 500)
            }

            console.log('Connection has been established successfully.')
            console.timeEnd()
            return utils.response(
              statusCodes.SUCCESS,
              {
                host,
                username,
                password,
                port,
                database,
              },
              req,
              res,
            )
          } else {
            console.log('Connection has been established successfully.')
            console.timeEnd()
            return utils.response(
              statusCodes.SUCCESS,
              {
                host,
                username,
                password,
                port,
                database,
              },
              req,
              res,
            )
          }
        })
        .catch((error) => {
          console.timeEnd()
          console.error('Unable to connect to the database:', error)
          return utils.response(
            statusCodes.EXPECTATION_FAILED,
            'Unable to connect to the database',
            req,
            res,
          )
        })
    } catch (error) {
      console.timeEnd()
      console.error('Unable to connect to the database:', error)
      return utils.response(
        statusCodes.EXPECTATION_FAILED,
        'Unable to connect to the database',
        req,
        res,
      )
    }
  })

  app.post('/api/v1/db/database-create', [], async function (req, res) {
    const { operation } = req.body

    try {
      console.time()
      const { host, username, password, port, database } =
        operation == 'check' && app.get('cache').hasItem('db-connection')
          ? app.get('cache').getItem('db-connection')
          : req.body
      if (!host || !username) {
        return utils.response(statusCodes.EXPECTATION_FAILED, 'Please select database', req, res)
      }

      const dbStatus = await CreateNewPgDatabase({
        dbHost: host,
        dbUser: username,
        dbPassword: password,
        dbPort: port,
        dbName: database,
      })

      if (!dbStatus) console.log('Database already exists')

      const connection = new Sequelize(
        encodeURIComponent(database),
        encodeURIComponent(username),
        // encodeURIComponent(password),
        password,
        {
          host: encodeURIComponent(host),
          port: port,
          dialect: 'postgres',
          dialectModule: pg
        }
        // 'postgres://' +
        //   encodeURIComponent(username) +
        //   ':' +
        //   encodeURIComponent(password) +
        //   '@' +
        //   encodeURIComponent(host) +
        //   ':' +
        //   port +
        //   '/' +
        //   encodeURIComponent(database),
      )

      await connection.authenticate().then(async function () {
        if (operation != 'test') {
          // if(operation == 'set') app.get("cache").reset()

          // setTimeout(async () => {

          // Import database locally
          await ImportPgDatabase({
            dbHost: host,
            dbUser: username,
            dbPassword: password,
            dbPort: port,
            dbName: database,
          })

          // Cache database details
          app.get('cache').setItem('db-connection', {
            host,
            username,
            password,
            port,
            database,
          })

          require('fs').watchFile(require('path').resolve('../DB/models'), () => {
            console.log(`require.cache[require.resolve('../DB/models')]`)
            // console.log(require.cache[require.resolve('../DB/models')])
            delete require.cache[require.resolve('../DB/models')]
          })
          const models = require('../DB/models')
          app.set('models', models(app))

          const EventEmitter = require('events')

          class MyEmitter extends EventEmitter {}

          const myEmitter = new MyEmitter()

          app.set('myEmitter', myEmitter)
          app.get('models').notificationListener(host, port, database, username, password)

          if (operation == 'set') {
            const { app } = require('electron')
            app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
            app.exit(0)
          }

          // }, 500)
        }
      })

      console.log('Connection has been established successfully.')
      console.timeEnd()
      return utils.response(
        statusCodes.SUCCESS,
        {
          host,
          username,
          password,
          port,
          database,
        },
        req,
        res,
      )
    } catch (error) {
      console.timeEnd()
      console.error('Unable to connect to the database:', error)
      return utils.response(
        statusCodes.EXPECTATION_FAILED,
        'Unable to connect to the database',
        req,
        res,
      )
    }
  })
}
