FROM alpine:latest

WORKDIR /app

COPY . .

# Install WireGuard, other necessary tools and Bun
RUN apk add --no-cache wireguard-tools iptables
RUN apk add --no-cache curl bash && \
  curl https://bun.sh/install | bash && \
  bun install

EXPOSE 3000

CMD wg-quick up /app/wireguard.conf && bun run index.ts
