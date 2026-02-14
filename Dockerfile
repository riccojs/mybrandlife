# Use exact Node version
FROM node:22.17.0

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 4000

# Start app with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
