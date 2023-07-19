# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory in the builder stage
WORKDIR /home/nodeUser/app

# Create a directory for logs
RUN mkdir logs

# Copy package files to the builder stage
COPY package*.json ./

# Install project dependencies based on locked versions
RUN npm ci

# Copy the remaining project files to the builder stage
COPY . .

# Build the application
RUN npm run build

# Specify the command to run tests
CMD ["npm", "run", "test"]
