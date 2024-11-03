FROM node:latest

RUN mkdir /app



WORKDIR /app


# Install dependencies based on the preferred package manager
COPY package.json .

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm start 

