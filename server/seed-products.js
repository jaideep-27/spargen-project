const mongoose = require('mongoose');
const Product = require('./src/models/product.model');
require('dotenv').config();

const products = [
  {
    name: "Diamond Eternity Ring",
    description: "Beautiful diamond eternity ring featuring 15 round brilliant cut diamonds set in 18k white gold. Perfect for anniversaries or as an elegant everyday piece.",
    price: 2499.99,
    salePrice: 1999.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=3270&auto=format&fit=crop",
        altText: "Diamond Eternity Ring"
      }
    ],
    category: "ring",
    metal: "white gold",
    gemstone: "diamond",
    weight: 4.5,
    dimensions: {
      length: 20,
      width: 20,
      height: 3
    },
    stockQuantity: 10,
    features: ["18k white gold", "15 round brilliant diamonds", "Total carat weight: 1.5ct", "Clarity: VS1", "Color: G"],
    careInstructions: "Clean with mild soap and water. Store in a jewelry box when not wearing.",
    warrantyInfo: "Lifetime warranty against manufacturing defects.",
    tags: ["diamond", "eternity", "ring", "anniversary", "wedding"],
    rating: {
      average: 4.8,
      count: 45
    }
  },
  {
    name: "Sapphire and Diamond Pendant",
    description: "Elegant pendant featuring a 2ct oval blue sapphire surrounded by a halo of round diamonds, on an 18k white gold chain.",
    price: 1899.99,
    salePrice: 1599.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=3087&auto=format&fit=crop",
        altText: "Sapphire and Diamond Pendant"
      }
    ],
    category: "necklace",
    metal: "white gold",
    gemstone: "sapphire",
    weight: 5.2,
    dimensions: {
      length: 42,
      width: 15,
      height: 8
    },
    stockQuantity: 5,
    features: ["2ct oval blue sapphire", "0.5ct total diamond weight", "18k white gold chain", "Adjustable length: 16-18 inches"],
    careInstructions: "Avoid contact with harsh chemicals. Clean with a soft jewelry cloth.",
    warrantyInfo: "1-year warranty against manufacturing defects.",
    tags: ["sapphire", "pendant", "necklace", "diamond", "gift"],
    rating: {
      average: 4.9,
      count: 32
    }
  },
  {
    name: "Rose Gold Pearl Earrings",
    description: "Delicate freshwater pearl drop earrings set in rose gold. These versatile earrings add elegance to any outfit, day or night.",
    price: 499.99,
    salePrice: 399.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=3270&auto=format&fit=crop",
        altText: "Rose Gold Pearl Earrings"
      }
    ],
    category: "earring",
    metal: "rose gold",
    gemstone: "pearl",
    weight: 3.0,
    dimensions: {
      length: 30,
      width: 10,
      height: 10
    },
    stockQuantity: 15,
    features: ["14k rose gold", "8mm freshwater pearls", "Comfort-fit posts", "Butterfly backs"],
    careInstructions: "Wipe with a soft cloth after wearing. Store in a cool, dry place.",
    warrantyInfo: "6-month warranty against manufacturing defects.",
    tags: ["pearl", "earrings", "rose gold", "elegant", "gift for her"],
    rating: {
      average: 4.7,
      count: 28
    }
  },
  {
    name: "Emerald Tennis Bracelet",
    description: "Stunning tennis bracelet featuring 25 emerald-cut emeralds set in 18k yellow gold with secure box clasp and safety catch.",
    price: 3599.99,
    salePrice: 2999.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=3270&auto=format&fit=crop",
        altText: "Emerald Tennis Bracelet"
      }
    ],
    category: "bracelet",
    metal: "gold",
    gemstone: "emerald",
    weight: 12.5,
    dimensions: {
      length: 180,
      width: 5,
      height: 4
    },
    stockQuantity: 3,
    features: ["18k yellow gold", "25 emerald-cut natural emeralds", "Total emerald weight: 5ct", "Box clasp with safety catch", "7 inches long"],
    careInstructions: "Avoid exposure to harsh chemicals. Clean with a soft brush and mild soap.",
    warrantyInfo: "2-year warranty and complimentary annual cleaning service.",
    tags: ["emerald", "bracelet", "tennis bracelet", "luxury", "statement piece"],
    rating: {
      average: 4.9,
      count: 15
    }
  },
  {
    name: "Vintage Ruby Cocktail Ring",
    description: "Statement cocktail ring featuring a 3ct oval ruby surrounded by a double halo of diamonds, set in platinum with milgrain detailing.",
    price: 2799.99,
    salePrice: 2399.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=3270&auto=format&fit=crop",
        altText: "Vintage Ruby Cocktail Ring"
      }
    ],
    category: "ring",
    metal: "platinum",
    gemstone: "ruby",
    weight: 7.8,
    dimensions: {
      length: 22,
      width: 20,
      height: 12
    },
    stockQuantity: 2,
    features: ["Platinum setting", "3ct oval natural ruby", "0.75ct total diamond weight", "Vintage-inspired milgrain detailing", "Size 7 (resizable)"],
    careInstructions: "Clean with mild soap and water. Avoid ultrasonic cleaners.",
    warrantyInfo: "Lifetime warranty against manufacturing defects.",
    tags: ["ruby", "cocktail ring", "vintage", "statement", "platinum"],
    rating: {
      average: 4.8,
      count: 23
    }
  },
  {
    name: "Diamond Stud Earrings",
    description: "Classic diamond stud earrings featuring round brilliant cut diamonds in a four-prong setting of 14k white gold.",
    price: 999.99,
    salePrice: 849.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=3270&auto=format&fit=crop",
        altText: "Diamond Stud Earrings"
      }
    ],
    category: "earring",
    metal: "white gold",
    gemstone: "diamond",
    weight: 1.5,
    dimensions: {
      length: 6,
      width: 6,
      height: 6
    },
    stockQuantity: 20,
    features: ["14k white gold", "Round brilliant cut diamonds", "Total carat weight: 1.0ct", "Clarity: VS2", "Color: H", "Screw back for security"],
    careInstructions: "Clean regularly with jewelry cleaner solution. Store in a jewelry box.",
    warrantyInfo: "Lifetime warranty against manufacturing defects.",
    tags: ["diamond", "studs", "earrings", "classic", "gift"],
    rating: {
      average: 4.9,
      count: 56
    }
  },
  {
    name: "Gold Chain Necklace",
    description: "Classic 18k gold chain necklace with a modern twist. Versatile piece that can be worn alone or layered with other necklaces.",
    price: 1299.99,
    salePrice: 999.99,
    onSale: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=3087&auto=format&fit=crop",
        altText: "Gold Chain Necklace"
      }
    ],
    category: "necklace",
    metal: "gold",
    gemstone: "none",
    weight: 15.0,
    dimensions: {
      length: 500,
      width: 3,
      height: 3
    },
    stockQuantity: 8,
    features: ["18k gold", "Adjustable length: 18-20 inches", "Lobster clasp", "2.5mm width"],
    careInstructions: "Clean with a polishing cloth. Store in a jewelry box.",
    warrantyInfo: "Lifetime warranty against manufacturing defects.",
    tags: ["gold", "chain", "necklace", "classic", "layering"],
    rating: {
      average: 4.7,
      count: 38
    }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Delete existing products
    await Product.deleteMany();
    console.log('Existing products deleted');
    
    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts(); 