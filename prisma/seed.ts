import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../node_modules/.prisma/client'
import bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`
if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({ adapter})

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@monkeys3dprints.co.uk' },
    update: {},
    create: {
      email: 'admin@monkeys3dprints.co.uk',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log('✅ Ensured admin user:', admin.email)
  console.log('   Default password: admin123 (CHANGE THIS!)')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: '3d-prints' },
      update: {
        name: '3D Prints',
        description: 'Pre-designed 3D printed items ready to purchase',
      },
      create: {
        name: '3D Prints',
        slug: '3d-prints',
        description: 'Pre-designed 3D printed items ready to purchase',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'film-photography' },
      update: {
        name: 'Film Photography',
        description: 'Film processing and photography services',
      },
      create: {
        name: 'Film Photography',
        slug: 'film-photography',
        description: 'Film processing and photography services',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {
        name: 'Accessories',
        description: '3D printer accessories and tools',
      },
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: '3D printer accessories and tools',
      },
    }),
  ])
  console.log('✅ Ensured categories:', categories.length)

  const cat3d = categories.find(c => c.slug === '3d-prints')
  const catFilm = categories.find(c => c.slug === 'film-photography')

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'replacement-hinge' },
      update: {},
      create: {
        name: 'Replacement Hinge',
        slug: 'replacement-hinge',
        description: 'Custom 3D printed replacement hinge for various applications. Durable PLA material.',
        price: 5.99,
        stock: 10,
        images: [],
        categoryId: categories[0].id,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'e3-film-development' },
      update: {},
      create: {
        name: 'E3 Film Development Service',
        slug: 'e3-film-development',
        description: 'Professional E3 Ektachrome film development service. Hand-processed with care.',
        price: 15.00,
        stock: 999, // Service, not physical stock
        images: [],
        categoryId: categories[1].id,
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cable-clip-set' },
      update: {},
      create: {
        name: 'Cable Clip Set',
        slug: 'cable-clip-set',
        description: 'Set of 10 3D printed cable management clips. Various sizes included.',
        price: 3.99,
        stock: 25,
        images: [],
        categoryId: categories[0].id,
        isActive: true,
      },
    }),
  ])
  console.log('✅ Ensured sample products:', products.length)

  // Create a sample blog post
  const post = await prisma.post.upsert({
    where: { slug: 'getting-started-with-3d-printing' },
    update: {},
    create: {
      title: 'Getting Started with 3D Printing',
      slug: 'getting-started-with-3d-printing',
      content: `
# Getting Started with 3D Printing

3D printing has become more accessible than ever. Here's what you need to know to get started.

## Choosing Your First Printer

When selecting your first 3D printer, consider:

- **Budget**: Entry-level printers start around £200
- **Print Volume**: How large do your prints need to be?
- **Material**: Most beginners start with PLA
- **Assembly**: Pre-assembled vs DIY kits

## Essential Skills

Learning to 3D print involves:

1. 3D modeling or finding existing models
2. Slicing software to prepare prints
3. Basic printer maintenance
4. Understanding material properties

## Common Applications

- Replacement parts
- Custom organizers
- Prototypes
- Art and decorations
- Functional tools

Ready to start your 3D printing journey? [Get a quote](/quote) for your first custom print!
      `,
      excerpt: 'A beginner\'s guide to getting started with 3D printing, covering equipment selection and essential skills.',
      category: 'tutorial',
      isPublished: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ Ensured sample blog post:', post.title)

  console.log('🎉 Database seeded successfully!')
  console.log('📝 Next steps:')
  console.log('1. Login to admin panel with: admin@monkeys3dprints.co.uk / admin123')
  console.log('2. CHANGE THE ADMIN PASSWORD IMMEDIATELY')
  console.log('3. Add product images')
  console.log('4. Customize content to match your brand')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
