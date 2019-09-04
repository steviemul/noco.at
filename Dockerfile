FROM node:12

WORKDIR /noco.at

ADD app /noco.at/app
ADD .babelrc /noco.at/.babelrc
ADD package.json /noco.at/package.json
ADD server.js /noco.at/server.js
ADD webpack.config.js /noco.at/webpack.config.js

RUN cd /noco.at
RUN npm install && npm run build

CMD ["npm", "run", "start"]
