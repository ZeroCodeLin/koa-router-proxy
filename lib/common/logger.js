"use strict";
let logger = null;
/**
 * set logger
 * @param userLogger logger
 */
function setLogger(userLogger) {
    logger = userLogger;
}

exports.setLogger = setLogger;

function log(method, url, statusCode, time, errorMessage) {
    let msg = `"${method} ${url}"`;
    if (statusCode !== undefined) {
        msg += ` ${statusCode}`;
    }
    if (time !== undefined) {
        msg += ` ${time}ms`;
    }
    if (errorMessage !== undefined) {
        msg += ` ${errorMessage}`;
    }
    if (logger && typeof logger.info === 'function') {
        logger.info(msg);
    }
    else {
        console.info(msg);
    }
}
exports.log = log;