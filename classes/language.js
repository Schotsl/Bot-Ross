module.exports = class Language {
  constructor(fs) {
    this.fs = fs;
    this.language = {};

    this.loadLanguage();
  }

  loadLanguage() {
    let tempBuffer = this.fs.readFileSync('language.json');
    //Todo: Figure out why we need double JSON.parse on line 12
    this.language = JSON.parse(JSON.parse(tempBuffer));
    report.log(`Language has been loaded`);
  }

  respond(intention, emotion) {
    let responseArray = this.language[intention][emotion];
    if (responseArray.length) return responseArray[Math.floor(Math.random() * responseArray.length)];
    else {
      if (emotion === "sad") return this.respond(intention, "surprised");
      if (emotion === "happy") return this.respond(intention, "surprised");
    }
  }
}
