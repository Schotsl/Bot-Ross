ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk update && apk add --no-cache \
    nodejs \
    npm
RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 3000

CMD ["node", "index.js"]
