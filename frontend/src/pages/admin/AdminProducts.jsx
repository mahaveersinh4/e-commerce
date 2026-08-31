import { useState, useEffect } from "react";
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetAllCategories,
} from "../../apis/adminAuth.api.jsx";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    stock: "",
    sizes: [],
    images: [],
  });
  const [msg, setMsg] = useState("");

  // Page load me products aur categories lo
  useEffect(() => {
    const loadData = async () => {
      const productsData = await adminGetAllProducts();
      const categoriesData = await adminGetAllCategories();
      if (productsData) setProducts(productsData.products);
      if (categoriesData) setCategories(categoriesData.categories);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "" ? "" : value }));
  };

  // Toggle size selection
  const toggleSize = (size) => {
    const sizes = formData.sizes.includes(size)
      ? formData.sizes.filter((s) => s !== size)
      : [...formData.sizes, size];
    setFormData({ ...formData, sizes });
  };

  // Form submit — add ya update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const { name, price, category, sku } = formData;
    if (!name || !price || !category || !sku) {
      setMsg("Name, price, category aur SKU required hain.");
      return;
    }

    try {
      const formDataObj = {
        name,
        description: formData.description,
        price: Number(price),
        category,
        sku,
        stock: formData.stock || 0,
        sizes: formData.sizes,
      };

      if (editingProduct) {
        // Update karo
        const res = await adminUpdateProduct(editingProduct._id, formDataObj);
        // List me update karo
        setProducts(products.map((p) => p._id === editingProduct._id ? res.product : p));
        setMsg("Product updated!");
      } else {
        // Naya add karo
        const res = await adminCreateProduct(formDataObj);
        setProducts([...products, res.product]);
        setMsg("Product added!");
      }
      resetForm();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Something went wrong.");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      sku: "",
      stock: "",
      sizes: [],
      images: [],
    });
    setShowForm(false);
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category?._id || product.category || "",
      sku: product.sku || "",
      stock: product.stock ?? "",
      sizes: product.sizes || [],
      images: [],
    });
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await adminDeleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      setMsg("Product deleted!");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="p-8">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your product catalog</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Message */}
      {msg && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-slate-100 text-sm text-slate-700">{msg}</div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-5">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name + SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Product Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Polo T-Shirt"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">SKU *</label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. RUD-001"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Product description..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400 resize-none"
              />
            </div>

            {/* Price + Stock + Category */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="999"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes (optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Sizes (optional)</label>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      formData.sizes.includes(size)
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                {editingProduct ? "Images (upload to replace existing)" : "Images (max 5) *"}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 5);
                  setFormData({ ...formData, images: files });
                }}
                className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-xs file:font-medium cursor-pointer"
              />
              {formData.images.length > 0 && (
                <p className="text-xs text-slate-400 mt-1">{formData.images.length} file(s) selected</p>
              )}
            </div>

            {/* Submit + Cancel */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">No products yet. Add one!</p>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">SKU</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Stock</th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">

                  {/* Product name + image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                          IMG
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-800">{product.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category?.name || "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">₹{product.price}</td>

                  {/* Stock — 0 hoga toh red */}
                  <td className="px-6 py-4">
                    <span className={product.stock === 0 ? "text-red-500" : "text-slate-800"}>
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminProducts;