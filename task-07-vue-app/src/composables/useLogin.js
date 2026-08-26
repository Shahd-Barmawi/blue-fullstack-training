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
    loading.value = true;
    error.value = "";

    try {
      const { response, data } = await apiPost("/login", {
        email: email.value,
        password: password.value,
      });

      if (!response.ok) {
        error.value = data?.message || "Invalid email or password.";

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
