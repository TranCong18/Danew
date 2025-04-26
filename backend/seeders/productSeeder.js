const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Color = require('../models/Color');
const Size = require('../models/Size');

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối database thành công');

    // Lấy IDs từ các collections liên quan
    const [brands, categories, colors, sizes] = await Promise.all([
      Brand.find(),
      Category.find(),
      Color.find(),
      Size.find()
    ]);

    if (!brands.length || !categories.length) {
      throw new Error('Vui lòng chạy migrations trước khi seed dữ liệu');
    }

    // Helper function để lấy random item từ array
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Tạo danh sách sản phẩm mẫu
    const sampleProducts = [
      {
        name: 'Nike Air Max 2024',
        brand: getRandomItem(brands.filter(b => b.name === 'Nike'))._id,
        category: getRandomItem(categories.filter(c => c.name === 'Giày thể thao'))._id,
        gender: 'male',
        basePrice: 2500000,
        description: 'Giày thể thao Nike Air Max phiên bản 2024 với công nghệ đệm Air mới nhất',
        variants: generateVariants(sizes, colors, 2500000),
        images: [
          'https://example.com/images/nike-air-max-2024-1.jpg',
          'https://example.com/images/nike-air-max-2024-2.jpg'
        ]
      },
      {
        name: 'Adidas Ultraboost Light',
        brand: getRandomItem(brands.filter(b => b.name === 'Adidas'))._id,
        category: getRandomItem(categories.filter(c => c.name === 'Giày chạy bộ'))._id,
        gender: 'unisex',
        basePrice: 3200000,
        description: 'Giày chạy bộ Adidas với công nghệ Ultraboost Light mới nhất',
        variants: generateVariants(sizes, colors, 3200000),
        images: [
          'https://example.com/images/adidas-ultraboost-light-1.jpg',
          'https://example.com/images/adidas-ultraboost-light-2.jpg'
        ]
      },
      {
        name: 'Puma RS-X',
        brand: getRandomItem(brands.filter(b => b.name === 'Puma'))._id,
        category: getRandomItem(categories.filter(c => c.name === 'Giày thể thao'))._id,
        gender: 'unisex',
        basePrice: 2200000,
        description: 'Giày thể thao Puma RS-X với thiết kế retro độc đáo',
        variants: generateVariants(sizes, colors, 2200000),
        images: [
          'https://example.com/images/puma-rsx-1.jpg',
          'https://example.com/images/puma-rsx-2.jpg'
        ]
      },
      {
        name: 'Converse Chuck 70',
        brand: getRandomItem(brands.filter(b => b.name === 'Converse'))._id,
        category: getRandomItem(categories.filter(c => c.name === 'Giày thời trang'))._id,
        gender: 'unisex',
        basePrice: 1800000,
        description: 'Giày Converse Chuck 70 phiên bản cao cấp với chất liệu canvas premium',
        variants: generateVariants(sizes, colors, 1800000),
        images: [
          'https://example.com/images/converse-chuck-70-1.jpg',
          'https://example.com/images/converse-chuck-70-2.jpg'
        ]
      }
    ];

    // Xóa sản phẩm cũ
    await Product.deleteMany({});

    // Thêm sản phẩm mới
    await Product.insertMany(sampleProducts);

    console.log('✅ Seeding products thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi seeding products:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Helper function để tạo variants
function generateVariants(sizes, colors, basePrice) {
  const variants = [];
  const selectedSizes = sizes.slice(0, 5); // Lấy 5 sizes
  const selectedColors = colors.slice(0, 3); // Lấy 3 màu

  selectedSizes.forEach(size => {
    selectedColors.forEach(color => {
      variants.push({
        size: size.name,
        color: color.name,
        stock: Math.floor(Math.random() * 20) + 10, // Random 10-30
        price: basePrice + (Math.random() > 0.5 ? 100000 : 0) // Thêm chút biến động giá
      });
    });
  });

  return variants;
}

seedProducts();