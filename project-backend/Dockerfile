# Stage 1: Build stage
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "run", "serve" ]