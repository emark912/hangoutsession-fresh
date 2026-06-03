import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const { data: user, isLoading: loading } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    setToken(storedToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("auth-token");
    setToken(null);
    window.location.href = "/";
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
