FROM node:14.6-alpine3.11

ADD ./jobs-react-app/yarn.lock /yarn.lock
ADD ./jobs-react-app/package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN yarn

WORKDIR /jobs-react-app
ADD ./jobs-react-app/run.sh /jobs-react-app/run.sh

EXPOSE 3000
EXPOSE 35729

ENTRYPOINT ["/bin/sh", "/jobs-react-app/run.sh"]
CMD ["start"]