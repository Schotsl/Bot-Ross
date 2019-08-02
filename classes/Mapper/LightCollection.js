"use strict";

let LightCollection = require(`./../Collection/LightCollection.js`);

module.exports = class LightCollectionMapper {
  constructor(lightMapper) {
    this.lightMapper = lightMapper;
  }

  map(lightCollectionObject, lightsArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(lightsArray) !== `undefined` || lightsArray.length > 0) {
      lightsArray.forEach(function(lightArray) {
        let lightObject = that.lightMapper.createAndMap(lightArray);
        lightCollectionObject.addLight(lightObject);
      });
    }

    return lightCollectionObject;
  }

  createAndMap(lightsArray) {
    return this.map(new LightCollection, lightsArray);
  }
}
