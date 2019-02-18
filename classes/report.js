module.exports = class Report {
  constructor(fs) {
    this.fs = fs;
  }

  log(rawLine) {
    let currentDateObject = new Date();
    let currentDateString = currentDateObject.getDate() + "-" + currentDateObject.getMonth() + "-" + currentDateObject.getFullYear();
    let currentTimeString = currentDateObject.getHours() + ":" + currentDateObject.getMinutes() + ":" + currentDateObject.getSeconds() + "." + currentDateObject.getMilliseconds();

    this.write(currentTimeString + " [LOG]: " + rawLine + "\n", "logs/" + currentDateString);
    console.log(currentTimeString + " [LOG]: " + rawLine);
  }

  error(rawLine) {
    let currentDateObject = new Date();
    let currentDateString = currentDateObject.getDate() + "-" + currentDateObject.getMonth() + "-" + currentDateObject.getFullYear();
    let currentTimeString = currentDateObject.getHours() + ":" + currentDateObject.getMinutes() + ":" + currentDateObject.getSeconds() + "." + currentDateObject.getMilliseconds();

    this.write(currentTimeString + " [ERROR]: " + rawLine + "\n", "logs/" + currentDateString);
    console.error(currentTimeString + " [ERROR]: " + rawLine);
  }

  write(logFileEntry, logFileName) {
    if (!this.fs.existsSync(logFileName)) this.fs.openSync(logFileName, 'w');
    this.fs.appendFileSync(logFileName, logFileEntry);
  }
}
