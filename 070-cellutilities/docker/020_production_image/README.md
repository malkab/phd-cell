# Production Image Builds

To build the production image for the API, follow these steps:

- test first the API, Controller, and Worker builds with **yarn build** at the dev container;

- configure **SunnSaaS version** at **mlkcontext/common**. Also, check that passwords at context secrets matches the ones of the persistence Docker images;

- activate **production_image** context;

- check for a **GitLab full API token**;

- refresh production images with **005** or refresh one of them by checking in its folder;

- go to SWARMS section.
