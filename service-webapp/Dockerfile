FROM openresty/openresty:alpine
COPY build /var/www
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
RUN mkdir -p /var/log/nginx
ENV GATEWAY_URI=http://service-gateway:8000
EXPOSE 80
ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx","-c", "/etc/nginx/nginx.conf","-g", "daemon off;"]