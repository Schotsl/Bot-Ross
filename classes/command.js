module.exports = class Command {
  constructor() {
    this.timeout = 0;
    this.trigger = "";
    this.permission = 0;
  }

  match(input) {
    return input === this.trigger;
  }
}
