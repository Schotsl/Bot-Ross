"use strict";

fs = require(`fs`);

module.exports = class Report {
  constructor() {

  }

  log(rawLine) {
    let currentDateObject = new Date();

    let currentDateDay = `0${currentDateObject.getDate()}`.slice(-2);
    let currentDateMonth = `0${currentDateObject.getMonth()}`.slice(-2);
    let currentDateYear = `0${currentDateObject.getFullYear()}`.slice(-2);
    let currentDateString = `${currentDateDay}-${currentDateMonth}-${currentDateYear}`;

    let currentTimeHour = `0${currentDateObject.getHours()}`.slice(-2);
    let currentTimeMinute = `0${currentDateObject.getMinutes()}`.slice(-2);
    let currentTimeSecond = `0${currentDateObject.getSeconds()}`.slice(-2);
    let currentTimeMillis = `000${currentDateObject.getMilliseconds()}`.slice(-3);
    let currentTimeString = `${currentTimeHour}:${currentTimeMinute}:${currentTimeSecond}.${currentTimeMillis}`;

    this.write(`${currentTimeString} [LOG]: ${rawLine}\n`, `${currentDateString}.txt`, `logs`);
    console.log(`${currentTimeString} [LOG]: ${rawLine}`);
  }

  error(rawLine) {
    let currentDateObject = new Date();

    let currentDateDay = `0${currentDateObject.getDate()}`.slice(-2);
    let currentDateMonth = `0${currentDateObject.getMonth()}`.slice(-2);
    let currentDateYear = `0${currentDateObject.getFullYear()}`.slice(-2);
    let currentDateString = `${currentDateDay}-${currentDateMonth}-${currentDateYear}`;

    let currentTimeHour = `0${currentDateObject.getHours()}`.slice(-2);
    let currentTimeMinute = `0${currentDateObject.getMinutes()}`.slice(-2);
    let currentTimeSecond = `0${currentDateObject.getSeconds()}`.slice(-2);
    let currentTimeMillis = `000${currentDateObject.getMilliseconds()}`.slice(-3);
    let currentTimeString = `${currentTimeHour}:${currentTimeMinute}:${currentTimeSecond}.${currentTimeMillis}`;

    this.write(`${currentTimeString} [ERROR]: ${rawLine}\n`, `${currentDateString}.txt`, `logs`);
    console.error(`${currentTimeString} [ERROR]: ${rawLine}`);
  }

  write(logFileEntry, logFileName, logFileDirectory) {
    if (!fs.existsSync(logFileDirectory)) fs.mkdirSync(logFileDirectory);
    if (!fs.existsSync(`${logFileDirectory}/${logFileName}`)) fs.openSync(`${logFileDirectory}/${logFileName}`, `w`);
    fs.appendFileSync(`${logFileDirectory}/${logFileName}`, logFileEntry);
  }
}
