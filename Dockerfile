FROM node:14-alpine AS build-stage

WORKDIR /usr/src/app

COPY tsconfig.json tsconfig.json
COPY package*.json ./
RUN npm ci

COPY src/ src/
COPY typings/ typings/
RUN npm run build
RUN npm prune --production



FROM node:14-alpine AS production

ENV NODE_ENV=production
ENV appPath=/usr/src/app

RUN apk add curl

WORKDIR $appPath

COPY --from=build-stage $appPath/node_modules ./node_modules
COPY --from=build-stage $appPath/dist ./dist

USER node

# RUN du -sh * | sort -n -r
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=10s --start-period=10s CMD curl --fail --silent "http://localhost:8080/health" || exit 1
ENTRYPOINT ["node", "--require", "dotenv/config", "--require", "source-map-support/register", "dist/index.js"]