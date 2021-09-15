# package.json Scripts

Doc version: 2021-09-08

Main targets:

- **package-json-version:** displays boilerplate version date;

- **clean:** clean dev and distributions builds;

- **quick-test:** runs and watch the **test/00_quick_test.ts** script for quick testing;

- **start:** runs and watch the Mocha tests at src/test;

- **build:** builds the distribution library for NPM publishing, without docs. Then the package can be published with **npm publish**;

- **build-with-docs:** builds the distribution library for NPM publishing, including docs;

- **build-docs:** builds HTML docs.


## Service Scripts

These aren't meant to be run directly, but a documentation hasn't harmed anybody so far:

- **service:build-main:** launch the Webpack production processing of the program;

- **service:build:** builds the program and the quick test for development;

- **service:watch:quick-test:server:** nodemons the execution of 00-quick-test.js;

- **service:watch:mocha:server:** nodemons the execution of mocha.js.
