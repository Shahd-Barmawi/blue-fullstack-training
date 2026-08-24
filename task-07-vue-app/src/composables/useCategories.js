import { onMounted, ref } from "vue";

export const useCategories = () => {
  const categories = ref([]);
  const categoriesLoading = ref(false);
  const categoriesError = ref("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const loadCategories = async () => {
    categoriesLoading.value = true;
    categoriesError.value = "";

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      categories.value = Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      categoriesError.value = "Unable to load categories.";

      console.error(error);
    } finally {
      categoriesLoading.value = false;
    }
  };

  onMounted(() => {
    loadCategories();
  });

  return {
    categories,
    categoriesLoading,
    categoriesError,
    loadCategories,
  };
};
