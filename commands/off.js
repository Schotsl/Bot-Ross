module.exports = class Off extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "off";
  }

  executeCustom(command, input, message) {
    language.respond('confirm', emotionValue, (response) => message.channel.send(response));
    language.respond('off', emotionValue, (response) => message.channel.send(response));

    let newLightOff = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOff.off()));
  }
}
