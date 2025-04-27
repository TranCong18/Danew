const mongoose = require('mongoose');

module.exports = {
  up: async () => {
    // Xóa collections cũ nếu tồn tại
    try {
      await mongoose.model('Cart').collection.drop();
      await mongoose.model('CartItem').collection.drop();
      await mongoose.model('Review').collection.drop();
      await mongoose.model('Voucher').collection.drop();
      await mongoose.model('Comment').collection.drop();
    } catch (error) {
      // Bỏ qua lỗi nếu collection không tồn tại
      if (error.code !== 26) throw error;
    }

    // Tạo collection Cart với index tùy chỉnh
    await mongoose.model('Cart').createCollection();
    await mongoose.model('Cart').collection.createIndex(
      { user: 1 },
      { unique: true, name: 'cart_user_unique' }
    );

    // Tạo collection CartItem với indexes
    await mongoose.model('CartItem').createCollection();
    await mongoose.model('CartItem').collection.createIndexes([
      { key: { cart_id: 1 }, name: 'cartitem_cart_id' },
      { key: { product_id: 1 }, name: 'cartitem_product_id' }
    ]);

    // Tạo collection Review với timestamps
    await mongoose.model('Review').createCollection();
    await mongoose.model('Review').collection.createIndexes([
      { key: { product_id: 1 }, name: 'review_product_id' },
      { key: { user_id: 1 }, name: 'review_user_id' }
    ]);

    // Tạo collection Voucher
    await mongoose.model('Voucher').createCollection();
    await mongoose.model('Voucher').collection.createIndex(
      { code: 1 },
      { unique: true, name: 'voucher_code_unique' }
    );

    // Tạo collection Comment với timestamps
    await mongoose.model('Comment').createCollection();
    await mongoose.model('Comment').collection.createIndex(
      { user_id: 1 },
      { name: 'comment_user_id' }
    );

    const now = new Date();

    // Thêm dữ liệu mẫu cho Voucher
    await mongoose.model('Voucher').insertMany([
      {
        code: 'WELCOME2024',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 1000000,
        quantity: 100,
        expirationDate: new Date('2024-12-31'),
        isActive: true
      },
      {
        code: 'SUMMER2024',
        discountType: 'fixed',
        discountValue: 200000,
        minOrderValue: 2000000,
        quantity: 50,
        expirationDate: new Date('2024-08-31'),
        isActive: true
      }
    ]);
  },

  down: async () => {
    const collections = [
      'Cart',
      'CartItem',
      'Review',
      'Voucher',
      'Comment'
    ];

    for (const collection of collections) {
      try {
        await mongoose.model(collection).collection.drop();
      } catch (error) {
        // Bỏ qua lỗi nếu collection không tồn tại
        if (error.code !== 26) throw error;
      }
    }
  }
};