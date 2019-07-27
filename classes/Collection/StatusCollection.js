"use strict";

module.exports = class StatusCollection {
  constructor() {
    this.statuses = [];
  }

  addStatus(status) {
    this.statuses.push(status);
  }

  setStatuses(statuses) {
    this.statuses = statuses;
  }

  getStatuses() {
    return this.statuses;
  }
}
