This folder contains everything needed to roll out a new release Docker images and push them to GitLab. Procedure:

- configure the build by copying the env.configure file to a new **env** file and editing it;

- take care to have an active token at GitLab, because it can easily close access when unauthorized attemps are too many in a row;

- just run **rollout.sh**.

