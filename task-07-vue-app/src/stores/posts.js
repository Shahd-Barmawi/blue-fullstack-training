import { defineStore } from "pinia";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POSTS_API_URL = `${API_BASE_URL}/posts`;

const INVALID_POSTS_API_URL = `${API_BASE_URL}/invalid-posts`;

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],

    loading: false,
    error: "",

    favoriteIds: [],

    submitting: false,
    submitError: "",
    validationErrors: {},

    createdPost: null,
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
        const response = await fetch(POSTS_API_URL, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        const apiPosts = Array.isArray(result) ? result : result.data || [];

        this.posts = apiPosts;
      } catch (error) {
        this.error =
          "Unable to load posts from the Laravel API. Please try again.";

        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    retryPosts() {
      return this.loadPosts();
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

    async submitPost(postData) {
      this.submitting = true;
      this.submitError = "";
      this.validationErrors = {};
      this.createdPost = null;

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.submitError = "You must be logged in to create a post.";

          return false;
        }

        const response = await fetch(POSTS_API_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Accept: "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (response.status === 401) {
          this.submitError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.submitError = "You are not authorized to create this post.";

          return false;
        }

        if (response.status === 422) {
          this.submitError =
            data.message || "Please correct the validation errors.";

          this.validationErrors = data.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const newPost = data.data || data;

        this.createdPost = newPost;

        /*
         * Keep Pinia state synchronized
         * without requiring a browser refresh.
         */
        this.posts.unshift(newPost);

        return true;
      } catch (error) {
        this.submitError = "Unable to create the post. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.submitting = false;
      }
    },

    clearCreatedPost() {
      this.createdPost = null;
      this.submitError = "";
      this.validationErrors = {};
    },
  },
});
