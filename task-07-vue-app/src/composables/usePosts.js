import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostsStore } from "../stores/posts";

export const usePosts = () => {
  const route = useRoute();
  const router = useRouter();
  const postsStore = usePostsStore();

  const searchTerm = ref(route.query.q || "");

  const filteredPosts = computed(() => {
    const value = searchTerm.value.trim().toLowerCase();

    if (!value) {
      return postsStore.posts;
    }

    return postsStore.posts.filter((post) =>
      post.title.toLowerCase().includes(value),
    );
  });

  const resetSearch = () => {
    searchTerm.value = "";
  };

  watch(searchTerm, (newValue) => {
    const value = newValue.trim();

    router.replace({
      path: "/posts",
      query: value ? { q: value } : {},
    });
  });

  watch(
    () => route.query.q,
    (newQuery) => {
      searchTerm.value = newQuery || "";
    },
  );

  onMounted(() => {
    if (postsStore.posts.length === 0) {
      postsStore.loadPosts();
    }
  });

  return {
    postsStore,
    searchTerm,
    filteredPosts,
    resetSearch,
  };
};
