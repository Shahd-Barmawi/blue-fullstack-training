import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthState } from "./useAuthState";

export const useLogin = () => {
  const router = useRouter();

  const { setAuth } = useAuthState();

  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const error = ref("");

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

  const login = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(
        `${API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        error.value =
          data.message || "Invalid email or password.";
        return;
      }

      setAuth(data.token, data.user);

      await router.push("/posts");
    } catch (err) {
      console.error(err);

      error.value =
        "Unable to connect to the server. Please try again.";
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