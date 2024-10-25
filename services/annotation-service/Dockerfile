FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "start"]
