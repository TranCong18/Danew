const Product = require("../models/Product");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const { name, brand, category, gender, variants, description, basePrice } =
      req.body;

    if (
      !name ||
      !brand ||
      !category ||
      !gender ||
      !variants ||
      variants.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin sản phẩm hoặc biến thể." });
    }

    if (!["male", "female", "unisex"].includes(gender)) {
      return res.status(400).json({ message: "Giới tính không hợp lệ." });
    }

    for (let variant of variants) {
      if (
        !variant.size ||
        !variant.color ||
        !variant.price ||
        isNaN(variant.price)
      ) {
        return res
          .status(400)
          .json({ message: "Mỗi biến thể phải có size, color và giá hợp lệ." });
      }
    }

    const minPrice = Math.min(...variants.map((v) => v.price));

    let images = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path); // Xóa file sau khi upload
      }
    }

    const product = new Product({
      name,
      brand,
      category,
      gender,
      basePrice: basePrice || minPrice,
      variants,
      images,
      description,
    });

    await product.save();
    res.status(201).json({ message: "Sản phẩm đã được tạo!", product });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { name, brand, category, gender, variants, description, basePrice } =
      req.body;

    let updateData = {};
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (category) updateData.category = category;
    if (description) updateData.description = description;
    if (gender) {
      if (!["male", "female", "unisex"].includes(gender)) {
        return res.status(400).json({ message: "Giới tính không hợp lệ." });
      }
      updateData.gender = gender;
    }

    if (variants) {
      if (!Array.isArray(variants)) {
        return res.status(400).json({ message: "Variants phải là một mảng." });
      }
      for (let variant of variants) {
        if (
          !variant.size ||
          !variant.color ||
          !variant.price ||
          isNaN(variant.price)
        ) {
          return res.status(400).json({
            message: "Mỗi biến thể phải có size, color và giá hợp lệ.",
          });
        }
      }
      updateData.variants = variants;
      updateData.basePrice =
        basePrice || Math.min(...variants.map((v) => v.price));
    }

    if (req.files && req.files.length > 0) {
      let images = [];
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      updateData.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.json({
      message: "Sản phẩm đã được cập nhật!",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("brand");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand");

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    res.json({ message: "Sản phẩm đã được xóa." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
