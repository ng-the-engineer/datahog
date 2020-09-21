FROM node:12-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn

# Copy app source
COPY . /usr/src/app/

# Compile app sources
RUN yarn build

# Expose port and CMD
EXPOSE 3100
CMD [ "yarn", "start" ]