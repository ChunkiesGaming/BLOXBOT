#!/bin/bash
# Run on the server (as root or with sudo) to fix api.chunkiesgaming.com showing default nginx page.
# Usage: sudo bash nginx-api-setup.sh

set -e

# 1. Disable default site so it doesn't catch api.chunkiesgaming.com
rm -f /etc/nginx/sites-enabled/default

# 2. Create API site config if missing
CONF="/etc/nginx/sites-available/api.chunkiesgaming.com"
if [ ! -f "$CONF" ]; then
  cat > "$CONF" << 'NGINX'
server {
    listen 80;
    server_name api.chunkiesgaming.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
  echo "Created $CONF"
fi

# 3. Enable API site
ln -sf /etc/nginx/sites-available/api.chunkiesgaming.com /etc/nginx/sites-enabled/

# 4. Test and reload
nginx -t
systemctl reload nginx

echo "Done. https://api.chunkiesgaming.com should now proxy to your backend on port 4000."
echo "If you need HTTPS, run: sudo certbot --nginx -d api.chunkiesgaming.com"
