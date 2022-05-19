FROM node:16-alpine

WORKDIR /usr/app

ADD ./ ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]