fs = require('fs');

module.exports = class Report {
  constructor() {

  }

  log(rawLine) {
    let currentDateObject = new Date();
    let currentDateString = currentDateObject.getDate() + "-" + currentDateObject.getMonth() + "-" + currentDateObject.getFullYear();
    let currentTimeString = currentDateObject.getHours() + ":" + currentDateObject.getMinutes() + ":" + currentDateObject.getSeconds() + "." + currentDateObject.getMilliseconds();

    this.write(currentTimeString + " [LOG]: " + rawLine + "\n", "logs/" + currentDateString + ".txt");
    console.log(currentTimeString + " [LOG]: " + rawLine);
  }

  error(rawLine) {
    let currentDateObject = new Date();
    let currentDateString = currentDateObject.getDate() + "-" + currentDateObject.getMonth() + "-" + currentDateObject.getFullYear();
    let currentTimeString = currentDateObject.getHours() + ":" + currentDateObject.getMinutes() + ":" + currentDateObject.getSeconds() + "." + currentDateObject.getMilliseconds();

    this.write(currentTimeString + " [ERROR]: " + rawLine + "\n", "logs/" + currentDateString + ".txt");
    console.error(currentTimeString + " [ERROR]: " + rawLine);
  }

  write(logFileEntry, logFileName) {
    if (!fs.existsSync(logFileName)) fs.openSync(logFileName, 'w');
    fs.appendFileSync(logFileName, logFileEntry);
  }
}
