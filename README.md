# 3d-model-ingestion-client

React app written in typescript to ingest new 3D models.<br/>

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).


## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs missing node modules.

### `yarn run confd:prod`

Generates (MUST)

```
public/env-config.js
```

due to env variables or use defaults if not defined.<br />

### `yarn start`

Runs the app in the development mode.<br />
Opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Make sure to build all the dependencies before running this command (mc-react-components)**

Any relative request is proxied to the backend.<br/>
You can control the host by editing the package.json file.

```json
{
  "proxy": "http://localhost:8000"
}
```

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Update configuration inside the docker

In Docker run following in order to propregate ENV vars to clients

```
node ./confd/generate-config.js --environment production --indocker
```

Be sure that it runs from this location /usr/share/nginx/html

## Environment variables used in confd:

UI settings:

- UI display language: CONFIGURATION_UI_LANGUAGE - Available values: ***en, he***

Ingestion services configuration:

- Model:
  - Base Url : CONFIGURATION_MODELS_BASEURL
  - Url: CONFIGURATION_MODELS_URL
- Status:
  - Base Url : CONFIGURATION_JOBS_BASEURL
  - Url: CONFIGURATION_JOBS_URL

Logger settings:

- Log level: CONFIGURATION_LOGGER_LEVEL
- Log to server:
  - Host: CONFIGURATION_LOGGER_HTTP_HOST
  - Port: CONFIGURATION_LOGGER_HTTP_PORT
  - Log path: CONFIGURATION_LOGGER_HTTP_PATH
