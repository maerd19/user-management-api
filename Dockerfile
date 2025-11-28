# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from backend
COPY backend/package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm ci && \
    npm cache clean --force

# Copy backend source code
COPY backend/ .

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built files from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy migrations
COPY --from=builder --chown=nodejs:nodejs /app/src/database/migrations ./dist/database/migrations

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application with dumb-init
CMD ["dumb-init", "node", "dist/main"]
