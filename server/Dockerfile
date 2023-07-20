# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory in the builder stage
WORKDIR /home/nodeUser/app

# Copy package files to the builder stage
COPY package*.json ./

# Install project dependencies based on locked versions
RUN npm ci

# Copy the remaining project files to the builder stage
COPY . .

# Build the application
RUN npm run build
RUN npm run minify

# Stage 2: Create the final image
FROM node:16-alpine

# Set working directory in the final image
WORKDIR /home/nodeUser/app

# Copy the built application from the builder stage to the final image
COPY --from=builder /home/nodeUser/app/dist ./dist

# Copy package files from the builder stage to the final image
COPY --from=builder /home/nodeUser/app/package*.json ./

ENV NODE_ENV="production"

# Create a directory for logs
RUN mkdir ./logs

# Remove unnecessary test files from the final image
RUN rm -rf ./dist/test

# Install only production dependencies in the final image
RUN npm ci --omit=dev

# Add a new user named nodeUser in the final image
RUN adduser -D nodeUser

# Change ownership of the /home/nodeUser directory and its contents to the nodeUser user
RUN chown -R nodeUser:nodeUser /home/nodeUser

# Switch to the nodeUser user
USER nodeUser

# Specify the default command to start the application
CMD ["npm", "run", "start"]
