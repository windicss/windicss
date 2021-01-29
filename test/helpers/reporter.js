const { DisplayProcessor, SpecReporter} = require("jasmine-spec-reporter");

class CustomProcessor extends DisplayProcessor {
  displayJasmineStarted() {
    return `JavaScript test started`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayPending: true,
      displayDuration: true,
    },
    customProcessors: [CustomProcessor],
  })
);
