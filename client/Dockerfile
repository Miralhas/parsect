FROM node:24-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ARG VITE_PARSECT_URL

ENV VITE_PARSECT_URL=${VITE_PARSECT_URL}

RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview"]