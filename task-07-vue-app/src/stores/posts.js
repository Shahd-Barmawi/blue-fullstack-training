import { defineStore } from "pinia";

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";

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
        const response = await fetch(POSTS_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        this.posts = [...data.slice(0, 12), ...this.createdPosts];
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
        const response = await fetch(POSTS_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const newPost = {
          ...data,
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
