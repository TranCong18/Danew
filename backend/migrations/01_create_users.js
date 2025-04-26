const mongoose = require('mongoose');

module.exports = {
  up: async () => {
    await mongoose.model('User').createCollection();
    // Tạo index cho các trường unique
    await mongoose.model('User').collection.createIndexes([
      { key: { username: 1 }, unique: true },
      { key: { email: 1 }, unique: true },
      { key: { phone: 1 }, unique: true }
    ]);
  },

  down: async () => {
    await mongoose.model('User').collection.drop();
  }
};