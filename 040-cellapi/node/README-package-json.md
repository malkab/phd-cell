# package.json Script

Main targets:

- **clean:** clean dev and distributions builds;

- **quick-test:** runs and watch the src/test/00-quick-test.ts script for quick testing;

- **start:** runs and watch the API testing entry point at the **main.ts** file. This has to be running for the testing to be run against this API point;

- **mocha:** runs the Mocha testing at src/test/main.test.ts;

- **build:** builds the app for production;

- **build-with-docs:** builds the app for production, with docs;

- **build-docs:** builds the docs.


## Service Scripts

These aren't meant to be run directly, but a documentation hasn't harmed anybody so far:

- **service:build-lib:** launch the Webpack production processing of the library;

- **service:build:** builds the library and the quick test for development;

- **service:watch:quick-test:server:** nodemons the execution of 00-quick-test.js;

- **service:watch:mocha:server:** nodemons the execution of mocha.js;

- **service:watch:main:server:** nodemons the execution of the entry API main.js.
