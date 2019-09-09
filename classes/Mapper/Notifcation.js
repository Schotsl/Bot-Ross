"use strict";

let Notifcation = require(`./../Entity/Notifcation.js`);

module.exports = class NotifcationMapper {
  constructor() {

  }

  map(notifcationObject, notifcationArray) {
    if (typeof(notifcationArray.id) !== `undefined` && notifcationArray.id !== null) notifcationObject.setId(notifcationArray.id);
    if (typeof(notifcationArray.type) !== `undefined` && notifcationArray.type !== null) notifcationObject.setType(notifcationArray.type);
    if (typeof(notifcationArray.content) !== `undefined` && notifcationArray.content !== null) notifcationObject.setContent(notifcationArray.content);
    if (typeof(notifcationArray.datetime) !== `undefined` && notifcationArray.datetime !== null) notifcationObject.setDatetime(notifcationArray.datetime);

    return notifcationObject;
  }

  createAndMap(notifcationArray) {
    return this.map(new Notifcation, notifcationArray);
  }
}
