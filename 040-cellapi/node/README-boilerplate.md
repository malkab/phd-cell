# Design Cheatsheet

Some guidelines:

- create always a **separate module or class for the API logic**. Leave the **main.ts** file for routing stuff and for initialization. Use it to initialize any object in the API logic module that powers the API functionality.
