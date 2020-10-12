# Boilerplate for Webpack-Based, Non-Web Development

This boilerplate configures Webpack to assist in the development of non-web (not front nor backend) applications written in TypeScript.



## Configuration

Install the packages listed in **npm-install**.



## NPM Scripts

This boilerplate configures several NPM scripts:

- **npm start:** starts the main development loop by watching changes in the **src** folder and executing it with **Nodemon**, enabling remote debugging for VS Code with the stack running inside a Docker container. Build is created at the **build** folder, and unfortunately the debugging sessions are run on the bundled file;

- **npm run start:test:** starts the main loop running the **test** script;

- **npm run start:mocha:** starts the main watch loop running the **mocha** script;

- **npm run production:** builds the production final file in the **dist** folder;

- **npm run run-production:** builds and runs the final file in the **dist** folder.

There are some other service targets, **service:watch:build**, **service:watch:main:server**, **service:watch:test:server**, and **service:watch:mocha:server**, that are run in parallel by the **start** scripts in parallel with build to enter the main watch loop.



## Debugging

The development container exports the Node remote debugging port **9229** and maps it to a host port. Both Visual Studio and Chrome Node Debugger can connect to the remote debugger inside the running container.

Debugging can be performed on **start**, **start:test**, and **start:mocha** targets (although the latter is less usual). The **debugger;** line can be inserted at the code point where the debugger should stop and the inspectors connect.

To debug in Visual Studio Code, a **launch.json** entry must be added:

```JSON
{
    "name": "Attach Node - 9007",
    "type": "node",
    "request": "attach",
    "port": 9007,
    "address": "localhost",
    "restart": true,
    "sourceMaps": true,
    "outFiles": [],
    "timeout": 500000
}
```

In **Chrome**, open the inspector with **chrome://inspect**. There, add a new network target to **localhost:port**. Open the **DevTools for Node**.

In VS Code, go to Debug and start the Attach configuration in **launch.json**. Both VS Code and Chrome should attach and stop at the debugger line. It's not fully automatic, so force it by forcing recompiling by making small changes in comments and such. Also, force a Nodemon reload in the terminal by running the **rs** command. Sooner or later, debuggers will attach to the running container, eventually.


