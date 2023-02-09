FROM node:17.7.2-alpine

WORKDIR /test-back-end
ADD package.json /test-back-end/package.json
RUN npm config set registry http://registry.npmjs.org
RUN npm install

ADD . /test-back-end

EXPOSE 3000

CMD ["npm", "run", "start"]
