module.exports = class Off extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "off";
  }

  executeCustom(command, input, message) {
    message.channel.send(language.respond('confirm', emotion));

    let newLightOff = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOff.off()));
  }
}
