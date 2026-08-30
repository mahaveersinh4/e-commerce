import { createContext, useState, useEffect } from "react";
import { getMe, refreshToken, setAccessToken} from "../apis/auth.api.jsx";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // app khulne ya page refresh hone par:
    // pehle cookie se naya access token lo
    // phir user ki details lo
    const loadUser = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);

        const meData = await getMe();
        setUser(meData.user);

      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
