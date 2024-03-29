<p align="center">
  <img height="200px" src="./web/public/android-chrome-512x512.png" />
</p>
<h2 style="text-align: center">Find My Anime</h2>
<div style="text-align:center">

[Status](https://status.find-my-anime.dtimur.de) | [API Docs](https://find-my-anime.dtimur.de/api/docs) | [WebApp](https://find-my-anime.dtimur.de)

[![codecov](https://codecov.io/gh/proohit/find-my-anime/branch/master/graph/badge.svg?token=MU0FT78BB5)](https://codecov.io/gh/proohit/find-my-anime)
[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/es3c.svg)](https://status.find-my-anime.dtimur.de)
[![Build](https://github.com/proohit/find-my-anime/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/proohit/find-my-anime/actions/workflows/build.yml)
[![Docker](https://img.shields.io/docker/v/proohit/find-my-anime?logo=docker&logoColor=white)](https://hub.docker.com/r/proohit/find-my-anime)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=proohit_find-my-anime&metric=bugs)](https://sonarcloud.io/summary/new_code?id=proohit_find-my-anime)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=proohit_find-my-anime&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=proohit_find-my-anime)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=proohit_find-my-anime&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=proohit_find-my-anime)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=proohit_find-my-anime&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=proohit_find-my-anime)

</div>

An API first service for searching anime across multiple sites such as Anilist and MyAnimeList. Completely written in Typescript. Provides a backend server in [./server](./server) driven by [anime-offline-database](https://github.com/manami-project/anime-offline-database) and [NestJS](https://nestjs.com/). A proof-of-concept web application is in [./web](./web) and powered by [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) and [Chakra UI](https://chakra-ui.com/).

## Running

You can either run the application via docker or directly from source. See [Configuration](#configuration) for more information.
The easiest way is to use Docker:

```bash
docker run -d -p 3000:3000 proohit/find-my-anime
```

Or to run the whole app without docker in production mode:

```bash
npm install
npm run build
npm start
```

Then you can access the app at http://localhost:3000 or whatever port you configured.

## Configuration

You can provide a .env or .env.dev (for development) file or pass environment variables directly to configure the backend. Currently supported:

```env
port=YOUR_PORT
app_host=YOUR_HOST
MYANIMELIST_API_KEY=YOUR_API_KEY
ANIDB_CLIENT_ID=YOUR_CLIENT_ID
ANIDB_CLIENT_VERSION=YOUR_CLIENT_VERSION
```

For Docker, you can just pass the environment variables to the container.

```bash
docker run -d \
-p 3000:3000 \
-e app_host=YOUR_HOST \
-e MYANIMELIST_API_KEY=YOUR_API_KEY \
-e ANIDB_CLIENT_ID=YOUR_CLIENT_ID \
-e ANIDB_CLIENT_VERSION=YOUR_CLIENT_VERSION \
proohit/find-my-anime
```

The app uses external services such as Anilist and MyAnimeList to further enrich anime data. All the external services are _optional_ and won't be used if no credentials are provided.

### MyAnimeList

To get a client id, register a new app at https://myanimelist.net/apiconfig. After registering, you will find your client id in the edit page of your registered app.

### AniDB

You need to create a project and a client for that project at https://anidb.net/software/add. The ANIDB_CLIENT_ID refers to the **name** of the created **client** (not project!) and the ANIDB_CLIENT_VERSION refers to the version of that client.

## Developing

Start backend server and frontend in development mode:

```bash
npm run start:dev:server
...
```

And in another terminal:

```bash
npm run start:dev:web
...
```

## Contributing

All contributions are welcomed! Beware of the following guidelines:

- All tests in the backend should pass.

  ```bash
  cd server
  npm run test
  ```

- Changes in the backend should be tested. Decreasing coverage is only allowed with a proper reason.
