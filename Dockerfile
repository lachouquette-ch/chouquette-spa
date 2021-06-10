# syntax=docker/dockerfile:1
FROM node:16.3.0-slim
LABEL maintainer="La Chouquette"
LABEL description="Single Page Application"
LABEL version="1.0"

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Set build variables
ARG env=.env
# Set env variables
ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

# Bundle app source
COPY . .
# override .env with the appropriate file
COPY $env .env
RUN npm run build
RUN yarn cache clean

EXPOSE $NUXT_PORT
CMD npm run start