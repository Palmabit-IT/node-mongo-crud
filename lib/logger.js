var winston = require('winston');
var logger;

winston.emitErrs = true;

if (process.env.NODE_ENV !== 'test') {
    logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                timestamp: true,
                level: process.env.LOG_LEVEL || 'debug',
                handleExceptions: false,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
} else {
    // while testing, log only to file, leaving stdout free for unit test status messages
    logger = new winston.Logger({
        transports: [
            new(winston.transports.File)({
                filename: 'logs/test.log'
            })
        ]
    });
}

logger.stream = {
    write: function(message, encoding) {
        logger.debug(message.replace(/\n$/, ''));
    }
};

module.exports = logger;
