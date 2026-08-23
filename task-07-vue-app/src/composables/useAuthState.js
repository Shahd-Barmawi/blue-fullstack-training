import { computed, ref } from "vue";

const token = ref(
  localStorage.getItem("authToken") || "",
);

const savedUser = localStorage.getItem("authUser");

const user = ref(
  savedUser ? JSON.parse(savedUser) : null,
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const useAuthState = () => {
  const isAuthenticated = computed(() => {
    return Boolean(token.value);
  });

  const setAuth = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;

    localStorage.setItem(
      "authToken",
      newToken,
    );

    localStorage.setItem(
      "authUser",
      JSON.stringify(newUser),
    );
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
      const response = await fetch(
        `${API_BASE_URL}/me`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token.value}`,
          },
        },
      );

      if (!response.ok) {
        clearAuth();
        return false;
      }

      const data = await response.json();

      user.value = data;

      localStorage.setItem(
        "authUser",
        JSON.stringify(data),
      );

      return true;
    } catch (error) {
      console.error(
        "Unable to load authenticated user:",
        error,
      );

      return false;
    }
  };

  const logout = async () => {
    try {
      if (token.value) {
        await fetch(
          `${API_BASE_URL}/logout`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token.value}`,
            },
          },
        );
      }
    } catch (error) {
      console.error(
        "Logout request failed:",
        error,
      );
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