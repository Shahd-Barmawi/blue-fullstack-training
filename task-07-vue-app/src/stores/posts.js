import { defineStore } from "pinia";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POSTS_API_URL = `${API_BASE_URL}/posts`;

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],

    loading: false,
    error: "",

    favoriteIds: [],

    // Create
    submitting: false,
    submitError: "",
    validationErrors: {},
    createdPost: null,

    // Update
    updating: false,
    updateError: "",
    updateValidationErrors: {},
    updatedPost: null,

    // Delete
    deleting: false,
    deleteError: "",
  }),

  getters: {
    favoriteCount: (state) => state.favoriteIds.length,

    favoritePosts: (state) => {
      return state.posts.filter((post) => state.favoriteIds.includes(post.id));
    },
  },

  actions: {
    // =========================
    // LOAD POSTS
    // =========================
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

    // =========================
    // LOAD SINGLE POST
    // =========================
    async loadPost(postId) {
      this.loading = true;
      this.error = "";

      try {
        const response = await fetch(`${POSTS_API_URL}/${postId}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.status === 404) {
          this.error = "Post not found.";
          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const post = data.data || data;

        const existingIndex = this.posts.findIndex(
          (item) => item.id === post.id,
        );

        if (existingIndex !== -1) {
          this.posts[existingIndex] = post;
        } else {
          this.posts.push(post);
        }

        return post;
      } catch (error) {
        this.error = "Unable to load the post. Please try again.";

        console.error(error);

        return null;
      } finally {
        this.loading = false;
      }
    },

    // =========================
    // FAVORITES
    // =========================
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

    // =========================
    // CREATE POST
    // =========================
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

    // =========================
    // UPDATE POST
    // =========================
    async updatePost(postId, postData) {
      this.updating = true;
      this.updateError = "";
      this.updateValidationErrors = {};
      this.updatedPost = null;

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.updateError = "You must be logged in to update a post.";

          return false;
        }

        const response = await fetch(`${POSTS_API_URL}/${postId}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (response.status === 401) {
          this.updateError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.updateError = "You are not allowed to update this post.";

          return false;
        }

        if (response.status === 404) {
          this.updateError = "Post not found.";

          return false;
        }

        if (response.status === 422) {
          this.updateError =
            data.message || "Please correct the validation errors.";

          this.updateValidationErrors = data.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const updated = data.data || data;

        this.updatedPost = updated;

        const index = this.posts.findIndex((post) => post.id === updated.id);

        if (index !== -1) {
          this.posts[index] = updated;
        } else {
          this.posts.push(updated);
        }

        return true;
      } catch (error) {
        this.updateError = "Unable to update the post. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.updating = false;
      }
    },

    clearUpdateState() {
      this.updateError = "";
      this.updateValidationErrors = {};
      this.updatedPost = null;
    },

    // =========================
    // DELETE POST
    // =========================
    async deletePost(postId) {
      this.deleting = true;
      this.deleteError = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.deleteError = "You must be logged in to delete a post.";

          return false;
        }

        const response = await fetch(`${POSTS_API_URL}/${postId}`, {
          method: "DELETE",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          this.deleteError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.deleteError = "You are not allowed to delete this post.";

          return false;
        }

        if (response.status === 404) {
          this.deleteError = "Post not found.";

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const id = Number(postId);

        this.posts = this.posts.filter((post) => post.id !== id);

        this.favoriteIds = this.favoriteIds.filter(
          (favoriteId) => favoriteId !== id,
        );

        localStorage.setItem(
          "favoritePostIds",
          JSON.stringify(this.favoriteIds),
        );

        return true;
      } catch (error) {
        this.deleteError = "Unable to delete the post. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.deleting = false;
      }
    },

    clearDeleteState() {
      this.deleteError = "";
    },
  },
});
