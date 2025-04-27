const mongoose = require('mongoose');

module.exports = {
  up: async () => {
    try {
      // Cleanup existing collections
      const collections = ['Order', 'OrderDetail', 'OrderStatus', 'OrderHistory'];
      for (const collection of collections) {
        try {
          await mongoose.model(collection).collection.drop();
        } catch (error) {
          // Skip error if collection doesn't exist
          if (error.code !== 26) throw error;
        }
      }

      // Create collections and indexes
      await mongoose.model('Order').createCollection();
      await mongoose.model('Order').collection.createIndexes([
        { key: { user: 1 }, name: 'order_user_index' },
        { key: { status: 1 }, name: 'order_status_index' },
        { key: { createdAt: -1 }, name: 'order_date_index' }
      ]);

      await mongoose.model('OrderDetail').createCollection();
      await mongoose.model('OrderDetail').collection.createIndex(
        { order_id: 1 },
        { unique: true, name: 'orderdetail_order_unique' }
      );

      // Create and populate OrderStatus
      await mongoose.model('OrderStatus').createCollection();
      await mongoose.model('OrderStatus').insertMany([
        { 
          status_name: 'pending',
          description: 'Đơn hàng đang chờ xác nhận',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          status_name: 'confirmed',
          description: 'Đơn hàng đã được xác nhận',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          status_name: 'shipping',
          description: 'Đơn hàng đang được vận chuyển',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          status_name: 'completed',
          description: 'Đơn hàng đã hoàn thành',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          status_name: 'cancelled',
          description: 'Đơn hàng đã bị hủy',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      // Create OrderHistory collection with indexes
      await mongoose.model('OrderHistory').createCollection();
      await mongoose.model('OrderHistory').collection.createIndexes([
        { key: { order_id: 1 }, name: 'orderhistory_order_index' },
        { key: { user_id: 1 }, name: 'orderhistory_user_index' },
        { key: { createdAt: -1 }, name: 'orderhistory_date_index' }
      ]);

      console.log('✅ Order collections and indexes created successfully');
    } catch (error) {
      console.error('❌ Error in orders migration:', error);
      throw error;
    }
  },

  down: async () => {
    const collections = ['Order', 'OrderDetail', 'OrderStatus', 'OrderHistory'];
    for (const collection of collections) {
      try {
        await mongoose.model(collection).collection.drop();
      } catch (error) {
        if (error.code !== 26) throw error;
      }
    }
  }
};