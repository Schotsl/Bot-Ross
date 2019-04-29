module.exports = class PersonRepository {
  constructor(personCollectionMapper) {
    this.personCollectionMapper = personCollectionMapper;
  }

  getAll(callback) {
    let that = this;

    connection.query(`SELECT \`id\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE 1`, function (error, personsArray) {
      callback(that.personCollectionMapper.createAndMap(personsArray));
    })
  }

  getByFirst(first, callback) {
    let that = this;

    connection.query(`SELECT \`id\`, \`first\`, \`last\`, \`email\`, \`adress\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE \`first\` LIKE '%${first}%'`, function (error, personsArray) {
      callback(that.personCollectionMapper.createAndMap(personsArray));
    })
  }
}
