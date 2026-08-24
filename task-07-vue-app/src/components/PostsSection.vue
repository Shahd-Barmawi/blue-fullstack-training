<script setup>
import { useRouter } from "vue-router";

import { usePosts } from "../composables/usePosts";
import { useAuthState } from "../composables/useAuthState";

const router = useRouter();

const {
  postsStore,

  searchTerm,
  filteredPosts,

  resetSearch,

  changePage,
  nextPage,
  previousPage,
} = usePosts();

const { isAuthenticated, user } = useAuthState();

const isOwner = (post) => {
  return (
    isAuthenticated.value &&
    user.value &&
    Number(post.author?.id) === Number(user.value.id)
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

      <!-- Authenticated actions -->
      <div v-if="isAuthenticated" class="posts-actions">
        <RouterLink class="button" to="/posts/create"> + New Post </RouterLink>

        <RouterLink class="button" to="/my-posts"> My Posts </RouterLink>
      </div>

      <!-- Backend Search -->
      <div class="posts-search">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search posts..."
          aria-label="Search posts"
        />

        <button type="button" @click="resetSearch">Reset</button>
      </div>

      <!-- Backend result information -->
      <p class="posts-result-count">
        {{ postsStore.totalPosts }}
        total posts
      </p>

      <!-- Loading -->
      <div v-if="postsStore.loading" class="posts-state">Loading posts...</div>

      <!-- Error -->
      <div v-else-if="postsStore.error" class="posts-state">
        <p>
          {{ postsStore.error }}
        </p>

        <button class="button" type="button" @click="postsStore.retryPosts">
          Retry
        </button>
      </div>

      <!-- Empty backend result -->
      <div v-else-if="filteredPosts.length === 0" class="posts-state">
        {{
          searchTerm.trim() ? "No matching results." : "No posts are available."
        }}
      </div>

      <!-- Delete Error -->
      <div v-if="postsStore.deleteError" class="form-status error">
        {{ postsStore.deleteError }}
      </div>

      <!-- Posts -->
      <div
        v-if="
          !postsStore.loading && !postsStore.error && filteredPosts.length > 0
        "
        class="posts-grid"
      >
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
              <strong> Status: </strong>

              {{ post.status }}
            </p>

            <p>
              <strong> Category: </strong>

              {{ post.category?.name || "No category" }}
            </p>

            <p>
              <strong> Author: </strong>

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

      <!-- Backend Pagination -->
      <div
        v-if="
          !postsStore.loading && !postsStore.error && postsStore.lastPage > 1
        "
        class="posts-pagination"
      >
        <button
          class="button"
          type="button"
          :disabled="!postsStore.hasPreviousPage"
          @click="previousPage"
        >
          Previous
        </button>

        <button
          v-for="page in postsStore.lastPage"
          :key="page"
          class="button pagination-page"
          :class="{
            active: page === postsStore.currentPage,
          }"
          type="button"
          :disabled="page === postsStore.currentPage"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="button"
          type="button"
          :disabled="!postsStore.hasNextPage"
          @click="nextPage"
        >
          Next
        </button>
      </div>

      <p
        v-if="!postsStore.loading && postsStore.totalPosts > 0"
        class="posts-page-info"
      >
        Page
        {{ postsStore.currentPage }}
        of
        {{ postsStore.lastPage }}
      </p>
    </div>
  </section>
</template>
