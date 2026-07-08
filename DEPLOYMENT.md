# Deployment Guide - Employee Management System

This guide covers deployment scenarios for the EMS application.

## 🚀 Quick Start (Development)

### Using Two Terminals

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 📦 Production Build

### Backend (Laravel)

1. **Environment Configuration:**
```bash
cd backend
cp .env.example .env
```

2. **Update .env for production:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_here
```

3. **Install and Optimize:**
```bash
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan jwt:secret
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

4. **Set Permissions:**
```bash
chmod -R 775 storage bootstrap/cache
```

### Frontend (React)

1. **Update API URL:**

Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

2. **Build for Production:**
```bash
cd frontend
npm install
npm run build
```

The build output will be in `frontend/dist/`

## 🌐 Deployment Options

### Option 1: Shared Hosting

#### Backend (Laravel)
1. Upload Laravel files to public_html or subdirectory
2. Point domain to `public` folder
3. Import database
4. Update .env with production credentials
5. Run artisan commands via SSH or terminal

#### Frontend (React)
1. Build the frontend: `npm run build`
2. Upload contents of `dist/` folder to your hosting
3. Configure web server to serve index.html for all routes

### Option 2: VPS (Ubuntu/Nginx)

#### Backend Setup

1. **Install Dependencies:**
```bash
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl
sudo apt install nginx mysql-server composer
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    root /var/www/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

3. **Deploy Laravel:**
```bash
cd /var/www
git clone your-repo backend
cd backend
composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --force
sudo chown -R www-data:www-data storage bootstrap/cache
```

#### Frontend Setup

1. **Build and Upload:**
```bash
npm run build
scp -r dist/* user@server:/var/www/frontend/
```

2. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/frontend;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Docker

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=db
    depends_on:
      - db
    volumes:
      - ./backend:/var/www

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: ems_db
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Backend Dockerfile:
```dockerfile
FROM php:8.2-fpm
WORKDIR /var/www
COPY . .
RUN composer install --optimize-autoloader --no-dev
RUN php artisan config:cache
CMD php artisan serve --host=0.0.0.0 --port=8000
```

Frontend Dockerfile:
```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Run:
```bash
docker-compose up -d
```

## 🔒 Security Checklist

- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong JWT secret
- [ ] Enable HTTPS with SSL certificate
- [ ] Set proper CORS origins (not `*`)
- [ ] Use environment variables for sensitive data
- [ ] Enable Laravel's rate limiting
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Use secure database credentials
- [ ] Enable CSP headers

## 📊 Performance Optimization

### Backend
- Enable OPcache
- Use queue workers for heavy tasks
- Cache configuration and routes
- Use database indexing
- Enable Laravel's response caching

### Frontend
- Enable Gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images
- Enable browser caching

## 🔍 Monitoring

### Logs Location
- Laravel: `backend/storage/logs/laravel.log`
- Nginx: `/var/log/nginx/error.log`

### Health Check Endpoint
Create `backend/routes/api.php`:
```php
Route::get('/health', function () {
    return response()->json(['status' => 'healthy']);
});
```

## 🆘 Troubleshooting

### 500 Internal Server Error
```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
chmod -R 775 storage bootstrap/cache
```

### CORS Issues
Update `backend/config/cors.php`:
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => true,
```

### Database Connection Failed
- Verify credentials in .env
- Check database server is running
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

### JWT Token Invalid
```bash
php artisan jwt:secret --force
php artisan config:cache
```

## 📱 SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
sudo systemctl reload nginx
```

Auto-renewal:
```bash
sudo certbot renew --dry-run
```

## 🔄 Continuous Deployment

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          ssh user@server "cd /var/www/backend && git pull && composer install --no-dev && php artisan migrate --force && php artisan config:cache"
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          scp -r dist/* user@server:/var/www/frontend/
```

## 📈 Scaling Considerations

- Use load balancer (Nginx/HAProxy)
- Implement Redis for sessions and cache
- Set up database replication
- Use CDN for static assets
- Implement horizontal scaling with multiple app servers

---

**Note**: Always test deployments in a staging environment first!
