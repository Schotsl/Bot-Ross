let MySQL = require('mysql');
let fs = require('fs');

module.exports = class Language {
  constructor() {

  }

  respond(intention, emotion, callback) {
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`content\` FROM \`languages\` WHERE \`intention\` = '${intention}' ORDER BY ABS ( \`value\` - ${emotion}) LIMIT 1`, function (error, dataArray) {
      if (dataArray.length > 0) callback(dataArray[0]['content']);
      else callback(`Something went wrong, please report this 001 error`);
    });
    connection.end();
  }
}
