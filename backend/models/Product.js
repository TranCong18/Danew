const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "unisex"], // Chỉ chấp nhận 3 giá trị này
    required: true,
  },
  basePrice: { type: Number, required: true },
  variants: [
    {
      size: { type: String, required: true },
      color: { type: String, required: true },
      stock: { type: Number, default: 0 },
      price: { type: Number, required: true },
    },
  ],
  images: [{ type: String }], // Danh sách URL ảnh
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Product", productSchema);
