import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

const UserProductAdd = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    gender: "",
    variants: [{ size: "", color: "", stock: 0, price: "" }],
    images: [],
    description: "",
    basePrice: 0,
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đăng sản phẩm!");
      navigate("/login");
      return;
    }

    // Lấy danh sách brands và categories
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          axiosInstance.get("/brands"),
          axiosInstance.get("/categories")
        ]);
        setBrands(brandRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchBrandsAndCategories();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...product.variants];
    newVariants[index] = { ...newVariants[index], [name]: value };
    
    // Cập nhật giá cơ bản
    const newBasePrice = Math.min(...newVariants.map(v => Number(v.price) || Infinity));
    setProduct(prev => ({
      ...prev,
      variants: newVariants,
      basePrice: newBasePrice
    }));
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 0, price: "" }]
    }));
  };

  const removeVariant = (index) => {
    setProduct(prev => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      const newBasePrice = Math.min(...newVariants.map(v => Number(v.price) || Infinity));
      return {
        ...prev,
        variants: newVariants,
        basePrice: newBasePrice || 0
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload ảnh lên Cloudinary
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "product_upload");
          
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dvwvnhgg9/image/upload",
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await res.json();
          return data.secure_url;
        })
      );

      // Tạo sản phẩm mới với ảnh đã upload
      const newProduct = {
        ...product,
        images: uploadedImages,
        userId: JSON.parse(localStorage.getItem("user"))?._id
      };

      await axiosInstance.post("/products", newProduct);
      alert("✅ Thêm sản phẩm thành công!");
      navigate("/");
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Đăng bán sản phẩm</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Thương hiệu</label>
          <select
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Danh mục</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Giới tính</label>
          <select
            name="gender"
            value={product.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Mô tả</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        <div>
          <label className="block mb-3">Biến thể sản phẩm</label>
          {product.variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                name="size"
                placeholder="Size"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, e)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="color"
                placeholder="Màu sắc"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, e)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Số lượng"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, e)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Giá"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
                className="p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Thêm biến thể
          </button>
        </div>

        <div>
          <label className="block mb-1">Hình ảnh sản phẩm</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`preview ${index + 1}`}
                className="object-cover w-20 h-20 rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white bg-green-500 rounded hover:bg-green-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang xử lý..." : "Đăng sản phẩm"}
        </button>
      </form>
    </div>
  );
};

export default UserProductAdd;