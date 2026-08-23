<script setup>
import { usePosts } from "../composables/usePosts";
import { useAuthState } from "../composables/useAuthState";

const { postsStore, searchTerm, filteredPosts, resetSearch } = usePosts();

const { isAuthenticated } = useAuthState();
</script>

<template>
  <section id="posts" class="posts section">
    <div class="container">
      <p class="section-label">Latest Posts</p>

      <h2 class="section-title">Latest Resources</h2>

      <p class="section-description">
        Browse the latest articles loaded dynamically from a REST API.
      </p>

      <div v-if="isAuthenticated" class="posts-actions">
        <RouterLink class="button" to="/posts/create"> + New Post </RouterLink>
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
        <p>{{ postsStore.error }}</p>

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

      <div v-else class="posts-grid">
        <article v-for="post in filteredPosts" :key="post.id" class="post-card">
          <span> Post #{{ post.id }} </span>

          <h3>
            {{ post.title }}
          </h3>

          <p>
            {{ post.body }}
          </p>

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

            <RouterLink class="button" :to="`/posts/${post.id}`">
              View Details
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
