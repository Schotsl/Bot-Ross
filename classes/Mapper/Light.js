let Light = require('./../Entity/Light.js');

module.exports = class LightMapper {
  map(lightObject, lightArray) {
    if (typeof lightArray.id != "undefined" && lightArray.id != null) lightObject.setId(lightArray.id);
    if (typeof lightArray.hue != "undefined" && lightArray.hue != null) lightObject.setHue(lightArray.hue);

    return lightObject;
  }

  createAndMap(lightArray) {
    return this.map(new Light, lightArray);
  }
}
