FROM node:18.16.0-alpine3.17
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN --mount=target=/app/public,type=bind,source=public
COPY . .
RUN npx tsc
CMD ["npm", "start"]
EXPOSE 8081