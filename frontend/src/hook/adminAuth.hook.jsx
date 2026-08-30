import { useContext } from "react";
import { AdminAuthContext } from "../context/adminAuth.context.jsx";

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};
