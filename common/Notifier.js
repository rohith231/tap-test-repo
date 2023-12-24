let notifier
try {
    let EventEmitter = require('events').EventEmitter
    notifier = new EventEmitter()
} catch (error) {
    
}

module.exports = notifier
