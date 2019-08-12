"use strict";

let DataCollection = require(`./../Collection/DataCollection.js`);

module.exports = class DataCollectionMapper {
  constructor(dataMapper) {
    this.dataMapper = dataMapper;
  }

  map(dataCollectionObject, datasArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(datasArray) !== `undefined` || datasArray.length > 0) {
      datasArray.forEach(function(dataArray) {
        let dataObject = that.dataMapper.createAndMap(dataArray);
        dataCollectionObject.addData(dataObject);
      });
    }

    return dataCollectionObject;
  }

  createAndMap(datasArray) {
    return this.map(new DataCollection, datasArray);
  }
}
