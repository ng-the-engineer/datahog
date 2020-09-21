FROM node:12-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn

# Copy app source
COPY . /usr/src/app/

# Expose port and CMD
EXPOSE 3000
CMD [ "yarn", "start" ]

