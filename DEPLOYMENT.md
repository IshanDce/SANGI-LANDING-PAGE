# SANGI Landing Page - VPS Deployment & Hosting Guide

Complete step-by-step instructions to host the SANGI Landing Page and deliver the direct APK download on an Ubuntu/Debian VPS using Nginx and Certbot (Free SSL).

---

## 📋 Quick Setup Overview

1. **Point Domain DNS:** Add an `A` record pointing to your VPS IP.
2. **Install Packages:** `sudo apt update && sudo apt install -y nginx git certbot python3-certbot-nginx`
3. **Clone Repo:** `cd /var/www && sudo git clone https://github.com/IshanDce/SANGI-LANDING-PAGE.git sangi-landing`
4. **Configure Nginx:** Create `/etc/nginx/sites-available/sangi-landing` and enable it.
5. **Get Free SSL:** `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`

---

## 🛠️ Step 1: DNS Configuration
Add these records in your Domain DNS Manager (GoDaddy, Namecheap, Cloudflare, etc.):
- **Type:** `A` | **Host:** `@` | **Value:** `YOUR_VPS_IP`
- **Type:** `A` | **Host:** `www` | **Value:** `YOUR_VPS_IP`

---

## 🛠️ Step 2: VPS Server Setup

```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx, Git, Certbot and Firewall
sudo apt install -y nginx git certbot python3-certbot-nginx ufw

# Configure Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

## 🛠️ Step 3: Clone Project & Set Permissions

```bash
cd /var/www
sudo git clone https://github.com/IshanDce/SANGI-LANDING-PAGE.git sangi-landing

# Set permissions for Nginx user
sudo chown -R www-data:www-data /var/www/sangi-landing
sudo chmod -R 755 /var/www/sangi-landing
```

---

## 🛠️ Step 4: Configure Nginx

Create the virtual host file:
```bash
sudo nano /etc/nginx/sites-available/sangi-landing
```

Paste this configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/sangi-landing;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Frontend Routing
    location / {
        try_files $uri $uri/ =404;
    }

    # High-Speed APK Direct Download (66MB File)
    location /downloads/ {
        alias /var/www/sangi-landing/downloads/;
        types {
            application/vnd.android.package-archive apk;
        }
        default_type application/vnd.android.package-archive;
        add_header Content-Disposition 'attachment; filename="sangi-app.apk"';
        client_max_body_size 100M;
        sendfile on;
        tcp_nopush on;
    }

    # Browser Caching
    location ~* \.(jpg|jpeg|png|gif|ico|svg|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

Enable configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/sangi-landing /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🛠️ Step 5: Install Free SSL Certificate (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the interactive prompts (enter email, agree to terms). Certbot will automatically configure HTTPS redirect.

Test SSL auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 🔄 How to Pull Updates in the Future

When you push updates to GitHub, run this on your VPS:

```bash
cd /var/www/sangi-landing
sudo git pull origin main
sudo chown -R www-data:www-data /var/www/sangi-landing
sudo systemctl reload nginx
```
