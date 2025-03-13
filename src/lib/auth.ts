import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  role: string;
  exp: number;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token) as JWTPayload;
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      return null;
    }

    return {
      id: decoded.id,
      role: decoded.role,
      isAdmin: decoded.role === "admin"
    };
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    return null;
  }
} 