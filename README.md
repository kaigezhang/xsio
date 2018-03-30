This is the codebase for xs

# 生产环境需要改的地方有

* docker-compose.yml **nginx ports 8888:80** 
* nginx_proxy/nginx_proxy.conf **server server_name api.linkick.com**;
* backend/config/backend_nginx.config **server_name api.* api.linkick.com**
* frontend/frontend_nginx.config **server_name linkick.com**