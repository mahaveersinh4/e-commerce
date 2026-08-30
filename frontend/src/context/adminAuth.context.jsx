import { createContext, useState } from "react";
import { adminLogin } from "../apis/adminAuth.api.jsx";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const savedToken = sessionStorage.getItem("adminSessionToken");

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!savedToken);

  const adminLoginHandle = async ({ email, password }) => {
    const data = await adminLogin({ email, password });

    sessionStorage.setItem(
      "adminSessionToken",
      data.adminSessionToken
    );

    setIsAdminLoggedIn(true);

    return data;
  };

  const adminLogoutHandle = () => {
    sessionStorage.removeItem("adminSessionToken");
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminLoggedIn,
        adminLoginHandle,
        adminLogoutHandle,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};