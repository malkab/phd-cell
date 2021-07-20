# package.json Scripts

Main targets:

- **start:** runs and watch the main.ts program at src;

- **mocha:** runs the Mocha main tests at src/test;

- **quick-test:** runs and watch the src/test/00-quick-test.ts script for quick testing;

- **build:** builds the distribution main.js program, without docs. Suppose it can even be published with **npm publish**;

- **build-with-docs:** builds the distribution library for NPM publishing, including docs;

- **clean:** clean dev and distributions builds;

- **build-docs:** builds HTML docs;

- **distribute-pack:** packs and distributes the repo to other repos as TGZ for cross-repo development;

- **install-distributed-pack:** install packages distributed as TGZ from other repos in cross-repo development.


## Service Scripts

These aren't meant to be run directly, but a documentation hasn't harmed anybody so far:

- **service:build-main:** launch the Webpack production processing of the main program;

- **service:build:** builds dev versions of all tests, quick tests, and main program for development;

- **service:watch:main:server:** nodemons the execution of main.js. If the CLI run of the main program needs command line argument, they can be provided by adding them to this target;

- **service:watch:quick-test:server:** nodemons the execution of 00-quick-test.js;

- **service:watch:mocha:server:** nodemons the execution of mocha.js.
