"use strict";

let MySQL = require(`mysql`);

module.exports = class PersonRepository {
  constructor(personCollectionMapper) {
    this.personCollectionMapper = personCollectionMapper;
  }

  getAll(callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`telegram\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE 1`, function(error, personsArray) {
      connection.end();
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
  }

  getByFirst(first, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`telegram\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`first\` LIKE '%${first}%'`, function(error, personsArray) {
      connection.end();
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
  }

  getByDiscord(discord, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`telegram\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`discord\` LIKE '%${discord}%'`, function(error, personsArray) {
      connection.end();
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
  }

  getByTelegram(telegram, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    connection.query(`SELECT \`id\`, \`score\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`telegram\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`telegram\` LIKE '%${telegram}%'`, function(error, personsArray) {
      connection.end();
      callback(that.personCollectionMapper.createAndMap(personsArray));
    });
  }

  updateUser(user, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `UPDATE \`persons\` SET `;
    if (typeof(user.ip) !== `undefined`) query += `\`ip\` = '${user.ip}', `;
    if (typeof(user.last) !== `undefined`) query += `\`last\` = '${user.last}', `;
    if (typeof(user.city) !== `undefined`) query += `\`city\` = '${user.city}', `;
    if (typeof(user.score) !== `undefined`) query += `\`score\` = '${user.score}', `;
    if (typeof(user.first) !== `undefined`) query += `\`first\` = '${user.first}', `;
    if (typeof(user.email) !== `undefined`) query += `\`email\` = '${user.email}', `;
    if (typeof(user.insta) !== `undefined`) query += `\`insta\` = '${user.insta}', `;
    if (typeof(user.adres) !== `undefined`) query += `\`adress\` = '${user.adress}', `;
    if (typeof(user.postal) !== `undefined`) query += `\`postal\` = '${user.postal}', `;
    if (typeof(user.twitter) !== `undefined`) query += `\`twitter\` = '${user.twitter}', `;
    if (typeof(user.discord) !== `undefined`) query += `\`discord\` = '${user.discord}', `;
    if (typeof(user.telegram) !== `undefined`) query += `\`telegram\` = '${user.telegram}', `;
    if (typeof(user.discord_url) !== `undefined`) query += `\`discord_url\` = '${user.discord_url}', `;
    if (typeof(user.discord_user) !== `undefined`) query += `\`discord_user\` = '${user.discord_user}', `;
    if (typeof(user.birthday) !== `undefined`) query += `\`birthday\` = '${user.birthday.getFullYear()}-${user.birthday.getMonth() + 1}-${user.birthday.getDate()}', `;
    query = `${query.substring(0, query.length - 2)} WHERE \`id\` = '${user.id}'`;

    connection.query(query, function(error, personsArray) {
      connection.end();
      if (callback) callback(user);
    });
  }

  saveUser(user, callback) {
    let that = this;
    let connection = MySQL.createConnection(mySQLCredentials);

    let query = `INSERT INTO \`persons\` (`;
    if (typeof(user.ip) !== `undefined`) query += `\`ip\`, `;
    if (typeof(user.last) !== `undefined`) query += `\`last\`, `;
    if (typeof(user.city) !== `undefined`) query += `\`city\`, `;
    if (typeof(user.score) !== `undefined`) query += `\`score\`, `;
    if (typeof(user.first) !== `undefined`) query += `\`first\`, `;
    if (typeof(user.email) !== `undefined`) query += `\`email\`, `;
    if (typeof(user.insta) !== `undefined`) query += `\`insta\`, `;
    if (typeof(user.adres) !== `undefined`) query += `\`adress\`, `;
    if (typeof(user.postal) !== `undefined`) query += `\`postal\`, `;
    if (typeof(user.twitter) !== `undefined`) query += `\`twitter\`, `;
    if (typeof(user.discord) !== `undefined`) query += `\`discord\`, `;
    if (typeof(user.telegram) !== `undefined`) query += `\`telegram\`, `;
    if (typeof(user.discord_url) !== `undefined`) query += `\`discord_url\`, `;
    if (typeof(user.discord_user) !== `undefined`) query += `\`discord_user\`, `;
    if (typeof(user.birthday) !== `undefined`) query += `\`birthday\`, `;
    query = `${query.substring(0, query.length - 2)} ) VALUES (`;

    if (typeof(user.ip) !== `undefined`) query += `'${user.ip}', `;
    if (typeof(user.last) !== `undefined`) query += `'${user.last}', `;
    if (typeof(user.city) !== `undefined`) query += `'${user.city}', `;
    if (typeof(user.score) !== `undefined`) query += `'${user.score}', `;
    if (typeof(user.first) !== `undefined`) query += `'${user.first}', `;
    if (typeof(user.email) !== `undefined`) query += `'${user.email}', `;
    if (typeof(user.insta) !== `undefined`) query += `'${user.insta}', `;
    if (typeof(user.adres) !== `undefined`) query += `'${user.adress}', `;
    if (typeof(user.postal) !== `undefined`) query += `'${user.postal}', `;
    if (typeof(user.twitter) !== `undefined`) query += `'${user.twitter}', `;
    if (typeof(user.discord) !== `undefined`) query += `'${user.discord}', `;
    if (typeof(user.telegram) !== `undefined`) query += `'${user.telegram}', `;
    if (typeof(user.discord_url) !== `undefined`) query += `'${user.discord_url}', `;
    if (typeof(user.discord_user) !== `undefined`) query += `'${user.discord_user}', `;
    if (typeof(user.birthday) !== `undefined`) query += `'${user.birthday.getFullYear()}-${user.birthday.getMonth() + 1}-${user.birthday.getDate()}', `;
    query = `${query.substring(0, query.length - 2)})`;

    connection.query(query, function(error, personsArray) {
      connection.query(`SELECT LAST_INSERT_ID()`, function(error, lastId) {
        user.setId(lastId[0][`LAST_INSERT_ID()`]);

        connection.end();
        if (callback) callback(user);
      });
    });
  }
}
