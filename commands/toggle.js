module.exports = class Party extends Command {
  constructor() {
    super();
    this.trigger = "party";
  }

  execute(input) {
    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
}
