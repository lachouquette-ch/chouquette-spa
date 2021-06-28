# syntax=docker/dockerfile:1
FROM node:14.17.1
LABEL maintainer="La Chouquette"
LABEL description="Single Page Application"
LABEL version="1.0"

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# Set env variables.
# NODE_ENV, GRAPHQL_URI and BROWSER_GRAPHQL_URI cannot be set at runtime because they are used while building (nuxt.config.js)
ENV NODE_ENV production
ENV GRAPHQL_URI http://api-gateway.default.svc.cluster.local:4000/graphql
ENV BROWSER_GRAPHQL_URI https://api-gateway.lachouquette.ch/graphql
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

# Bundle app source
COPY . .

# Build and clean
RUN yarn build
RUN yarn cache clean

EXPOSE $NUXT_PORT
CMD yarn start
