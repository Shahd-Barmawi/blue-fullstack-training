import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { apiPost } from "../services/api";
import { useAuthState } from "./useAuthState";

export const useLogin = () => {
  const route = useRoute();
  const router = useRouter();

  const { setAuth } = useAuthState();

  const email = ref("");
  const password = ref("");

  const loading = ref(false);
  const error = ref("");

  const login = async () => {
    if (loading.value) {
      return false;
    }

    loading.value = true;
    error.value = "";

    try {
      const { response, data } = await apiPost("/login", {
        email: email.value,
        password: password.value,
      });

      if (response.status === 401) {
        error.value =
          "Invalid email or password. Please check your credentials.";

        return false;
      }

      if (!response.ok) {
        error.value = data?.message || "Unable to sign in. Please try again.";

        return false;
      }

      setAuth(data.token, data.user);

      const redirectPath =
        typeof route.query.redirect === "string"
          ? route.query.redirect
          : "/posts";

      await router.push(redirectPath);

      return true;
    } catch (err) {
      console.error(err);

      error.value = "Unable to connect to the server. Please try again.";

      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    email,
    password,
    loading,
    error,
    login,
  };
};
