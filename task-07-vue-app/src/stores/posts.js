import { defineStore } from "pinia";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const POSTS_API_URL = `${API_BASE_URL}/posts`;

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],

    loading: false,
    error: "",

    /*
     * Backend filtering / pagination state
     */
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    totalPosts: 0,

    paginationLinks: {
      first: null,
      last: null,
      prev: null,
      next: null,
    },

    currentSearch: "",

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

    hasPreviousPage: (state) => {
      return state.currentPage > 1;
    },

    hasNextPage: (state) => {
      return state.currentPage < state.lastPage;
    },
  },

  actions: {
    // =========================
    // LOAD POSTS
    // Backend Search + Pagination
    // =========================
    async loadPosts(options = {}) {
      this.loading = true;
      this.error = "";

      const page = Number(options.page || 1);

      const search =
        options.search !== undefined
          ? String(options.search).trim()
          : this.currentSearch;

      this.currentSearch = search;

      try {
        const params = new URLSearchParams();

        params.set("page", String(page));

        /*
         * Task 13 backend search parameter.
         *
         * If your Laravel backend used another
         * parameter name, change "search" here.
         */
        if (search) {
          params.set("search", search);
        }

        const requestUrl = `${POSTS_API_URL}?${params.toString()}`;

        const response = await fetch(requestUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        /*
         * Laravel paginated resource response:
         *
         * {
         *   data: [...],
         *   links: {...},
         *   meta: {...}
         * }
         */
        this.posts = Array.isArray(result) ? result : result.data || [];

        if (result.meta) {
          this.currentPage = Number(result.meta.current_page) || 1;

          this.lastPage = Number(result.meta.last_page) || 1;

          this.perPage = Number(result.meta.per_page) || 0;

          this.totalPosts = Number(result.meta.total) || 0;
        } else {
          this.currentPage = 1;
          this.lastPage = 1;
          this.perPage = this.posts.length;
          this.totalPosts = this.posts.length;
        }

        if (result.links) {
          this.paginationLinks = {
            first: result.links.first || null,
            last: result.links.last || null,
            prev: result.links.prev || null,
            next: result.links.next || null,
          };
        } else {
          this.paginationLinks = {
            first: null,
            last: null,
            prev: null,
            next: null,
          };
        }
      } catch (error) {
        this.error =
          "Unable to load posts from the Laravel API. Please try again.";

        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    retryPosts() {
      return this.loadPosts({
        page: this.currentPage,
        search: this.currentSearch,
      });
    },

    goToPage(page) {
      const targetPage = Number(page);

      if (
        !Number.isInteger(targetPage) ||
        targetPage < 1 ||
        targetPage > this.lastPage ||
        targetPage === this.currentPage
      ) {
        return;
      }

      return this.loadPosts({
        page: targetPage,
        search: this.currentSearch,
      });
    },

    goToNextPage() {
      if (!this.hasNextPage) {
        return;
      }

      return this.goToPage(this.currentPage + 1);
    },

    goToPreviousPage() {
      if (!this.hasPreviousPage) {
        return;
      }

      return this.goToPage(this.currentPage - 1);
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

        /*
         * Reload page 1 from Laravel because
         * pagination is now server-driven.
         */
        await this.loadPosts({
          page: 1,
          search: this.currentSearch,
        });

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

        this.favoriteIds = this.favoriteIds.filter(
          (favoriteId) => favoriteId !== id,
        );

        localStorage.setItem(
          "favoritePostIds",
          JSON.stringify(this.favoriteIds),
        );

        /*
         * Reload current page from backend.
         */
        await this.loadPosts({
          page: this.currentPage,
          search: this.currentSearch,
        });

        /*
         * If deleting the last item on a page
         * caused the current page to disappear,
         * return to the new last page.
         */
        if (this.posts.length === 0 && this.currentPage > 1) {
          await this.loadPosts({
            page: this.currentPage - 1,
            search: this.currentSearch,
          });
        }

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
