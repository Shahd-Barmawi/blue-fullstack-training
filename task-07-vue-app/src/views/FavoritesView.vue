<script setup>
import { onMounted } from "vue";
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();

onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.loadPosts();
  }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <p class="section-label">Favorites</p>

      <h2 class="section-title">Your Favorite Posts</h2>

      <p class="section-description">
        Posts you saved as favorites will appear here.
      </p>

      <div v-if="postsStore.loading" class="posts-state">
        Loading favorite posts...
      </div>

      <div v-else-if="postsStore.error" class="posts-state">
        <p>{{ postsStore.error }}</p>

        <button class="button" type="button" @click="postsStore.loadPosts">
          Retry
        </button>
      </div>

      <div
        v-else-if="postsStore.favoritePosts.length === 0"
        class="posts-state"
      >
        <p>No favorite posts yet.</p>

        <RouterLink class="button" to="/posts"> Browse Posts </RouterLink>
      </div>

      <div v-else class="posts-grid">
        <article
          v-for="post in postsStore.favoritePosts"
          :key="post.id"
          class="post-card"
        >
          <span> Post #{{ post.id }} </span>

          <h3>
            {{ post.title }}
          </h3>

          <p>
            {{ post.body }}
          </p>

          <div class="post-actions">
            <button
              class="button favorite-button is-favorite"
              type="button"
              @click="postsStore.toggleFavorite(post.id)"
            >
              Unfavorite
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
