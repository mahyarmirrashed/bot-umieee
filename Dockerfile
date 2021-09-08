FROM node:16
WORKDIR .
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY . .
RUN yarn install
RUN yarn build
CMD yarn start