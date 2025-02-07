FROM node:18-alpine

WORKDIR /app
RUN apk update && \
    apk add --no-cache texlive texlive-full

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=5001

CMD ["node", "server.js"]
