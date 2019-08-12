"use strict";

module.exports = class DataCollection {
  constructor() {
    this.datas = [];
  }

  addData(data) {
    this.datas.push(data);
  }

  setDatas(datas) {
    this.datas = datas;
  }

  getDatas() {
    return this.datas;
  }
}
