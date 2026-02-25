# Quick Start Guide

Get your Monkeys 3DPrints website running in 10 minutes!

## Prerequisites

✅ Node.js 18+ installed
✅ PostgreSQL installed and running
✅ A text editor (VS Code, Sublime, etc.)

## Installation Steps

### 1. Install Dependencies (2 minutes)

```bash
npm install
```

### 2. Set Up Environment (2 minutes)

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```bash
nano .env  # or use any text editor
```

Minimum required:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/monkeys3dprints"
JWT_SECRET="change-this-to-a-random-string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Set Up Database (3 minutes)

```bash
# Create the database (if it doesn't exist)
createdb monkeys3dprints

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

**Important**: The seed creates an admin user:
- Email: `admin@monkeys3dprints.co.uk`
- Password: `admin123`
- ⚠️ **Change this password immediately after first login!**

### 4. Start Development Server (1 minute)

```bash
npm run dev
```

Visit: http://localhost:3000

## What's Included

After seeding, you'll have:
- ✅ 3 product categories
- ✅ 3 sample products
- ✅ 1 blog post
- ✅ Admin user account

## Next Steps

1. **Login to Admin Panel**: http://localhost:3000/admin
2. **Change Admin Password**: Create a new admin user and delete the default one
3. **Add Your Products**: Go to Admin > Products
4. **Upload Photos**: Add product images and gallery photos
5. **Customize Content**: Edit the about page, homepage, etc.

## Common Issues

### "Cannot connect to database"
- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Check your DATABASE_URL in `.env`
- Verify database exists: `psql -l`

### "Port 3000 already in use"
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use a different port: `PORT=3001 npm run dev`

### "Module not found"
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Project Structure

```
monkeys3dprints/
├── app/              # Pages and routes
│   ├── admin/        # Admin panel
│   ├── shop/         # Product shop
│   ├── quote/        # 3D quote system
│   └── ...
├── components/       # Reusable components
├── lib/             # Utilities
├── prisma/          # Database schema
└── public/          # Static files
```

## Key Files to Know

- `app/page.tsx` - Homepage
- `app/layout.tsx` - Global navigation and footer
- `prisma/schema.prisma` - Database structure
- `.env` - Configuration (keep this secret!)

## Development Tips

### View Database
```bash
npx prisma studio
```
Opens a GUI at http://localhost:5555

### Check Logs
All errors appear in your terminal where you ran `npm run dev`

### Hot Reload
Changes to code automatically reload the page

## Ready for Production?

See `DEPLOYMENT.md` for complete VPS deployment instructions.

## Get Help

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for production setup
- Look at example code in `app/` directory

---

**Need help?** Open an issue or contact support.

Happy building! 🚀
