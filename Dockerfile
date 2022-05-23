# Build image
FROM node:16-alpine AS BUILD_IMAGE

## install curl to fetch node-prune
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
## install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

WORKDIR /usr/app

ADD ./ ./

RUN npm install
RUN npm run build

# ## Cleanup and size optimization
RUN npm prune --production --workspaces
RUN npm prune --production
RUN /usr/local/bin/node-prune ./server/node_modules
RUN /usr/local/bin/node-prune ./node_modules

# Runtime image
FROM node:16-alpine

WORKDIR /usr/app

## Copy runtime build files
COPY --from=BUILD_IMAGE /usr/app/server/dist /usr/app/server/dist
COPY --from=BUILD_IMAGE /usr/app/server/node_modules /usr/app/server/node_modules
COPY --from=BUILD_IMAGE /usr/app/web/dist /usr/app/web/dist
COPY --from=BUILD_IMAGE /usr/app/node_modules /usr/app/node_modules
EXPOSE 3000

CMD [ "node", "./server/dist/server/src/main.js", "--port=3000" ]