module.exports = class Party extends Command {
  constructor() {
    super();
    this.trigger = "party";
  }

  execute(input) {
    lampArray.forEach(function(officeLight) {
      officeLight.getState(function(startState) {

        let totalOffset = 0;
        for (let i = 0; i < 10; i ++ ) {
          totalOffset += functions.getRandomInteger(100, 1000);
          setTimeout(function() {
            let newLightState = LightState.create().on();
            newLightState.ct(functions.getRandomInteger(153, 500));
            newLightState.bri(functions.getRandomInteger(0, 255));
            newLightState.transitionInstant()

            //If last callback, return the lights to normal
            if (i == 9) officeLight.setState(startState);
            else officeLight.setState(newLightState);
          }, totalOffset);
        }
      });
    });
  }
}
