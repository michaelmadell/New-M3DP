# Monkeys 3DPrints - Modern Website

A modern, fast Next.js website for Monkeys 3DPrints, replacing the old WordPress installation.

## Features

### Public-Facing Features
- **Homepage** - Services showcase, featured products, portfolio gallery
- **Shop** - Browse products by category with Stripe checkout
- **Custom Quote System** - Upload 3D files (STL, OBJ, 3MF, STEP) with real-time 3D preview
- **Photography Gallery** - Separate sections for digital and film photography
- **Blog/Reviews** - Content management for reviews and articles
- **Contact Forms** - Easy communication with customers

### Admin Panel
- **Dashboard** - Overview of orders, quotes, products
- **Product Management** - Add, edit, delete products with stock management
- **Order Management** - View and process customer orders
- **Quote Management** - Review 3D print quote requests with file downloads
- **Blog Management** - Create and publish blog posts/reviews
- **Gallery Management** - Upload and organize photography

### Technical Features
- **Fast Performance** - Built with Next.js 14+ and optimized for speed
- **3D File Preview** - Real-time rendering using Three.js
- **Stripe Integration** - Secure payment processing
- **Email Notifications** - Automatic notifications for quotes and orders
- **PostgreSQL Database** - Robust data storage with Prisma ORM
- **TypeScript** - Type-safe development
- **Responsive Design** - Mobile-friendly with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **3D Rendering**: Three.js, React Three Fiber
- **Email**: Nodemailer
- **Authentication**: JWT (for admin)

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Stripe account (for payments)
- SMTP credentials (for email notifications)

## Installation

### 1. Clone or extract the project

```bash
cd monkeys3dprints
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/monkeys3dprints"

# Stripe - Get these from https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email - Use Gmail or another SMTP provider
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@monkeys3dprints.co.uk"

# JWT Secret - Generate a random string
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Create uploads directory

```bash
mkdir -p public/uploads/quotes
mkdir -p public/uploads/products
mkdir -p public/uploads/gallery
```

### 6. Run the development server

```bash
npm run dev
```

Visit http://localhost:3000 to see your site!

## Database Schema

The database includes these main tables:

- **User** - Admin users
- **Category** - Product categories (3D Prints, Film Photography, etc.)
- **Product** - Products for sale
- **Order** & **OrderItem** - Customer orders
- **Quote** - Custom 3D print quote requests
- **Post** - Blog posts and reviews
- **GalleryImage** - Photography portfolio

See `prisma/schema.prisma` for the complete schema.

## Usage

### Admin Panel

Access the admin panel at http://localhost:3000/admin

**Default Admin Setup:**
Since there's no admin user yet, you'll need to create one directly in the database:

```bash
npx prisma studio
```

This opens a GUI where you can manually create a User record. Hash the password first using bcrypt.

### Adding Products

1. Go to Admin > Categories
2. Create categories (e.g., "3D Prints", "Film Photography")
3. Go to Admin > Products
4. Add products with images, prices, stock levels

### Managing Quotes

1. Customers upload 3D files via the quote form
2. Files are saved to `public/uploads/quotes/`
3. View and manage quotes in Admin > Quotes
4. Send quotes via email (manual process for now)

### Processing Orders

1. Orders are automatically created when customers checkout via Stripe
2. View orders in Admin > Orders
3. Update status as you process them

### Blog & Reviews

1. Create posts in Admin > Blog
2. Write in Markdown or HTML
3. Publish when ready

## Deployment to Your VPS

### Option 1: PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "monkeys3dprints" -- start

# Save PM2 config
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

### Option 2: Using a Reverse Proxy (Nginx)

1. Build the app: `npm run build`
2. Start: `npm start` (runs on port 3000)
3. Configure Nginx to proxy to localhost:3000

Example Nginx config:

```nginx
server {
    listen 80;
    server_name monkeys3dprints.co.uk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
sudo certbot --nginx -d monkeys3dprints.co.uk
```

## Migrating from WordPress

### Content Migration

1. **Products**: Export from WordPress, import into PostgreSQL
2. **Images**: Copy from WordPress uploads to `public/uploads/`
3. **Blog Posts**: Export content, import into Post table
4. **Update image URLs** in content to new paths

### Backup WordPress Data First!

```bash
# Database backup
mysqldump -u root -p wordpress_db > wordpress_backup.sql

# Files backup
tar -czf wordpress_uploads.tar.gz wp-content/uploads/
```

## Customization

### Styling

Edit colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',  // Change this
      secondary: '#64748b', // And this
    },
  },
}
```

### Adding New Pages

1. Create `app/pagename/page.tsx`
2. Add link to navigation in `app/layout.tsx`

### Stripe Webhooks

For production, set up Stripe webhooks:

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.failed`
4. Copy webhook secret to `.env`

## Troubleshooting

### Database Connection Errors

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists: `createdb monkeys3dprints`

### File Upload Issues

- Check directory permissions: `chmod 755 public/uploads`
- Verify MAX_FILE_SIZE in `.env`

### 3D Preview Not Working

- Ensure files are under 10MB
- Check browser console for errors
- Try different file format (STL works best)

### Email Not Sending

- For Gmail, use an "App Password" not your regular password
- Enable "Less secure app access" if needed
- Check SMTP credentials

## Project Structure

```
monkeys3dprints/
├── app/                  # Next.js pages and API routes
│   ├── admin/           # Admin panel pages
│   ├── api/             # API endpoints
│   ├── shop/            # Shop pages
│   ├── quote/           # Quote request page
│   ├── gallery/         # Photography gallery
│   └── ...
├── components/          # Reusable React components
├── lib/                 # Utility functions
├── prisma/              # Database schema
│   └── schema.prisma
├── public/              # Static files
│   └── uploads/         # User uploads
└── ...
```

## Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Database Indexing**: Already configured in Prisma schema
3. **Caching**: Enable Redis for production if needed
4. **CDN**: Use Cloudflare or similar for static assets

## Security Notes

- Change JWT_SECRET to a strong random string
- Use strong database passwords
- Enable HTTPS in production
- Set up CORS properly
- Regularly update dependencies: `npm audit fix`

## Future Enhancements

Consider adding:
- Advanced product search and filtering
- Customer accounts and order history
- Automated quote calculator
- Inventory alerts
- Analytics dashboard
- Multi-currency support
- Social media integration

## Support

For issues or questions:
- Check the GitHub issues
- Review Next.js documentation: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs

## License

Private - All Rights Reserved

---

Built with ❤️ for Monkeys 3DPrints
