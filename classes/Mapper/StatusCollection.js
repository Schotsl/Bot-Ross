"use strict";

let StatusCollection = require(`./../Collection/StatusCollection.js`);

module.exports = class StatusCollectionMapper {
  constructor(statusMapper) {
    this.statusMapper = statusMapper;
  }

  map(statusCollectionObject, statusArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(statusArray) !== `undefined` || statusArray.length > 0) {
      statusArray.forEach(function(statusArray) {
        let statusObject = that.statusMapper.createAndMap(statusArray);
        statusCollectionObject.addStatus(statusObject);
      });
    }

    return statusCollectionObject;
  }

  createAndMap(statusArray) {
    return this.map(new StatusCollection, statusArray);
  }
}
