FROM node:20.18-alpine AS base_image
LABEL maintainer="Rentickle<build@rentickle.com>"

# Set language and timezone
ENV LANG en_US.utf8
RUN apk update && apk upgrade
RUN apk add ca-certificates && update-ca-certificates
RUN apk add --update tzdata

ENV TZ=Asia/Calcutta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Clean APK cache
RUN rm -rf /var/cache/apk/*

# Set working dir
ENV HOME=/home
ARG SERVICE_DIR=$HOME/app
ARG NPM_TOKEN
WORKDIR $SERVICE_DIR

# Copy package.json, .npmrc, and process files
COPY . .

# Install production dependencies and build app
RUN npm install pm2 -g
RUN npm install --legacy-peer-deps
RUN npm run build

# Set the environment variable for NPM_TOKEN
COPY environment ./environment
ENV NPM_TOKEN=$NPM_TOKEN

# Expose ports
EXPOSE 3000
EXPOSE 9000
