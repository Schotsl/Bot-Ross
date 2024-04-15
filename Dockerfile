FROM oven/bun:alpine

ENV HTTP_PROXY "https://127.0.0.1"
ENV HTTPS_PROXY "http://35.185.196.38:3128"

ENV NO_PROXY "localhost,127.0.0.1"

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
