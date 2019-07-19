"use strict";

module.exports = class StatusCollection {
  constructor() {
    this.statuses = [];
  }

  addStatus(status) {
    this.statuses.push(status);
  }

  setSentences(statuses) {
    this.statuses = statuses;
  }

  getSentences() {
    return this.statuses;
  }
}
