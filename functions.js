"use strict";

module.exports = {
  getTimeInMillis: function() {
    return new Date().getTime();
  },
  getRandomInteger: function(tempMin, tempMax) {
    tempMin = Math.ceil(tempMin);
    tempMax = Math.floor(tempMax);
    return Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin;
  },
  getFileExtension: function(fileName) {
    let periodIndex = fileName.lastIndexOf('.');
    return (periodIndex < 0) ? '' : fileName.substr(periodIndex);
  },
  capitalizeFirstLetter: function(inputString) {
    let firstCharacter = inputString.charAt(0);
    let remainingString = inputString.slice(1);
    return firstCharacter.toUpperCase() + remainingString;
  }
};
