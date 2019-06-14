"use strict";

let Log = require(`./../Entity/Log.js`);

module.exports = class LogMapper {
  constructor() {

  }

  map(logObject, logArray) {
    if (typeof(logArray.id) !== `undefined` && logArray.id !== null) logObject.setId(logArray.id);
    if (typeof(logArray.state) !== `undefined` && logArray.state !== null) logObject.setState(logArray.state);
    if (typeof(logArray.person) !== `undefined` && logArray.person !== null) logObject.setPerson(logArray.person);

    return logObject;
  }

  createAndMap(logArray) {
    return this.map(new Log, logArray);
  }
}
