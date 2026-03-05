# Build stage
FROM node:22 AS build-stage
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npx nx build admin-dashboard --skip-nx-cache --verbose && npx nx build server --skip-nx-cache --verbose

# Production stage
FROM node:22-slim AS production-stage

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build-stage /app/dist/apps/server ./dist/apps/server
COPY --from=build-stage /app/dist/apps/admin-dashboard ./dist/apps/admin-dashboard
COPY --from=build-stage /app/dist/migrations ./dist/migrations

# Install wget for health checks
RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

# Install runtime dependencies - npm used here due to package nesting issues
# when using yarn
RUN cd dist/apps/server && npm install --omit=dev && npm cache clean --force

WORKDIR dist/apps/server

COPY static ./static

# Extend path to get access to node_modules/.bin scripts
ENV PATH=/app/apps/server/node_modules/.bin:$PATH

# Expose the application port
EXPOSE 3000
# Start the application with Sentry instrumentation
# CMD node --import @vendure/sentry-plugin/instrument ./main.js
CMD node ./main.js
