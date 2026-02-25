# VPS Deployment Guide for Ubuntu Server

This guide will help you deploy Monkeys 3DPrints to your Ubuntu VPS.

## Prerequisites

- Ubuntu Server 20.04+ installed
- Root or sudo access
- Domain pointed to your VPS IP
- Basic terminal knowledge

## Step 1: Initial Server Setup

### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install certbot for SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Step 2: PostgreSQL Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE monkeys3dprints;
CREATE USER monkeys3dprints_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE monkeys3dprints TO monkeys3dprints_user;
\q
```

## Step 3: Upload Your Project

### Option A: Using Git (Recommended)
```bash
# Install git if not already installed
sudo apt install git -y

# Clone your repository
cd /var/www
sudo git clone <your-repo-url> monkeys3dprints
cd monkeys3dprints

# Set proper ownership
sudo chown -R $USER:$USER /var/www/monkeys3dprints
```

### Option B: Using SCP
```bash
# From your local machine:
scp -r monkeys3dprints/ user@your-server-ip:/var/www/
```

## Step 4: Install Dependencies & Configure

```bash
cd /var/www/monkeys3dprints

# Install dependencies
npm install

# Create .env file
nano .env
```

Add your environment variables (see .env.example):
```env
DATABASE_URL="postgresql://monkeys3dprints_user:your_secure_password@localhost:5432/monkeys3dprints"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
# ... etc
```

```bash
# Set up database
npx prisma generate
npx prisma migrate deploy

# Create uploads directories
mkdir -p public/uploads/{quotes,products,gallery}
chmod 755 public/uploads public/uploads/*

# Build the application
npm run build
```

## Step 5: Set Up PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start npm --name "monkeys3dprints" -- start

# Configure PM2 to start on boot
pm2 startup systemd
# Follow the command it outputs

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

### Useful PM2 Commands
```bash
pm2 logs monkeys3dprints     # View logs
pm2 restart monkeys3dprints  # Restart app
pm2 stop monkeys3dprints     # Stop app
pm2 delete monkeys3dprints   # Remove app
```

## Step 6: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/monkeys3dprints
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name monkeys3dprints.co.uk www.monkeys3dprints.co.uk;

    # Max upload size for 3D files
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/monkeys3dprints /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d monkeys3dprints.co.uk -d www.monkeys3dprints.co.uk
```

Follow the prompts. Certbot will automatically configure HTTPS and set up auto-renewal.

Test auto-renewal:
```bash
sudo certbot renew --dry-run
```

## Step 8: Set Up Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Step 9: Create First Admin User

```bash
cd /var/www/monkeys3dprints
npx prisma studio
```

This opens a GUI at http://localhost:5555. Create a User record:
- Email: your-email@example.com
- Password: Use bcrypt to hash: `node -e "console.log(require('bcrypt').hashSync('your_password', 10))"`
- Name: Your Name
- Role: ADMIN

## Step 10: Monitoring & Logs

### View application logs
```bash
pm2 logs monkeys3dprints
```

### View Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor server resources
```bash
pm2 monit
```

## Maintenance

### Update the application
```bash
cd /var/www/monkeys3dprints
git pull  # If using git
npm install
npm run build
pm2 restart monkeys3dprints
```

### Database backup
```bash
# Create backup
pg_dump -U monkeys3dprints_user monkeys3dprints > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U monkeys3dprints_user monkeys3dprints < backup_20240101.sql
```

### Files backup
```bash
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

## Performance Optimization

### Enable Nginx Gzip compression
Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
```

### Set up log rotation
Logs are automatically rotated by PM2 and Nginx.

## Troubleshooting

### App won't start
```bash
pm2 logs monkeys3dprints
# Check for errors in the output
```

### Database connection errors
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL in .env
- Test connection: `psql -U monkeys3dprints_user monkeys3dprints`

### 502 Bad Gateway
- Check if app is running: `pm2 status`
- Check Nginx config: `sudo nginx -t`
- Review logs: `pm2 logs monkeys3dprints`

### File upload fails
- Check directory permissions: `ls -la public/uploads`
- Verify client_max_body_size in Nginx config
- Check disk space: `df -h`

## Security Checklist

- ✅ PostgreSQL only listens on localhost
- ✅ Strong database password
- ✅ Firewall configured (UFW)
- ✅ SSL certificate installed
- ✅ Environment variables secured
- ✅ Regular backups scheduled
- ✅ System updates automated
- ✅ Non-root user for deployment

## Additional Resources

- PM2 Documentation: https://pm2.keymetrics.io/docs
- Nginx Documentation: https://nginx.org/en/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

Need help? Create an issue on the repository or contact support.
