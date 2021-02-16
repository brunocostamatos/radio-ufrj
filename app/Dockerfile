FROM node:alpine AS build

WORKDIR /build

COPY . .

RUN npm i && npm run build

FROM nginx:1-alpine

EXPOSE 80

WORKDIR /var/www/html

COPY --from=build /build/build .

COPY --from=build /build/nginx.conf /etc/nginx/conf.d/default.conf

LABEL traefik.enable=true
LABEL traefik.http.routers.radio_web.rule Host(`radio.ufrj.br`) || Host(`www.radio.ufrj.br`)
LABEL traefik.http.routers.radio_web.entrypoints=http,https
LABEL traefik.http.routers.radio_web.service=radio_web_srv
LABEL traefik.http.services.radio_web_srv.loadbalancer.server.port=80
LABEL traefik.http.routers.radio_web.tls.certresolver=httpchallenge