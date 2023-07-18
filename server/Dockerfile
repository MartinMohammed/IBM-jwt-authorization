FROM node:16-alpine

RUN adduser -D nodeUser
WORKDIR /home/nodeUser/app

# Create a seperate dir for logs
RUN mkdir logs


# Every command afterwards as well as interactive sessions will be executed as user nodeUser
COPY ./package*.json ./
RUN npm ci

COPY .env .

RUN chown -R nodeUser:nodeUser /home/nodeUser

USER nodeUser

COPY ./ ./

CMD ["npm", "run", "dev"]
