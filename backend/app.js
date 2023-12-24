const app = require('express')();
const kill = require('kill-port');
const serverMiddlewares = require("./middlewares/serverMiddlewares");
const errorsMiddlewares = require("./middlewares/errorsMiddlewares");
const controllers = require('./controllers');
const notifier = require('../common/Notifier');
const { ENVIROMENT, PORTS } = require('../common/config/env');
const { exec } = require('child_process');

let server = null

app.set("cache", global.Cache);

serverMiddlewares(app);

controllers(app);

errorsMiddlewares(app);

var foundProcess = false;
var pid = 0;
exec(process.platform === 'win32' ? ('netstat -a -n -o | find ' + PORTS.app) : ('lsof -i :' + PORTS.app), (err, stdout, stderr) => {
  if(err) {
    console.log('Error : Cound not check for running process');
    console.log('Error: ', err);
  } else {
    console.log('stdout : ', stdout);
    console.log('stderr : ', stderr);
    console.log('Processing found. Restarting...');
    foundProcess = true;
  }
});

if (true == foundProcess) {
  exec(process.platform === 'win32' ? ('taskkill /F /PID ' + PORTS.app) : ('kill -9 $(lsof -ti :' + PORTS.app + ')'), (err, stdout, stderr) => {
    if(err) {
      console.log('Error : Unable to free the port.');
      console.log('Error : ', err);
    } else {
      console.log('stdout : ', stdout);
      console.log('stderr : ', stderr);
      console.log('Port cleaned.');
      foundProcess = true;
    }
  });
}

server = app.listen(PORTS.app, async () => {
  if(!ENVIROMENT.isdev){
    const expressListRoutes = require('express-list-routes');
    // console.dir(expressListRoutes(app))
  }
  console.log(`Server Listing on Port ${PORTS.app}`);
});

app.on('error', function (e) {
  console.error("eeeee " + e);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.info('Process terminated')
  })
})


notifier.on('kill-app', (message) => {
  try {
    shutDown()
    server.close(() => {
      console.log('Process terminated 1')
      process.exit()
    })
  } catch (error) {
    
  }
  

})

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
      console.log('Closed out remaining connections');
      process.exit(0);
  });

  setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
  }, 10000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
//*** > auto generate port if already current port used ***///

// getAvailablePort(3000).then(port => {
//   console.log(`${port} is available`)
//   app.listen(port, async () => {
//
//     if (process.env.NODE_ENV == 'development') {
//       const expressListRoutes = require('express-list-routes');
//       console.dir(expressListRoutes(app))
//     }
//     console.log("Server Listing on Port :::", port);
//     ipcMain.emit('port',port);
//   });
// })
//
// function getAvailablePort(startingAt) {
//   function getNextAvailablePort(currentPort, cb) {
//     const server = net.createServer()
//     server.listen(currentPort, _ => {
//       server.once('close', _ => {
//         cb(currentPort)
//       })
//       server.close()
//     })
//     server.on('error', _ => {
//       getNextAvailablePort(++currentPort, cb)
//     })
//   }
//
//   return new Promise(resolve => {
//     getNextAvailablePort(startingAt, resolve)
//   })
// }


module.exports = app;
