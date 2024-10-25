# frontend/Dockerfile
FROM node:14

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy the React app
COPY . .

# Build the React app
RUN npm run build

# Expose the React port
EXPOSE 3000

# Command to run React (for development)
CMD ["npm", "start"]