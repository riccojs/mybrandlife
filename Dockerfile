# Stage 1 — Build
FROM node:22.17.0 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev (for building)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Stage 2 — Production image
FROM node:22.17.0

WORKDIR /app

# Copy only package files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose your app port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
