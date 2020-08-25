FROM node:12-alpine as build

WORKDIR /app

COPY tsconfig.json .eslint* ./
COPY aviator.json infrastructures.json ./
COPY Source Source/

RUN yarn
RUN yarn build
RUN rm -r node_modules
RUN rm yarn.lock
RUN yarn --prod

FROM node:12-alpine

WORKDIR /app

COPY --from=build /app/Distribution Distribution
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/aviator.json /app/infrastructures.json ./

CMD [ "node", "Distribution/index.js"]