"use strict";

let Status = require(`./../Entity/Status.js`);

module.exports = class StatusMapper {
  constructor() {

  }

  map(statusObject, statusArray) {
    if (typeof(statusArray.id) !== `undefined` && statusArray.id !== null) statusObject.setId(statusArray.id);
    if (typeof(statusArray.state) !== `undefined` && statusArray.state !== null) statusObject.setState(statusArray.state);
    if (typeof(statusArray.person) !== `undefined` && statusArray.person !== null) statusObject.setPerson(statusArray.person);
    if (typeof(statusArray.platform) !== `undefined` && statusArray.platform !== null) statusObject.setPlatform(statusArray.platform);

    return statusObject;
  }

  createAndMap(statusArray) {
    return this.map(new Status, statusArray);
  }
}
