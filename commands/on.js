module.exports = class On extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "on";
  }

  executeCustom(command, input, message) {
    language.respond('confirm', emotionValue, (response) => message.channel.send(response));
    language.respond('on', emotionValue, (response) => message.channel.send(response));

    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOn.on()));
  }
}
