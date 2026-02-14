# Use exact Node version
FROM node:22.17.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Build your project (if you have a build script)
RUN npm run build

# Start your app
CMD ["npm", "start"]
