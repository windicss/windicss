import { DisplayProcessor, SpecReporter } from 'jasmine-spec-reporter';

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(): string {
    return 'TypeScript test started';
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
