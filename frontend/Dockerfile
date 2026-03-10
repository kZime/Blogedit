# Build stage (Debian base avoids Rollup optional-deps issue on Alpine/musl ARM64)
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
# Same-origin API in production (reverse proxy will forward /api to backend)
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Runtime: serve with nginx
FROM nginx:alpine
RUN apk add --no-cache curl
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
