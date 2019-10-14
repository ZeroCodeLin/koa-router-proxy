const chalk = require('chalk');

class Log {
    constructor() {   
    }

    warn() {
        console.log(`${chalk.bgKeyword('orange').white('warning: ')}`, chalk.keyword('orange')(...arguments));
        console.log();
    }

    error() {
        console.log(`${chalk.bgRed.white('error: ')}`, chalk.red(...arguments));
        console.log();
    }

    success() {
        console.log(`${chalk.bgGreen.white('success: ')}`, chalk.green(...arguments));
        console.log();
    }

    info() {
        console.log(...arguments);
    }
}

module.exports = Log;
