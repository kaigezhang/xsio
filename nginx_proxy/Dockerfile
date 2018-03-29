FROM registry.docker-cn.com/library/ubuntu:16.04

# Set the file maintainer (your name - the file's author)
MAINTAINER Kaige zhang

# Install Nginx.	
RUN rm /etc/apt/sources.list
COPY sources.list /etc/apt/
RUN apt-get update && apt-get install -y nginx

# Turn off daemon mode
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# Copy nginx config
COPY nginx_proxy.conf /etc/nginx/sites-enabled/default
     		
# Define default command.
CMD ["nginx"]

# Expose ports.
EXPOSE 80
       

		
