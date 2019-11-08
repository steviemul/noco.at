FROM node:12

WORKDIR /noco.at

ADD package.json /noco.at/package.json
RUN npm install

ADD scripts /noco.at/scripts
ADD .babelrc /noco.at/.babelrc

ADD server.js /noco.at/server.js
ADD webpack.config.js /noco.at/webpack.config.js
ADD app /noco.at/app

RUN npm run build

CMD ["npm", "run", "debug"]
