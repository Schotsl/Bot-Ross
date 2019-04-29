let MySQL = require('mysql');
let fs = require('fs');

module.exports = class Language {
  constructor() {
    this.mySQLCredentialsLocation = `${__dirname}/../credentials/mysql.json`;

    if (fs.existsSync(this.mySQLCredentialsLocation)) {
      this.mySQLCredentials = require(this.mySQLCredentialsLocation);
      this.connection = MySQL.createConnection(this.mySQLCredentials);
      this.connection.connect();
    } else {
      report.log(`You are missing core MySQl credentials`);
      process.exit();
    }
  }

  respond(intention, emotion, callback) {
    this.connection.query(`SELECT \`content\` FROM \`languages\` WHERE \`intention\` = '${intention}' ORDER BY ABS ( \`value\` - ${emotion}) LIMIT 1`, function (error, dataArray) {
      if (dataArray.length > 0) callback(dataArray[0]['content']);
      else callback(`Something went wrong, please report this 001 error`);
    });
  }
}
