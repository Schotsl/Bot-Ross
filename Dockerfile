FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .

RUN bun install

FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
