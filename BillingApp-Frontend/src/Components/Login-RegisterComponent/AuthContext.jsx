import { createContext, useState, useMemo, useContext } from "react";
import {
  loginUser as loginApi,
  registerUser as registerApi
} from "./AuthService.jsx";

function base64UrlToUint8Array(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT token");

    const payloadBytes = base64UrlToUint8Array(parts[1]);
    const json = new TextDecoder("utf-8").decode(payloadBytes);

    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem("authToken");
    const user = token ? parseJwt(token) : null;
    return { token, user };
  });

  const login = async ({ username, password }) => {
    const resp = await loginApi({ username, password });
    const token = resp?.token;

    if (!token) {
      throw { status: 500, message: "Token not returned by server" };
    }

    sessionStorage.setItem("authToken", token);
    const user = parseJwt(token);
    setAuth({ token, user });

    return { token, user, message: resp?.message || "Login successful" };
  };

  const register = async (payload) => {
    const resp = await registerApi(payload);
    const token = resp?.token;

    if (!token) {
      throw { status: 500, message: "Token not returned by server" };
    }

    sessionStorage.setItem("authToken", token);
    const user = parseJwt(token);
    setAuth({ token, user });

    return { token, user, message: resp?.message || "Registration successful" };
  };

  const logout = () => {
    sessionStorage.removeItem("authToken");
    setAuth({ token: null, user: null });
  };

  const isExpired = () => {
    const exp = auth?.user?.exp;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  };

  const value = useMemo(
    () => ({
      ...auth,
      login,
      register,
      logout,
      isExpired
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
