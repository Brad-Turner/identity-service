FROM node:14-alpine AS build-stage

WORKDIR /usr/src/app

COPY tsconfig.json tsconfig.json
COPY package*.json ./
RUN npm ci

COPY src/ src/
RUN npm run build
RUN npm prune --production



FROM node:14-alpine AS production

ENV appPath=/usr/src/app

WORKDIR $appPath

COPY --from=build-stage $appPath/node_modules ./node_modules
COPY --from=build-stage $appPath/dist ./dist

# RUN du -sh * | sort -n -r
EXPOSE 8080
ENTRYPOINT [ "node", "-r", "dotenv/config", "dist/index.js" ]