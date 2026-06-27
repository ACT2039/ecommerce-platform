import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with pristine data...');

  // 1. Create Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, and premium tech.' },
    { name: 'Men\'s Fashion', slug: 'mens-fashion', description: 'Shirts, jackets, and accessories.' },
    { name: 'Women\'s Fashion', slug: 'womens-fashion', description: 'Dresses, shoes, and luxury bags.' },
    { name: 'Home & Living', slug: 'home-living', description: 'Furniture, decor, and smart home.' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for active lifestyles.' },
    { name: 'Beauty & Personal Care', slug: 'beauty', description: 'Skincare, fragrances, and grooming.' }
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    createdCategories.push(createdCat);
  }
  
  const [
    electronicsId, 
    mensFashionId, 
    womensFashionId, 
    homeLivingId, 
    sportsId, 
    beautyId
  ] = createdCategories.map(c => c.id);

  // 2. Create Products
  const products = [
    // Electronics
    {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      description: 'Industry leading noise cancellation-two processors control 8 microphones for unprecedented noise cancellation.',
      price: 348.00,
      compareAtPrice: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
      categoryId: electronicsId,
      quantity: 50
    },
    {
      title: 'Premium Smartwatch Series X',
      description: 'Advanced health monitoring, cellular connectivity, and a bright always-on OLED display.',
      price: 499.00,
      compareAtPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
      categoryId: electronicsId,
      quantity: 15
    },
    // Men's Fashion
    {
      title: 'Classic White Sneakers',
      description: 'Minimalist low-top sneakers crafted from premium Italian leather. Perfect for everyday wear.',
      price: 89.00,
      compareAtPrice: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      categoryId: mensFashionId,
      quantity: 45
    },
    {
      title: 'Premium Leather Biker Jacket',
      description: 'Genuine full-grain leather motorcycle jacket. Features heavy-duty zippers.',
      price: 249.50,
      compareAtPrice: 350.00,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      categoryId: mensFashionId,
      quantity: 8
    },
    {
      title: 'Casual Oxford Shirt',
      description: 'A versatile button-down shirt made from breathable cotton. Great for casual and smart-casual occasions.',
      price: 45.00,
      compareAtPrice: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1000&auto=format&fit=crop',
      categoryId: mensFashionId,
      quantity: 60
    },
    {
      title: 'Graphic Print T-Shirt',
      description: 'Comfortable everyday graphic t-shirt made of 100% organic cotton.',
      price: 25.00,
      compareAtPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
      categoryId: mensFashionId,
      quantity: 120
    },
    {
      title: 'Slim Fit Denim Jeans',
      description: 'Classic slim fit denim jeans with a slight stretch for all-day comfort.',
      price: 65.00,
      compareAtPrice: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
      categoryId: mensFashionId,
      quantity: 85
    },
    // Women's Fashion
    {
      title: 'Elegant Silk Evening Gown',
      description: 'Floor-length silk dress with a delicate slit and sweetheart neckline.',
      price: 495.00,
      compareAtPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1566162200446-5f50a8d67288?q=80&w=1000&auto=format&fit=crop',
      categoryId: womensFashionId,
      quantity: 5
    },
    {
      title: 'Designer Leather Tote Bag',
      description: 'Spacious everyday tote bag made from vegan leather. Includes matching inner pouch.',
      price: 115.00,
      compareAtPrice: 150.00,
      imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop',
      categoryId: womensFashionId,
      quantity: 30
    },
    // Home & Living
    {
      title: 'Mid-Century Modern Lounge Chair',
      description: 'Iconic design featuring a molded plywood shell and premium leather upholstery.',
      price: 650.00,
      compareAtPrice: 899.00,
      imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop',
      categoryId: homeLivingId,
      quantity: 12
    },
    {
      title: 'Ceramic Table Lamp',
      description: 'Handcrafted ceramic base with a linen shade. Provides warm, ambient lighting.',
      price: 65.00,
      compareAtPrice: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
      categoryId: homeLivingId,
      quantity: 35
    },
    // Sports
    {
      title: 'Professional Yoga Mat',
      description: 'Eco-friendly, non-slip yoga mat with alignment lines. 5mm thickness for optimal joint support.',
      price: 45.00,
      compareAtPrice: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1000&auto=format&fit=crop',
      categoryId: sportsId,
      quantity: 50
    },
    {
      title: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbells. Change weights from 5 to 52.5 lbs with a simple turn of a dial.',
      price: 199.99,
      compareAtPrice: 250.00,
      imageUrl: 'https://images.unsplash.com/photo-1638202577490-621f3f4e3c15?q=80&w=1000&auto=format&fit=crop',
      categoryId: sportsId,
      quantity: 10
    },
    // Beauty
    {
      title: 'Luxury Facial Serum',
      description: 'Anti-aging hyaluronic acid serum infused with Vitamin C and botanical extracts for glowing skin.',
      price: 85.00,
      compareAtPrice: 110.00,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
      categoryId: beautyId,
      quantity: 60
    },
    {
      title: 'Signature Eau de Parfum',
      description: 'A sophisticated fragrance featuring notes of bergamot, jasmine, and warm sandalwood.',
      price: 125.00,
      compareAtPrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
      categoryId: beautyId,
      quantity: 25
    },
    // 36 additional concrete products for a total of 50
    { title: 'Apple MacBook Pro 16"', description: 'M3 Max chip, 36GB RAM, 1TB SSD. The ultimate pro laptop.', price: 3499.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 20 },
    { title: 'Samsung Galaxy S24 Ultra', description: 'Titanium frame, 200MP camera, Snapdragon 8 Gen 3.', price: 1299.99, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 45 },
    { title: 'Sony PlayStation 5', description: 'Next-gen gaming console with DualSense controller.', price: 499.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 15 },
    { title: 'Nintendo Switch OLED', description: 'Vibrant 7-inch OLED screen, versatile gaming.', price: 349.99, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 30 },
    { title: 'Apple iPhone 15 Pro', description: 'A17 Pro chip, Titanium design, advanced camera.', price: 999.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 40 },
    { title: 'Dell XPS 15 Laptop', description: 'InfinityEdge display, Intel Core i9, premium build.', price: 1899.00, compareAtPrice: 2099.00, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 25 },
    { title: 'Bose QuietComfort Earbuds', description: 'World-class noise cancelling earbuds.', price: 279.00, compareAtPrice: 299.00, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 60 },
    { title: 'iPad Pro 12.9"', description: 'Liquid Retina XDR display, M2 chip.', price: 1099.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop', categoryId: electronicsId, quantity: 25 },
    
    // Men's Fashion
    { title: 'Men\'s Classic Trench Coat', description: 'Water-resistant, timeless beige trench coat.', price: 150.00, compareAtPrice: 199.00, imageUrl: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1000&auto=format&fit=crop', categoryId: mensFashionId, quantity: 30 },
    { title: 'Men\'s Cashmere Sweater', description: '100% pure cashmere, ultra-soft and warm.', price: 120.00, compareAtPrice: 160.00, imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1000&auto=format&fit=crop', categoryId: mensFashionId, quantity: 40 },
    { title: 'Men\'s Leather Chelsea Boots', description: 'Premium suede leather, slip-on style.', price: 110.00, compareAtPrice: 140.00, imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop', categoryId: mensFashionId, quantity: 20 },
    { title: 'Men\'s Aviator Sunglasses', description: 'Polarized lenses, lightweight metal frame.', price: 45.00, compareAtPrice: 65.00, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop', categoryId: mensFashionId, quantity: 80 },
    { title: 'Men\'s Running Shorts', description: 'Breathable, moisture-wicking athletic shorts.', price: 35.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1563604084532-628d022fa9a7?q=80&w=1000&auto=format&fit=crop', categoryId: mensFashionId, quantity: 100 },
    
    // Women's Fashion
    { title: 'Women\'s Floral Summer Dress', description: 'Lightweight, flowy midi dress with floral pattern.', price: 65.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop', categoryId: womensFashionId, quantity: 50 },
    { title: 'Women\'s Leather Crossbody Bag', description: 'Compact and stylish genuine leather bag.', price: 85.00, compareAtPrice: 120.00, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop', categoryId: womensFashionId, quantity: 35 },
    { title: 'Women\'s High-Waist Skinny Jeans', description: 'Stretch denim that flatters every curve.', price: 55.00, compareAtPrice: 75.00, imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop', categoryId: womensFashionId, quantity: 60 },
    { title: 'Women\'s Cashmere Scarf', description: 'Cozy and luxurious, perfect for winter.', price: 45.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1600859546221-69bb0d97fdfb?q=80&w=1000&auto=format&fit=crop', categoryId: womensFashionId, quantity: 45 },
    { title: 'Women\'s Ankle Boots', description: 'Sleek leather boots with a comfortable block heel.', price: 95.00, compareAtPrice: 130.00, imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', categoryId: womensFashionId, quantity: 25 },

    // Home & Living
    { title: 'Modern Leather Sofa', description: 'Minimalist 3-seater sofa with premium Italian leather.', price: 1299.00, compareAtPrice: 1599.00, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 5 },
    { title: 'Ergonomic Office Chair', description: 'Adjustable lumbar support and breathable mesh.', price: 299.00, compareAtPrice: 350.00, imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 40 },
    { title: 'Solid Wood Dining Table', description: 'Handcrafted oak dining table for 6 people.', price: 799.00, compareAtPrice: 999.00, imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 8 },
    { title: 'Geometric Area Rug', description: 'Soft, easy-to-clean rug with a modern geometric design.', price: 150.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1596041697680-5b1eb11b7dfd?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 30 },
    { title: 'Smart LED Bulb Set', description: 'Wi-Fi enabled color-changing smart bulbs.', price: 45.00, compareAtPrice: 60.00, imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 80 },
    { title: 'Minimalist Wall Clock', description: 'Silent sweep movement, sleek metallic finish.', price: 35.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1000&auto=format&fit=crop', categoryId: homeLivingId, quantity: 50 },

    // Sports & Outdoors
    { title: 'Mountain Bike 29"', description: 'Lightweight aluminum frame, 21-speed gears.', price: 450.00, compareAtPrice: 550.00, imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1000&auto=format&fit=crop', categoryId: sportsId, quantity: 15 },
    { title: 'Camping Tent (4-Person)', description: 'Waterproof, easy-setup tent for family camping.', price: 120.00, compareAtPrice: 150.00, imageUrl: 'https://images.unsplash.com/photo-1504280390224-345391d17d09?q=80&w=1000&auto=format&fit=crop', categoryId: sportsId, quantity: 20 },
    { title: 'Stainless Steel Water Bottle', description: 'Insulated bottle keeps drinks cold for 24 hours.', price: 25.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop', categoryId: sportsId, quantity: 150 },
    { title: 'Tennis Racket Pro', description: 'Carbon fiber frame for maximum power and control.', price: 180.00, compareAtPrice: 220.00, imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop', categoryId: sportsId, quantity: 25 },
    { title: 'Hiking Backpack 50L', description: 'Durable, water-resistant pack with lumbar support.', price: 85.00, compareAtPrice: 110.00, imageUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1000&auto=format&fit=crop', categoryId: sportsId, quantity: 40 },

    // Beauty & Personal Care
    { title: 'Vitamin C Brightening Serum', description: 'Evens skin tone and reduces dark spots.', price: 35.00, compareAtPrice: 45.00, imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 60 },
    { title: 'Organic Daily Moisturizer', description: 'Deep hydration with natural aloe and shea butter.', price: 28.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 80 },
    { title: 'Matte Lipstick Set', description: 'Set of 5 long-lasting, smudge-proof matte lipsticks.', price: 45.00, compareAtPrice: 60.00, imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 50 },
    { title: 'Electric Sonic Toothbrush', description: 'Rechargeable, 5 brushing modes, 2-minute timer.', price: 75.00, compareAtPrice: 99.00, imageUrl: 'https://images.unsplash.com/photo-1588145826500-2fb322ba6db5?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 45 },
    { title: 'Beard Grooming Kit', description: 'Includes oil, balm, brush, and scissors for men.', price: 38.00, compareAtPrice: 50.00, imageUrl: 'https://images.unsplash.com/photo-1621607512281-a1859ba8b8f2?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 35 },
    { title: 'Aromatherapy Essential Oils', description: 'Set of 6 pure therapeutic grade oils.', price: 22.00, compareAtPrice: 30.00, imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 100 },
    { title: 'Hair Styling Clay', description: 'Strong hold, matte finish for textured hairstyles.', price: 18.00, compareAtPrice: null, imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1000&auto=format&fit=crop', categoryId: beautyId, quantity: 70 }
  ];

  // Delete all existing products and related images/inventory to prevent duplicates
  await prisma.productImage.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.product.deleteMany({});

  for (const p of products) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Create new product
    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku: 'SKU-' + uuidv4().substring(0, 8).toUpperCase(),
        images: {
          create: {
            url: p.imageUrl,
            altText: p.title
          }
        },
        inventory: {
          create: {
            quantity: p.quantity,
            sku: 'SKU-' + uuidv4().substring(0, 8).toUpperCase(),
          }
        },
        categories: {
          create: {
            categoryId: p.categoryId
          }
        }
      }
    });
    console.log(`Created product: ${product.title}`);
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
