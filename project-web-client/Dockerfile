# Stage 1: Build our application
# Use official Node runtime Docker Image to build ours on top of
FROM node:18 as builder

# Set the current working directory of our image to /app
WORKDIR /app

# Copy Packages needed onto our Docker image
COPY package*.json ./

# Install the dependencies we need from the package.json file
RUN npm install

# Copy source directory onto our image
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy build app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the listening port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]