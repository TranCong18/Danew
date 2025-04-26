const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
