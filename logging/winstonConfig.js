const winston = require('winston')
const path = require('path')


var fileLogPath = path.join(__dirname, 'app.log')

var options = {
    file: {
        level: 'info',
        filename: fileLogPath,
        handleExceptions: true,
        json: true,
        maxsize:  5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
      },
}

var logger = winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms()
    ),
    exitOnError: false, // do not exit on handled exceptions
  });


  module.exports = logger;