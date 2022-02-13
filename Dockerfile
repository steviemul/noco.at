FROM node:14

WORKDIR /noco.at

ADD package.json /noco.at/package.json
RUN npm install

ADD scripts /noco.at/scripts
ADD .babelrc /noco.at/.babelrc

ADD .private /noco.at/.private
ADD server.js /noco.at/server.js
ADD webpack.config.js /noco.at/webpack.config.js
ADD app /noco.at/app

RUN npm run build

RUN npm install --production

CMD ["npm", "run", "start"]
