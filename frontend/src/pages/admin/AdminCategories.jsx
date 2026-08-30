import { useState, useEffect } from "react";
import {
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../../apis/adminAuth.api.jsx";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminGetAllCategories().then((data) => {
      if (data) setCategories(data.categories);
      setLoading(false);
    });
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (!editingId) {
      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setImageFile(null);
    setShowForm(true);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setImageFile(null);
    setShowForm(false);
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name || !slug) {
      setMsg("Name aur slug required hain.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        const data = await adminUpdateCategory(editingId, formData);
        setCategories(categories.map((c) => (c._id === editingId ? data.category : c)));
        resetForm();
        setMsg("Category updated successfully!");
      } else {
        const data = await adminCreateCategory(formData);
        setCategories([...categories, data.category]);
        resetForm();
        setMsg("Category created successfully!");
      }
    } catch (err) {
      setMsg(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminDeleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
      setMsg("Category deleted successfully!");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Categories</h2>
          <p className="text-sm text-slate-500 mt-1">Manage product categories</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            + Add Category
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
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name + Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Name *</label>
                <input
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. T-Shirts"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Slug *</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. t-shirts"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Category Image */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Category Image {editingId ? "(upload to replace existing)" : "(optional)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
                className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-xs file:font-medium cursor-pointer"
              />
              {imageFile && (
                <p className="text-xs text-slate-400 mt-1">{imageFile.name} selected</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={showForm && !name && !slug}
                className="bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                {editingId ? "Update" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={() => resetForm()}
                className="text-sm font-medium px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        {loading ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-400 text-center">No categories yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Image</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Slug</th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-6 py-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
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

export default AdminCategories;