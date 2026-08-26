import { onMounted, ref } from "vue";

import { apiGet } from "../services/api";

export const useCategories = () => {
  const categories = ref([]);
  const categoriesLoading = ref(false);
  const categoriesError = ref("");

  const loadCategories = async () => {
    categoriesLoading.value = true;
    categoriesError.value = "";

    try {
      const { response, data } = await apiGet("/categories");

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      categories.value = Array.isArray(data) ? data : data?.data || [];
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
