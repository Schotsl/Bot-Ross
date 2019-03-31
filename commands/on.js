module.exports = class On extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "on";
  }

  executeCustom(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`${message.author.tag} (${message.author.id}) used the ".on" command`);

    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOn.on()));
  }
}
