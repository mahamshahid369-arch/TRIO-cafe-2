# ── Stage: Node.js Backend ────────────────────────────────────────────────────
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend source code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
