FROM node:alpine As development

WORKDIR /app

COPY package*.json ./
RUN npm config set registry http://registry.npmjs.org
RUN npm install

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org
RUN npm install --only=production

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/auth/main"]