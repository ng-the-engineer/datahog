FROM node:12-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn

# Copy app source
COPY . /usr/src/app/

# 
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Compile app sources
RUN yarn build

# Expose port and CMD
EXPOSE 3200
CMD [ "yarn", "start" ]