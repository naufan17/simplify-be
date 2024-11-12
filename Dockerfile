# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="NestJS"

# NestJS app lives here
WORKDIR /dist

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Install Nest CLI globally for build
RUN npm install --global @nestjs/cli

# Build application
RUN npm run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /dist /dist

# Start the server by default, this can be overwritten at runtime
EXPOSE 8000
CMD [ "npm", "run", "start:prod" ]