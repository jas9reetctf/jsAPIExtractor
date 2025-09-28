# Dockerfile for Multi-Framework API Extractor

# Use official Node.js LTS image
FROM node:20-slim

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if exists
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all project files
COPY . .

# Create output directory inside container
RUN mkdir -p /usr/src/app/output

# Default command
CMD ["node", "extract-apis.js", "/project"]
