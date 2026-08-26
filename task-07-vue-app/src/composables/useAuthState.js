import { computed, ref } from "vue";

import { apiGet, apiPost } from "../services/api";

const token = ref(localStorage.getItem("authToken") || "");

const savedUser = localStorage.getItem("authUser");

const user = ref(savedUser ? JSON.parse(savedUser) : null);

export const useAuthState = () => {
  const isAuthenticated = computed(() => {
    return Boolean(token.value);
  });

  const setAuth = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;

    localStorage.setItem("authToken", newToken);

    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const clearAuth = () => {
    token.value = "";
    user.value = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const fetchAuthenticatedUser = async () => {
    if (!token.value) {
      return false;
    }

    try {
      const { response, data } = await apiGet("/me", {
        auth: true,
      });

      if (!response.ok) {
        clearAuth();

        return false;
      }

      user.value = data;

      localStorage.setItem("authUser", JSON.stringify(data));

      return true;
    } catch (error) {
      console.error("Unable to load authenticated user:", error);

      return false;
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await apiPost("/logout", undefined, {
          auth: true,
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuth();
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    fetchAuthenticatedUser,
    logout,
  };
};
