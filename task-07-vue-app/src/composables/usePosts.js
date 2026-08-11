import { ref } from "vue";

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";

export const usePosts = () => {
  const posts = ref([]);
  const post = ref(null);

  const loading = ref(false);
  const error = ref("");

  const loadPosts = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await fetch(POSTS_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      posts.value = data.slice(0, 12);
    } catch (err) {
      error.value = "Unable to load posts. Please try again.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const loadPostById = async (id) => {
    loading.value = true;
    error.value = "";
    post.value = null;

    try {
      const response = await fetch(`${POSTS_API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.id) {
        throw new Error("Post not found");
      }

      post.value = data;
    } catch (err) {
      error.value = "Unable to load this post.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    posts,
    post,
    loading,
    error,
    loadPosts,
    loadPostById,
  };
};
