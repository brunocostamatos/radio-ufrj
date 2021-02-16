FROM node:alpine AS build

ENV IS_TEST_MODE=true
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm i -g prisma 

WORKDIR /build

COPY . .

RUN npm i \
    && prisma generate \
    && npx nexus-prisma-generate --output ./src/generated/nexus-prisma \
    && npx ts-node -T index.ts \
    && echo "import { Context } from '../context'" >> ./src/generated/nexus.ts \
    && npx tsc \
    && mv package*.json lib/ \
    && mv *.gql lib/ \
    && mv prisma.yml lib/


FROM node:alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV PRISMA_URL http://orm:4466
ENV NODE_ENV=production

RUN apk add --no-cache tini

EXPOSE 4000

WORKDIR /api

COPY --from=build /home/node/.npm-global /home/node/.npm-global
COPY --from=build /build/lib ./

RUN npm install --production

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "/api/index.js"]

LABEL traefik.enable=true
LABEL traefik.http.routers.radio_api.rule Host(`api.radio.ufrj.br`) || Host(`www.api.radio.ufrj.br`)
LABEL traefik.http.routers.radio_api.entrypoints=http,https
LABEL traefik.http.routers.radio_api.service=radio_api_srv
LABEL traefik.http.services.radio_api_srv.loadbalancer.server.port=4000
LABEL traefik.http.routers.radio_api.tls.certresolver=httpchallenge