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

    createdPost: null,
    createdPosts: [],

    nextPostId: 13,
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

        /*
         * Laravel returns:
         *
         * {
         *   data: [...],
         *   links: {...},
         *   meta: {...}
         * }
         *
         * JSONPlaceholder used to return [...]
         *
         * So we only extract result.data here.
         */
        const apiPosts = Array.isArray(result) ? result : result.data || [];

        this.posts = [
          ...apiPosts,
          ...this.createdPosts.filter(
            (createdPost) =>
              !apiPosts.some((apiPost) => apiPost.id === createdPost.id),
          ),
        ];
      } catch (error) {
        this.error = "Unable to load posts. Please try again.";

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

    restoreCreatedPosts() {
      const savedPosts = localStorage.getItem("createdPosts");

      const savedNextPostId = localStorage.getItem("nextPostId");

      if (savedPosts) {
        this.createdPosts = JSON.parse(savedPosts);
      }

      if (savedNextPostId) {
        this.nextPostId = Number(savedNextPostId);
      }
    },

    async submitPost(postData) {
      this.submitting = true;
      this.submitError = "";
      this.createdPost = null;

      try {
        /*
         * سنربط هذا لاحقًا بـ Laravel + Bearer Token
         * بعد ما نكمل Authentication Integration.
         *
         * حاليًا نحافظ على نفس behavior القديم
         * حتى ما ينكسر Create Post أو Statistics.
         */

        const newPost = {
          ...postData,
          id: this.nextPostId,
        };

        this.nextPostId++;

        this.createdPost = newPost;

        this.createdPosts.push(newPost);
        this.posts.push(newPost);

        localStorage.setItem("createdPosts", JSON.stringify(this.createdPosts));

        localStorage.setItem("nextPostId", String(this.nextPostId));

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
    },
  },
});
