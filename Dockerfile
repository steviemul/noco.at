FROM node:14

WORKDIR /noco.at

ADD package.json /noco.at/package.json
RUN npm install

ADD scripts /noco.at/scripts
ADD .babelrc /noco.at/.babelrc

ADD server.js /noco.at/server.js
ADD webpack.config.js /noco.at/webpack.config.js

ADD app /noco.at/app

RUN node /noco.at/scripts/gen_wp_keys.js

ADD security/gen-cert.sh /noco.at/.private/gen-cert.sh
ADD security/req.cnf /noco.at/.private/req.cnf

WORKDIR /noco.at/.private

RUN ./gen-cert.sh

WORKDIR /noco.at

RUN npm run build

RUN npm install --production

CMD ["npm", "run", "start"]
