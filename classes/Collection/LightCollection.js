"use strict";

module.exports = class LightCollection {
  constructor() {
    this.lightArray = [];
  }

  addLightObject(lightObject) {
    this.lightArray.push(lightObject);
  }

  addLightArray(lightArray) {
    this.lightArray.concat(lightArray);
  }

  setLightArray(lightArray) {
    this.lightArray = lightArray;
  }

  getLightArray() {
    return this.lightArray;
  }
}
