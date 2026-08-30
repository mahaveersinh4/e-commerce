import api from "./auth.api.jsx";

// ===========================
// Get All Categories (Public)
// ===========================
const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Create Category (Admin)
// ===========================
const createCategory = async (data) => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Update Category (Admin)
// ===========================
const updateCategory = async (id, data) => {
  try {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

// ===========================
// Delete Category (Admin)
// ===========================
const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };
