FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy API source
COPY . .

ENV NODE_ENV=production

# Render injects PORT at runtime; this is the local/default exposed port
EXPOSE 3000

CMD ["npm", "start"]
