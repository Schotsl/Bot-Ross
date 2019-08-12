"use strict";

let Data = require(`./../Entity/Data.js`);

module.exports = class DataMapper {
  constructor() {

  }

  map(dataObject, dataArray) {
    if (typeof(dataArray.id) !== `undefined` && dataArray.id !== null) dataObject.setId(dataArray.id);
    if (typeof(dataArray.label) !== `undefined` && dataArray.label !== null) dataObject.setLabel(dataArray.label);
    if (typeof(dataArray.content) !== `undefined` && dataArray.content !== null) dataObject.setContent(dataArray.content);
    if (typeof(dataArray.version) !== `undefined` && dataArray.version !== null) dataObject.setVersion(dataArray.version);

    return dataObject;
  }

  createAndMap(dataArray) {
    return this.map(new Data, dataArray);
  }
}
