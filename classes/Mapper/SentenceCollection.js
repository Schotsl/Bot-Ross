"use strict";

let StatusCollection = require(`./../Collection/StatusCollection.js`);

module.exports = class StatusCollectionMapper {
  constructor(sentenceMapper) {
    this.statusMapper = statusMapper;
  }

  map(statusCollectionObject, statusArray) {
    let that = this;

    statusArray.forEach(function(statusArray) {
      let statusObject = that.statusMapper.createAndMap(statusArray);
      statusCollectionObject.addStatus(statusObject);
    });

    return statusCollectionObject;
  }

  createAndMap(statusArray) {
    return this.map(new StatusCollection, statusArray);
  }
}
