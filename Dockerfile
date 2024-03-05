# syntax=docker/dockerfile:1
FROM node:16-alpine3.14
LABEL maintainer="La Chouquette"
LABEL description="Single Page Application"
LABEL version="1.0"

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# To fix issu gyp cannot find python
RUN apk add --no-cache --virtual .builds-deps build-base python3

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn
RUN npm rebuild node-sass

# Set env variables.
# NODE_ENV, GRAPHQL_URI and BROWSER_GRAPHQL_URI cannot be set at runtime because they are used while building (nuxt.config.js)
ENV NODE_ENV production
ENV DISABLE_SENTY false
ENV NUXT_VERSION 2.15.7
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

# Bundle app source
COPY . .

# Build and clean
RUN yarn build --standalone
RUN rm -rf node_modules
# install packages needed at runtime
RUN yarn add "nuxt-start@${NUXT_VERSION}"
# need vuetify for uat
RUN yarn add @nuxtjs/vuetify
RUN yarn cache clean

EXPOSE $NUXT_PORT
CMD ["npx", "nuxt-start"]
