"use strict";

let NotifcationCollection = require(`./../Collection/NotifcationCollection.js`);

module.exports = class NotifcationCollectionMapper {
  constructor(notifcationMapper) {
    this.notifcationMapper = notifcationMapper;
  }

  map(notifcationCollectionObject, notifcationsArray) {
    let that = this;

    //Something causes empty arrays to be parsed this is a hot fix
    if (typeof(notifcationsArray) !== `undefined` || notifcationsArray.length > 0) {
      notifcationsArray.forEach(function(notifcationArray) {
        let notifcationObject = that.notifcationMapper.createAndMap(notifcationArray);
        notifcationCollectionObject.addNotifcationObject(notifcationObject);
      });
    }

    return notifcationCollectionObject;
  }

  createAndMap(notifcationsArray) {
    return this.map(new NotifcationCollection, notifcationsArray);
  }
}
