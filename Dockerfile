# Build stage
FROM node:22-slim AS builder
WORKDIR /app

RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build SvelteKit app
COPY . .
RUN pnpm build

# Strip dev dependencies for production
RUN CI=true pnpm prune --prod

# Runtime with Playwright
FROM mcr.microsoft.com/playwright:v1.57.0-noble
WORKDIR /app

# Copy the built SvelteKit app and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy and setup entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
