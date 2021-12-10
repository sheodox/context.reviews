mkdir -p config/dev-certs/

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout config/dev-certs/nginx-selfsigned.key -out config/dev-certs/nginx-selfsigned.crt \
	-subj '/CN=dev.context.reviews'


