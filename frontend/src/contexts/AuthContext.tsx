"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  tel?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    tel: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- NEW REUSABLE FUNCTION ---
  const fetchUserProfile = async (authToken: string): Promise<User> => {
    const profileResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }

    const profileData = await profileResponse.json();
    const userData = profileData.data;

    const formattedUser: User = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      tel: userData.tel,
      role: userData.role as UserRole,
    };
    return formattedUser;
  };
  // -----------------------------

  const saveAuthData = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 1. Initial Login to get Token
      const loginResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Login failed");
      }

      const loginData = await loginResponse.json();
      const { token } = loginData;

      // 2. Fetch User Profile using reusable function
      const userProfile = await fetchUserProfile(token);

      // 3. Save Auth Data
      saveAuthData(token, userProfile);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    tel: string,
    password: string,
    role: UserRole
  ) => {
    try {
      // 1. Register User
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, tel, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      const { token } = data; // Assuming register returns token

      // 2. Fetch User Profile using reusable function
      // If the register endpoint returns the full user object,
      // you can use that directly instead of calling fetchUserProfile.
      // Based on the login flow, we'll assume we still need the /me endpoint.
      const userProfile = await fetchUserProfile(token);

      // 3. Save Auth Data
      saveAuthData(token, userProfile);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error(
          "Server logout failed, clearing local state anyway:",
          error
        );
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
