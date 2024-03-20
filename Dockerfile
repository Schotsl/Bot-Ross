ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk update && apk add --no-cache \
    curl \
    bash \
    build-base \
    libstdc++

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
