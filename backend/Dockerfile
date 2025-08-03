# Use the Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/profzera-app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Expose the port your application listens on (e.g., 3000 for a web server)
EXPOSE 3000

# Define the command to run your application when the container starts
CMD ["npm", "run", "dev"]