# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json .
RUN yarn install
COPY . .
RUN npm run build


# Stage 2: Serve the Angular application with Apache
FROM httpd:2.4

# mengaktifkan .htaccess
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

# ganti build/ dengan path hasil build an angular biasanya di dist/skote (settingan ada di angular.json)
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/
COPY --from=build /app/.htaccess /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80

# Start the Apache server
CMD ["httpd-foreground"]
