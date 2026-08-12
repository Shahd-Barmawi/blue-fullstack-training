import { defineStore } from "pinia";

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],
    loading: false,
    error: "",
    favoriteIds: [],
  }),

  getters: {
    favoriteCount: (state) => state.favoriteIds.length,

    favoritePosts: (state) => {
      return state.posts.filter((post) => state.favoriteIds.includes(post.id));
    },
  },

  actions: {
    async loadPosts() {
      this.loading = true;
      this.error = "";

      try {
        const response = await fetch(POSTS_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        this.posts = data.slice(0, 12);
      } catch (error) {
        this.error = "Unable to load posts. Please try again.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    toggleFavorite(postId) {
      const id = Number(postId);

      if (this.favoriteIds.includes(id)) {
        this.favoriteIds = this.favoriteIds.filter(
          (favoriteId) => favoriteId !== id,
        );
      } else {
        this.favoriteIds.push(id);
      }

      localStorage.setItem("favoritePostIds", JSON.stringify(this.favoriteIds));
    },

    isFavorite(postId) {
      return this.favoriteIds.includes(Number(postId));
    },

    restoreFavorites() {
      const savedFavorites = localStorage.getItem("favoritePostIds");

      if (savedFavorites) {
        this.favoriteIds = JSON.parse(savedFavorites);
      }
    },
  },
});
