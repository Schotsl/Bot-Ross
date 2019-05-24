let LightCollection = require('./../Collection/LightCollection.js');

module.exports = class LightCollectionMapper {
  constructor(lightMapper) {
    this.lightMapper = lightMapper;
  }

  map(lightCollectionObject, lightsArray) {
    let that = this;

    lightsArray.forEach(function(lightArray) {
      let lightObject = that.lightMapper.createAndMap(lightArray);
      lightCollectionObject.addLight(lightObject);
    });

    return lightCollectionObject;
  }

  createAndMap(lightsArray) {
    return this.map(new LightCollection, lightsArray);
  }
}
