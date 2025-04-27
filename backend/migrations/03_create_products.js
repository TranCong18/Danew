const mongoose = require('mongoose');

module.exports = {
  up: async () => {
    // Xóa dữ liệu cũ
    await mongoose.model('Product').deleteMany({});
    await mongoose.model('Size').deleteMany({});
    await mongoose.model('Color').deleteMany({});
    await mongoose.model('ProductVariant').deleteMany({});

    // Tạo collection products
    await mongoose.model('Product').createCollection();
    
    // Tạo các index cho products
    await mongoose.model('Product').collection.createIndexes([
      { key: { name: 1 } },
      { key: { brand: 1 } },
      { key: { category: 1 } },
      { key: { gender: 1 } }
    ]);

    const now = new Date();

    // Tạo collection sizes với dữ liệu mẫu
    await mongoose.model('Size').createCollection();
    await mongoose.model('Size').insertMany([
      { name: '36', createdAt: now, updatedAt: now },
      { name: '37', createdAt: now, updatedAt: now },
      { name: '38', createdAt: now, updatedAt: now },
      { name: '39', createdAt: now, updatedAt: now },
      { name: '40', createdAt: now, updatedAt: now },
      { name: '41', createdAt: now, updatedAt: now },
      { name: '42', createdAt: now, updatedAt: now },
      { name: '43', createdAt: now, updatedAt: now },
      { name: '44', createdAt: now, updatedAt: now }
    ]);

    // Tạo collection colors với dữ liệu mẫu
    await mongoose.model('Color').createCollection();
    await mongoose.model('Color').insertMany([
      { name: 'Đen', createdAt: now, updatedAt: now },
      { name: 'Trắng', createdAt: now, updatedAt: now },
      { name: 'Đỏ', createdAt: now, updatedAt: now },
      { name: 'Xanh dương', createdAt: now, updatedAt: now },
      { name: 'Xanh lá', createdAt: now, updatedAt: now },
      { name: 'Vàng', createdAt: now, updatedAt: now },
      { name: 'Xám', createdAt: now, updatedAt: now }
    ]);

    // Tạo collection product variants
    await mongoose.model('ProductVariant').createCollection();
    await mongoose.model('ProductVariant').collection.createIndexes([
      { key: { product_id: 1 } },
      { key: { size_id: 1 } },
      { key: { color_id: 1 } }
    ]);
  },

  down: async () => {
    await mongoose.model('Product').collection.drop();
    await mongoose.model('Size').collection.drop();
    await mongoose.model('Color').collection.drop();
    await mongoose.model('ProductVariant').collection.drop();
  }
};