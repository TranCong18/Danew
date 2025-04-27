const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

// Import tất cả models để đảm bảo chúng được đăng ký với Mongoose
require('../models/User');
require('../models/Brand');
require('../models/Category');
require('../models/Product');
require('../models/Size');
require('../models/Color');
require('../models/ProductVariant');
require('../models/Order');
require('../models/OrderDetail');
require('../models/OrderStatus');
require('../models/OrderHistory');
require('../models/Cart');
require('../models/CartItem');
require('../models/Review');
require('../models/Comment');
require('../models/Voucher');
require('../models/OrderItem');
require('../models/ProductImage');
require('../models/PasswordResetToken');
require('../models/PersonalAccessToken');
require('../models/Discount');
require('../models/FailedJob');
require('../models/Migration');

async function runMigrations() {
  try {
    // Sử dụng MONGO_URI thay vì MONGODB_URI
    const mongoURI = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MongoDB connection URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ Kết nối database thành công');

    // Lấy danh sách file migration theo thứ tự
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(f => f.endsWith('.js'))
      .sort();

    // Chạy từng migration
    for (const file of migrationFiles) {
      console.log(`\n🔄 Đang chạy migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await migration.up();
        console.log(`✅ Migration ${file} thành công`);
      } catch (error) {
        console.error(`❌ Lỗi khi chạy migration ${file}:`, error);
        // Rollback migration này
        try {
          await migration.down();
          console.log(`↩️ Đã rollback migration ${file}`);
        } catch (rollbackError) {
          console.error(`❌ Lỗi khi rollback migration ${file}:`, rollbackError);
        }
        throw error;
      }
    }

    console.log('\n✅ Tất cả migrations đã chạy thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi chạy migrations:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runMigrations();