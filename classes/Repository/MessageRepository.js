"use strict";

let MySQL = require(`mysql`);

module.exports = class MessageRepository {
  constructor(messageCollectionMapper) {
    this.messageCollectionMapper = messageCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`person\`, \`recieved\`, \`content\` FROM \`messages\` WHERE 1`, function(error, messagesArray) {
      connection.end();
      callback(that.messageCollectionMapper.createAndMap(messagesArray));
    });
  }

  getByPerson(personId, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`person\`, \`recieved\`, \`content\` FROM \`messages\` WHERE \`person\` = ${personId}`, function(error, messagesArray) {
      connection.end();
      callback(that.messageCollectionMapper.createAndMap(messagesArray));
    });
  }

  saveMessage(message, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `INSERT INTO \`messages\` (`;
    if (typeof(message.person) !== `undefined`) query += `\`person\`, `;
    if (typeof(message.content) !== `undefined`) query += `\`content\`, `;
    if (typeof(message.recieved) !== `undefined`) query += `\`recieved\`, `;
    query = `${query.substring(0, query.length - 2)} ) VALUES (`;

    if (typeof(message.person) !== `undefined`) query += `'${message.person}', `;
    if (typeof(message.content) !== `undefined`) query += `'${message.content}', `;
    if (typeof(message.recieved) !== `undefined`) query += `'${message.recieved}', `;
    query = `${query.substring(0, query.length - 2)})`;

    connection.query(query, function(error, personsArray) {
      connection.query(`SELECT LAST_INSERT_ID()`, function(error, lastId) {
        message.setId(lastId[0][`LAST_INSERT_ID()`]);

        if (callback) {
          connection.end();
          callback(message);
        }
      });
    });
  }
}
