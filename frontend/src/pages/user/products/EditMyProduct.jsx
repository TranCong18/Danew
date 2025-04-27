import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

const EditMyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Không tìm thấy sản phẩm hoặc lỗi server!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleAddVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "", color: "", stock: 0, price: "" },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setProduct((prev) => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      return { ...prev, variants: newVariants };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const getId = (field) =>
    typeof field === "object" && field !== null ? field._id : field;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let uploadedImages = product.images ? [...product.images] : [];
      if (selectedImages.length > 0) {
        for (let image of selectedImages) {
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
          uploadedImages.push(data.secure_url);
        }
      }
      // Nếu không có ảnh nào, báo lỗi và return
      if (!uploadedImages || uploadedImages.length === 0) {
        setError("Sản phẩm phải có ít nhất 1 ảnh!");
        setLoading(false);
        return;
      }
      // Ép kiểu số cho price và stock
      const variants = product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock),
      }));
      await axiosInstance.put(`/products/${id}`, {
        ...product,
        brand: getId(product.brand),
        category: getId(product.category),
        userId: getId(product.userId),
        variants,
        images: uploadedImages,
      });
      setSelectedImages([]); // clear sau khi upload
      alert("Cập nhật sản phẩm thành công!");
      navigate("/my-products");
    } catch (err) {
      setError("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-bold">Chỉnh sửa sản phẩm</h2>
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
          <label className="block mb-1">Mô tả</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <div>
          <label className="block mb-1">Biến thể sản phẩm</label>
          <div className="space-y-2">
            {product.variants.map((variant, idx) => (
              <div key={idx} className="flex flex-wrap items-end gap-2 mb-2">
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Size</label>
                  <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(idx, e)}
                    className="w-24 p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Màu sắc</label>
                  <input
                    type="text"
                    name="color"
                    placeholder="Màu sắc"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(idx, e)}
                    className="w-32 p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Số lượng</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Số lượng"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(idx, e)}
                    className="w-24 p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs">Giá</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Giá"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, e)}
                    className="w-32 p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="px-2 py-1 ml-2 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                  title="Xoá biến thể"
                  disabled={product.variants.length === 1}
                >
                  Xoá
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              + Thêm biến thể
            </button>
          </div>
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
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`preview ${idx + 1}`}
                className="object-cover w-20 h-20 rounded"
              />
            ))}
            {selectedImages.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`new preview ${idx + 1}`}
                className="object-cover w-20 h-20 border-2 border-blue-400 rounded"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-3 text-white bg-green-500 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default EditMyProduct;