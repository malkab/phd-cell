**docker-run-interactive.sh** will launch a Docker container with a configured dev environment. Check npm targets at source's **package.json**, being the most usual one **npm start** to launch a watching Webpack dev server.

**docker-run-interactive.sh** must be launched with a parameter that sets up the debub port, like this:

```Shell
docker-run-interactive.sh 9000
```

