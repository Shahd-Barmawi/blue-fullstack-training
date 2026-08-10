<script setup>
import { ref, computed, onMounted } from "vue";

const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";

const posts = ref([]);
const loading = ref(false);
const error = ref("");
const searchTerm = ref("");

const filteredPosts = computed(() => {
  const value = searchTerm.value.trim().toLowerCase();

  if (!value) {
    return posts.value;
  }

  return posts.value.filter((post) => post.title.toLowerCase().includes(value));
});

const fetchPosts = async () => {
  loading.value = true;
  error.value = "";
  posts.value = [];

  try {
    const response = await fetch(POSTS_API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    posts.value = data.slice(0, 12);
  } catch (err) {
    error.value = "Unable to load posts. Please try again.";

    console.error(err);
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  searchTerm.value = "";
};

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <section id="posts" class="posts section">
    <div class="container">
      <p class="section-label">Latest Posts</p>

      <h2 class="section-title">Latest Resources</h2>

      <p class="section-description">
        Browse the latest articles loaded dynamically from a REST API.
      </p>

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

      <div v-if="loading" class="posts-state">Loading posts...</div>

      <div v-else-if="error" class="posts-state">
        <p>{{ error }}</p>

        <button class="button" type="button" @click="fetchPosts">Retry</button>
      </div>

      <div v-else-if="posts.length === 0" class="posts-state">
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
        </article>
      </div>
    </div>
  </section>
</template>
