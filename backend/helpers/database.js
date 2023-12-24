const cp = require('child_process')
const path = require('path')
const { createdb, dropdb } = require('../library/pg-advance')

const backupDbPath = global.IsDevMode
  ? path.join(__dirname, '..', 'demo_database')
  : path.join(__dirname, '..', '..', 'resources', 'demo_database')

const exportCommand = process.platform === 'win32' ? 'set' : 'export'

const pg_restore =
  process.platform === 'win32' ? 'c:/Progra~1/PostgreSQL/14/bin/pg_restore' : 'pg_restore'

const pg_dropdb = process.platform === 'win32' ? 'c:/Progra~1/PostgreSQL/14/bin/dropdb' : 'dropdb'

const dropDatabase = (config, dbName) => {
  return new Promise((resolve, reject) => {
    dropdb(config, dbName)
      .then(() => {
        console.log('DROP EXISTING DATABASE')
        return resolve(true)
      })
      .catch((err) => {
        if (err.name == 'invalid_catalog_name') {
          console.log('DATABASE DOES NOT EXIST')
          return resolve(true)
        } else {
          console.log('err.name : ', err.name)
          console.log('err.message : ', err.message)
          console.error(err)
          return resolve(true)
        }
      })
  })
}

exports.CreateNewPgDatabase = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve) => {
    const config = {
      user: dbUser,
      password: dbPassword,
      port: dbPort,
      host: dbHost,
    }

    dropDatabase(config, dbName).then((canCreateDb) => {
      if (canCreateDb) {
        createdb(config, dbName)
          .then(() => {
            return resolve(true)
          })
          .catch((err) => {
            console.error(err)
            return resolve(false)
          })
      } else {
        return resolve(false)
      }
    })

    // cp.exec(
    //   `${exportCommand} "PGPASSWORD=${dbPassword}" && dropdb -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
    //   () => {
    //     cp.exec(
    //       `${exportCommand} "PGPASSWORD=${dbPassword}" && createdb -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
    //       (err) => {
    //         if (err) {
    //           console.error(err)
    //           return resolve(false)
    //         }

    //         return resolve(true)
    //       },
    //     )
    //   },
    // )
  })
}

const restoreAbsolute = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve, reject) => {
    cp.exec(
      `${exportCommand} "PGPASSWORD=${dbPassword}" && ${pg_restore} -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} ${backupDbPath}`,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      },
    )
  })
}

const restoreCommand = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve, reject) => {
    cp.exec(
      `${exportCommand} "PGPASSWORD=${dbPassword}" && pg_restore -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} ${backupDbPath}`,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      },
    )
  })
}

const dropdbAbsolute = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve, reject) => {
    cp.exec(
      `${exportCommand} "PGPASSWORD=${dbPassword}" && ${pg_dropdb} -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      },
    )
  })
}

const dropdbCommand = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve, reject) => {
    cp.exec(
      `${exportCommand} "PGPASSWORD=${dbPassword}" && dropdb -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      },
    )
  })
}

exports.ImportPgDatabase = ({ dbHost, dbPort, dbName, dbUser, dbPassword }) => {
  return new Promise((resolve, reject) => {
    // const { stdout, stderr } = await pgRestore(
    //   {
    //     port: dbPort, // defaults to 5432
    //     host: dbHost,
    //     database: dbName,
    //     username: dbUser,
    //     password: dbPassword,
    //   },
    //   {
    //     filename: backupDbPath, // note the filename instead of file, following the pg_restore naming.
    //     clean: false, // defaults to false
    //     create: false, // defaults to false
    //   },
    // ) // outputs an execa object
    // console.log('stdout :: ', stdout)
    // console.log('stderr :: ', stderr)


    restoreAbsolute({ dbHost, dbPort, dbName, dbUser, dbPassword })
      .then(() => {
        return resolve(true)
      })
      .catch((err) => {
        if (err) {
          restoreCommand({ dbHost, dbPort, dbName, dbUser, dbPassword })
            .then(() => {
              return resolve(true)
            })
            .catch((err) => {
              if (err) {
                dropdbAbsolute({ dbHost, dbPort, dbName, dbUser, dbPassword })
                  .then(() => {
                    return resolve(true)
                  })
                  .catch((err) => {
                    if (err) {
                      dropdbCommand({ dbHost, dbPort, dbName, dbUser, dbPassword })
                        .then(() => {
                          return resolve(true)
                        })
                        .catch((err) => {
                          if (err) {
                            return reject(err)
                          }
                        })
                    }
                  })
              }
            })
        }
      })

    // cp.exec(
    //   `${exportCommand} "PGPASSWORD=${dbPassword}" && ${pg_restore} -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} ${backupDbPath}`,
    //   (err) => {
    //     console.log('err : ', err)
    //     if (err) {
    //       cp.exec(
    //         `${exportCommand} "PGPASSWORD=${dbPassword}" && ${pg_dropdb} -h ${dbHost} -p ${dbPort} -U ${dbUser} ${dbName}`,
    //         () => {
    //           return reject(err)
    //         },
    //       )
    //     }
    //     return resolve(true)
    //   },
    // )
  })
}
