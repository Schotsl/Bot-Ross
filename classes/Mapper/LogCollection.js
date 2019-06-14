"use strict";

let LogCollection = require(`./../Collection/LogCollection.js`);

module.exports = class LogCollectionMapper {
  constructor(logMapper) {
    this.logMapper = logMapper;
  }

  map(logCollectionObject, logsArray) {
    let that = this;

    logsArray.forEach(function(logsArray) {
      let logObject = that.logMapper.createAndMap(logsArray);
      logCollectionObject.addLog(logObject);
    });

    return logCollectionObject;
  }

  createAndMap(logsArray) {
    return this.map(new LogCollection, logsArray);
  }
}
