# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

################################################################################
# Pick a base image to serve as the foundation for the other build stages in
# this file.
#
# For illustrative purposes, the following FROM command
# is using the alpine image (see https://hub.docker.com/_/alpine).
# By specifying the "latest" tag, it will also use whatever happens to be the
# most recent version of that image when you build your Dockerfile.
# If reproducability is important, consider using a versioned tag
# (e.g., alpine:3.17.2) or SHA (e.g., alpine@sha256:c41ab5c992deb4fe7e5da09f67a8804a46bd0592bfdf0b1847dde0e0889d2bff).
FROM alpine:latest as base


# Create a directory to hold the application code inside the image
WORKDIR /app
# Copy the application code into the image
COPY . .
# Install any dependencies required by the application
RUN yarn install --no-cache nodejs pnpm
# RUN npm install -g pnpm


# Build the application
RUN pnpm install && pnpm run build
# Copy the compiled application into the image
COPY * /app/

EXPOSE 3000
CMD [ "sh", "-c", "source .env && pnpm run build && pnpm start" ]

