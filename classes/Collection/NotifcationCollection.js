"use strict";

module.exports = class NotifcationCollection {
  constructor() {
    this.notifcationArray = [];
  }

  addNotifcationObject(notifcationObject) {
    this.notifcationArray.push(notifcationObject);
  }

  addNotifcationArray(notifcationArray) {
    this.notifcationArray.concat(notifcationArray);
  }

  setNotifcationArray(notifcationArray) {
    this.notifcationArray = notifcationArray;
  }

  getNotifcationArray() {
    return this.notifcationArray;
  }
}
