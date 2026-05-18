# ── Stage: Serve static frontend with Nginx ──────────────────────────────────
FROM nginx:alpine

# Copy the HTML project files into Nginx's default serve directory
COPY . /usr/share/nginx/html

# Custom nginx config to also proxy /api calls to the backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
