"use strict";

module.exports = class LogCollection {
  constructor() {
    this.logs = [];
  }

  addLog(log) {
    this.logs.push(log);
  }

  setLogs(logs) {
    this.logs = logs;
  }

  getLogs() {
    return this.logs;
  }
}
