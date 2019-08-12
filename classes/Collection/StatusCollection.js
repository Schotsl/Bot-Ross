"use strict";

module.exports = class StatusCollection {
  constructor() {
    this.statusArray = [];
  }

  addStatusObject(statusObject) {
    this.statusArray.push(statusObject);
  }

  addStatusArray(statusArray) {
    this.statusArray.concat(statusArray);
  }

  setStatusArray(statusArray) {
    this.statusArray = statusArray;
  }

  getStatusArray() {
    return this.statusArray;
  }
}
