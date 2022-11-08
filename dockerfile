FROM node:18.5.0

RUN apt-get update -y
RUN apt-get install python3.10 -y
RUN apt-get install python3-bs4 -y
RUN apt-get install python3-requests -y
RUN apt-get install python3-lxml -y
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "start"]

