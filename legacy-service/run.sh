#!/bin/sh

if [[ -z "${DEBUG_PORT}" ]]; then
    pm2-runtime --raw ./process.yml --env $NODE_ENV
else
    npm run debug
fi
