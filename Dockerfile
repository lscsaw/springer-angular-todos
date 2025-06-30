FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:alpine3.18-slim AS base
LABEL org.opencontainers.image.source=https://github.com/dafnik/angular-todos
COPY --from=build /app/dist/angular-todos/browser /var/www/angular-todos
COPY ./public /var/www/public
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

