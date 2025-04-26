const mongoose = require('mongoose');

module.exports = {
  up: async () => {
    // Xóa dữ liệu cũ trước khi tạo mới
    await mongoose.model('Brand').deleteMany({});
    await mongoose.model('Category').deleteMany({});

    // Tạo collection brands
    await mongoose.model('Brand').createCollection();
    await mongoose.model('Brand').collection.createIndex({ name: 1 }, { unique: true });

    // Tạo collection categories
    await mongoose.model('Category').createCollection();
    await mongoose.model('Category').collection.createIndex({ name: 1 }, { unique: true });

    // Thêm dữ liệu mẫu cho brands
    await mongoose.model('Brand').insertMany([
      { name: 'Nike' },
      { name: 'Adidas' },
      { name: 'Puma' },
      { name: 'Converse' }
    ]);

    // Thêm dữ liệu mẫu cho categories
    await mongoose.model('Category').insertMany([
      { name: 'Giày thể thao', image: '/images/categories/sports.jpg' },
      { name: 'Giày chạy bộ', image: '/images/categories/running.jpg' },
      { name: 'Giày đi bộ', image: '/images/categories/walking.jpg' },
      { name: 'Giày thời trang', image: '/images/categories/fashion.jpg' }
    ]);
  },

  down: async () => {
    await mongoose.model('Brand').collection.drop();
    await mongoose.model('Category').collection.drop();
  }
};