FROM node:12-alpine as build

WORKDIR /app

COPY package*.json yarn.lock tsconfig.json .eslint* ./
COPY Source Source/

RUN yarn
RUN yarn build
RUN rm -r node_modules
RUN yarn --prod

FROM node:12-alpine

WORKDIR /app

COPY --from=build /app/Distribution Distribution
COPY --from=build /app/node_modules node_modules

CMD [ "node", "Distribution/index.js"]