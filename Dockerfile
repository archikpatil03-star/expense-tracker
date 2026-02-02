FROM node:20

WORKDIR /app

COPY client ./client

WORKDIR /app/client

RUN npm install
RUN npm run build

RUN npm install -g serve

EXPOSE 10000

CMD ["sh", "-c", "serve -s dist -l $PORT"]
