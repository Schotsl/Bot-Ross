module.exports = class Light {
  constructor() {
    this.id;
    this.hue;
  }

  setId(id) {
    this.id = id;
  }

  setScore(hue) {
    this.hue = hue;
  }

  getId() {
    return this.id;
  }

  getHue() {
    return this.hue;
  }
}
