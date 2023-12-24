log = require('electron-log')
console.log = log.log

log.catchErrors({
  showDialog: false,
  onError(error, versions, submitIssue) {
    console.error(error.message)
  },
})

log.transports.console.format = '{h}:{i}:{s} {text}'


// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log