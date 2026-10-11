# Multi-stage Docker build for Trade OPS MCP Server
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm ci --only=dev

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy build artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -S tradeops && adduser -S tradeops -G tradeops
USER tradeops

# Expose ports
EXPOSE 8787 8788

# Set environment
ENV MCP_TRANSPORT=http
ENV NODE_ENV=production
ENV MCP_HTTP_HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8787/health', (r) => {if (r.statusCode!==200) throw new Error(r.statusCode)})"

# Start
CMD ["node", "dist/index.js"]
