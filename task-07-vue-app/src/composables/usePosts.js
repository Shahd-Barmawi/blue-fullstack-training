import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

import { useRoute, useRouter } from "vue-router";

import { usePostsStore } from "../stores/posts";

export const usePosts = () => {
  const route = useRoute();
  const router = useRouter();

  const postsStore = usePostsStore();

  const searchTerm = ref(route.query.q || "");

  /*
   * We keep this name so the existing
   * PostsSection template does not break.
   *
   * Filtering itself is NOT done here.
   * These are the records returned by Laravel.
   */
  const filteredPosts = computed(() => {
    return postsStore.posts;
  });

  let searchTimer = null;

  const loadCurrentSearch = async (page = 1) => {
    await postsStore.loadPosts({
      page,
      search: searchTerm.value,
    });
  };

  const updateRouteQuery = (search, page) => {
    const query = {};

    if (search) {
      query.q = search;
    }

    if (page > 1) {
      query.page = String(page);
    }

    router.replace({
      path: "/posts",
      query,
    });
  };

  const resetSearch = async () => {
    searchTerm.value = "";

    clearTimeout(searchTimer);

    updateRouteQuery("", 1);

    await postsStore.loadPosts({
      page: 1,
      search: "",
    });
  };

  const changePage = async (page) => {
    const targetPage = Number(page);

    if (
      targetPage < 1 ||
      targetPage > postsStore.lastPage ||
      targetPage === postsStore.currentPage
    ) {
      return;
    }

    updateRouteQuery(searchTerm.value.trim(), targetPage);

    await postsStore.loadPosts({
      page: targetPage,
      search: searchTerm.value,
    });
  };

  const nextPage = async () => {
    if (!postsStore.hasNextPage) {
      return;
    }

    await changePage(postsStore.currentPage + 1);
  };

  const previousPage = async () => {
    if (!postsStore.hasPreviousPage) {
      return;
    }

    await changePage(postsStore.currentPage - 1);
  };

  watch(searchTerm, (newValue) => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(async () => {
      const value = newValue.trim();

      updateRouteQuery(value, 1);

      await postsStore.loadPosts({
        page: 1,
        search: value,
      });
    }, 400);
  });

  /*
   * Supports browser Back / Forward
   * and direct URLs such as:
   *
   * /posts?q=testing&page=2
   */
  watch(
    () => route.query,
    async (newQuery) => {
      const querySearch = newQuery.q || "";

      const queryPage = Number(newQuery.page || 1);

      if (querySearch !== searchTerm.value) {
        searchTerm.value = querySearch;

        return;
      }

      if (queryPage !== postsStore.currentPage) {
        await postsStore.loadPosts({
          page: queryPage,
          search: querySearch,
        });
      }
    },
  );

  onMounted(async () => {
    const initialPage = Number(route.query.page || 1);

    await postsStore.loadPosts({
      page: initialPage,
      search: searchTerm.value,
    });
  });

  onBeforeUnmount(() => {
    clearTimeout(searchTimer);
  });

  return {
    postsStore,

    searchTerm,
    filteredPosts,

    resetSearch,

    changePage,
    nextPage,
    previousPage,
  };
};
