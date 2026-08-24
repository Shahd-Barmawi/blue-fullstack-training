<script setup>
import { useRouter } from "vue-router";

import { usePosts } from "../composables/usePosts";
import { useAuthState } from "../composables/useAuthState";

const router = useRouter();

const { postsStore, searchTerm, filteredPosts, resetSearch } = usePosts();

const { isAuthenticated, user } = useAuthState();

const isOwner = (post) => {
  return (
    isAuthenticated.value && user.value && post.author?.id === user.value.id
  );
};

const editPost = (postId) => {
  router.push({
    path: `/posts/${postId}`,
    query: {
      edit: "1",
    },
  });
};

const deletePost = async (postId) => {
  postsStore.clearDeleteState();

  const confirmed = window.confirm(
    "Are you sure you want to delete this post?",
  );

  if (!confirmed) {
    return;
  }

  await postsStore.deletePost(postId);
};
</script>

<template>
  <section id="posts" class="posts section">
    <div class="container">
      <p class="section-label">Latest Posts</p>

      <h2 class="section-title">Latest Resources</h2>

      <p class="section-description">
        Browse the latest articles loaded from the Laravel REST API.
      </p>

      <div v-if="isAuthenticated" class="posts-actions">
        <RouterLink class="button" to="/posts/create"> + New Post </RouterLink>

        <RouterLink class="button" to="/my-posts"> My Posts </RouterLink>
      </div>

      <div class="posts-search">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search posts..."
          aria-label="Search posts"
        />

        <button type="button" @click="resetSearch">Reset</button>
      </div>

      <p class="posts-result-count">{{ filteredPosts.length }} posts</p>

      <div v-if="postsStore.loading" class="posts-state">Loading posts...</div>

      <div v-else-if="postsStore.error" class="posts-state">
        <p>
          {{ postsStore.error }}
        </p>

        <button class="button" type="button" @click="postsStore.retryPosts">
          Retry
        </button>
      </div>

      <div v-else-if="postsStore.posts.length === 0" class="posts-state">
        No posts are available.
      </div>

      <div v-else-if="filteredPosts.length === 0" class="posts-state">
        No matching results.
      </div>

      <div v-if="postsStore.deleteError" class="form-status error">
        {{ postsStore.deleteError }}
      </div>

      <div v-else class="posts-grid">
        <article v-for="post in filteredPosts" :key="post.id" class="post-card">
          <span> Post #{{ post.id }} </span>

          <h3>
            {{ post.title }}
          </h3>

          <p>
            {{ post.body }}
          </p>

          <div class="post-meta">
            <p>
              <strong>Status:</strong>
              {{ post.status }}
            </p>

            <p>
              <strong>Category:</strong>
              {{ post.category?.name || "No category" }}
            </p>

            <p>
              <strong>Author:</strong>
              {{ post.author?.name || "Unknown author" }}
            </p>
          </div>

          <div class="post-actions">
            <button
              v-if="isAuthenticated"
              class="button favorite-button"
              :class="{
                'is-favorite': postsStore.isFavorite(post.id),
              }"
              type="button"
              @click="postsStore.toggleFavorite(post.id)"
            >
              {{ postsStore.isFavorite(post.id) ? "Unfavorite" : "Favorite" }}
            </button>

            <button
              v-if="isOwner(post)"
              class="button"
              type="button"
              @click="editPost(post.id)"
            >
              Edit
            </button>

            <button
              v-if="isOwner(post)"
              class="button"
              type="button"
              :disabled="postsStore.deleting"
              @click="deletePost(post.id)"
            >
              {{ postsStore.deleting ? "Deleting..." : "Delete" }}
            </button>

            <RouterLink class="button" :to="`/posts/${post.id}`">
              View Details
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
