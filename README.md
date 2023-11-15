<h1 align="center">Alicenet Explorer Frontend</h1>

## Running and developing the application

The explorer is forked from [Blockscout](https://github.com/blockscout/frontend/pkgs/container/frontend)

Please see included environment file for AliceNet included in `/configs/envs/.env.remotealice`

For local development use: `yarn` and then `yarn dev`

For deploying, an image can be built and served as a container using docker

### Building docker image

A deployable build can be made with:

`docker build -t alicenet-explorer-ui .`

Note that `yarn build` must pass or a docker build *will* fail.

### Running from built image

After buidling the image it can be ran:

```docker run -p 3000:3000 --env-file ./configs/envs/.env.remotealice alicenet-explorer-ui```

## License

[![License: GPL v3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
