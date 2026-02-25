# Monkeys 3DPrints - Local Development Setup

## 🎨 Design Overview

Your new site features a **Technical-Analog** aesthetic that bridges digital fabrication with analog craftsmanship:

- **Dark theme** with technical grid patterns
- **Dual color scheme**: Cyan (digital/3D printing) + Amber (analog/film photography)
- **Custom fonts**: Space Mono (monospace) + Syne (display)
- **Distinctive animations** and hover effects
- **Asymmetric layouts** to avoid generic AI aesthetics

## 📋 Prerequisites

Before you start, ensure you have:

1. **Node.js 18+** installed
2. **PostgreSQL** database (we'll set this up)
3. **Git** (optional, for version control)

## 🚀 Quick Start

### Step 1: Navigate to Project Directory

```bash
cd /home/claude/monkeys3dprints
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your actual values. For local development, here's a minimal config:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/monkeys3dprints"

# Stripe - Get from https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Email - Use Gmail or your SMTP provider
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@monkeys3dprints.co.uk"

# JWT Secret - Generate a random string
JWT_SECRET="generate-a-random-secret-string-here"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./public/uploads"
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

If you have PostgreSQL installed:

```bash
# Create the database
createdb monkeys3dprints

# Or using psql
psql -U postgres
CREATE DATABASE monkeys3dprints;
\q
```

#### Option B: Docker PostgreSQL (Easiest)

```bash
docker run --name monkeys-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=monkeys3dprints \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL would be:
# DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/monkeys3dprints"
```

### Step 4: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

# Run database migrations
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate dev --name init
```

If you get network errors with Prisma, that's okay for development - the schema is already set up.

### Step 5: Create Upload Directories

```bash
mkdir -p public/uploads/quotes
mkdir -p public/uploads/products
mkdir -p public/uploads/gallery
mkdir -p public/uploads/blog
```

### Step 6: (Optional) Seed Database with Sample Data

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db seed
```

This will create:
- Sample categories
- Sample products
- Admin user (you'll need to set password manually)

### Step 7: Run the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see your site! 🎉

## 🎨 What You'll See

### Homepage
- Bold hero section with asymmetric layout
- Technical grid background effect
- Dual-themed service cards (Digital/Analog)
- Masonry-style portfolio preview
- Distinctive buttons with glow effects

### Navigation
- Sticky header with technical aesthetic
- M3D logo with hover effects
- Clean, uppercase links

### Color Scheme
- **Digital Cyan** (`#00FFE5`) - For 3D printing/technical elements
- **Analog Amber** (`#FF6B35`) - For film photography/creative elements
- **Tech Slate** (`#1A1D29`) - Dark backgrounds
- **Grid Gray** (`#2D3142`) - Borders and subtle elements

## 🔧 Next Steps

### 1. Set Up Stripe (For Payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your Test API keys
3. Add to `.env` file
4. Test checkout will work in development mode

### 2. Configure Email (For Quote Notifications)

For Gmail:
1. Go to Google Account Settings
2. Enable 2-factor authentication
3. Generate an "App Password"
4. Use that password in `SMTP_PASSWORD`

### 3. Create Admin User

Currently, you need to create an admin user manually:

```bash
# Open Prisma Studio
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
1. Click on "User" table
2. Add a new user
3. For password, you'll need to hash it first (use bcrypt)

Or use this Node.js snippet:

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = bcrypt.hashSync('your-password', 10);
console.log(hashedPassword);
```

## 📁 Project Structure

```
monkeys3dprints/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage (NEW DESIGN! ✨)
│   ├── layout.tsx           # Root layout (UPDATED! ✨)
│   ├── globals.css          # Global styles (REDESIGNED! ✨)
│   ├── shop/                # Shop pages
│   ├── quote/               # Quote request with 3D viewer
│   ├── gallery/             # Photography gallery
│   ├── blog/                # Blog & reviews
│   ├── admin/               # Admin panel
│   └── api/                 # API routes
├── components/              # Reusable React components
├── lib/                     # Utilities
├── prisma/                  # Database schema
├── public/                  # Static assets
│   └── uploads/            # User-uploaded files
└── ...
```

## 🎯 Key Features Implemented

### ✅ Distinctive Design
- Technical-analog aesthetic
- Custom color scheme and typography
- No generic blue gradients!
- Smooth animations and micro-interactions

### ✅ Core Functionality
- Product catalog with categories
- Shopping cart (Stripe integration ready)
- 3D file upload with Three.js preview
- Photography gallery (digital/film sections)
- Blog/review system
- Admin panel for content management

### 🚧 To Be Implemented
- Shop page styling update
- Quote page 3D viewer enhancement
- Gallery page layout
- Blog listing page
- Admin dashboard improvements

## 🐛 Troubleshooting

### "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -l | grep monkeys3dprints`

### "Module not found" errors
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

### "Prisma generate failed"
- Use the environment variable: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`
- Or skip Prisma for now - the schema is already set up

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Styles not loading
- Clear browser cache
- Check `app/globals.css` is being imported in `app/layout.tsx`
- Restart dev server

## 🎨 Customizing the Design

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --digital-cyan: #00FFE5;    /* Change this for digital theme */
  --analog-amber: #FF6B35;    /* Change this for analog theme */
  --tech-slate: #1A1D29;      /* Dark background */
}
```

### Change Fonts

Edit the Google Fonts import in `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

Then update:
```css
body {
  font-family: 'Your Font', monospace;
}
```

### Disable Animations

Remove or comment out the `animate-fade-in` classes in `app/page.tsx`.

## 📝 Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** to files
3. **Hot reload** happens automatically
4. **View changes** at http://localhost:3000

## 🚀 When You're Ready to Deploy

See `DEPLOYMENT.md` for production deployment to your VPS.

Quick summary:
1. Build: `npm run build`
2. Start: `npm start`
3. Use PM2 or systemd for process management
4. Set up Nginx reverse proxy
5. Add SSL with Let's Encrypt

## 💡 Tips

- **Design philosophy**: Bold, distinctive, technical yet warm
- **Performance**: Next.js handles optimization automatically
- **SEO**: Meta tags are in `app/layout.tsx`
- **Images**: Use Next.js `<Image>` component for optimization

## 🆘 Need Help?

- Check the main `README.md` for detailed info
- Review Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**Enjoy building your new site!** 🐒🔧📸
