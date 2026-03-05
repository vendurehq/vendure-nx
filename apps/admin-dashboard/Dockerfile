FROM node:22-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Accept build arguments
ARG API_PUBLIC_URL
ARG API_PUBLIC_PORT

# Set them as environment variables for the build
ENV API_PUBLIC_URL=$API_PUBLIC_URL
ENV API_PUBLIC_PORT=$API_PUBLIC_PORT

# build
RUN cd apps/admin-dashboard && npx vite build

FROM nginx:alpine AS runner

# Copy built files to nginx html directory
COPY --from=build-stage /app/dist/apps/admin-dashboard /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle SPA routing - fallback to index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Optional: Add caching headers for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80
