FROM node:24-alpine

WORKDIR /app

# Copy package.json and package-lock.json to improve caching
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .
RUN rm encrypt.sh

COPY encrypt.sh /usr/local/bin/encrypt
RUN chmod +x /usr/local/bin/encrypt

# Run the Node.js application
CMD ["encrypt"]
