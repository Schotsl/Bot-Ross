"use strict";

module.exports = class DataCollection {
  constructor() {
    this.dataArray = [];
  }

  addDataObject(dataObject) {
    this.dataArray.push(dataObject);
  }

  addDataArray(dataArray) {
    this.dataArray.concat(dataArray);
  }

  setDataArray(dataArray) {
    this.dataArray = dataArray;
  }

  getDataArray() {
    return this.dataArray;
  }
}
