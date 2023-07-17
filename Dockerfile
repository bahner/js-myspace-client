# Use Node.js LTS version as the base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port http-server listens on
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
