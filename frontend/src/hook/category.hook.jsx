import { useState } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../apis/category.api.jsx";

// Category ke liye hook - context nahi banaya kyunki categories
// sirf list fetch hoti hain, global state ki zaroorat nahi
export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Saari categories fetch karo
  const fetchCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    if (data) setCategories(data.categories);
    setLoading(false);
  };

  // Admin: category banao
  const addCategory = async (categoryData) => {
    const data = await createCategory(categoryData);
    if (data) setCategories((prev) => [...prev, data.category]);
    return data;
  };

  // Admin: category update karo
  const editCategory = async (id, categoryData) => {
    const data = await updateCategory(id, categoryData);
    if (data) {
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? data.category : c))
      );
    }
    return data;
  };

  // Admin: category delete karo
  const removeCategory = async (id) => {
    const data = await deleteCategory(id);
    if (data) setCategories((prev) => prev.filter((c) => c._id !== id));
    return data;
  };

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
};
