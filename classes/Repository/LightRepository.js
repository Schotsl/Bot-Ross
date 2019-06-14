"use strict";

module.exports = class LightRepository {
  constructor(lightCollectionMapper) {
    this.lightCollectionMapper = lightCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`hue\` FROM \`lights\` WHERE 1`, function(error, lightsArray) {
      connection.end();
      callback(that.lightCollectionMapper.createAndMap(lightsArray));
    });
  }
}
