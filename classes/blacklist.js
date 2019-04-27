let fs = require('fs');

module.exports = class Blacklist {
  constructor() {
    this.listed = new Array();

    this.loadBlacklist();
  }

  saveBlacklist() {
    let tempJSON = JSON.stringify(this.listed);
    fs.writeFileSync('blacklist.json', tempJSON);
    report.log(`Blacklist has been saved`);
  }

  loadBlacklist() {
    let tempBuffer = fs.readFileSync('blacklist.json');
    this.listed = JSON.parse(tempBuffer);
    report.log(`Blacklist has been loaded`);
  }

  addId(newId) {
    this.listed.push(newId);
    this.saveBlacklist();
  }

  checkId(checkId) {
    return this.listed.includes(checkId);
  }

  removeId(removeId) {
    var index = this.listed.indexOf(removeId);
    if (index !== -1) this.listed.splice(index, 1);
    this.saveBlacklist();
  }
}
