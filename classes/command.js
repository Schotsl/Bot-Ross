module.exports = class Command {
  constructor() {
    this.timeout = 0;
    this.trigger = "";
  }

  match(input) {
    return input === this.trigger;
  }
}
