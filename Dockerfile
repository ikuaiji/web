FROM node:14.14.0-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html
