<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostsStore } from "../stores/posts";

const route = useRoute();
const router = useRouter();

const postsStore = usePostsStore();

const currentPost = computed(() => {
  const postId = Number(route.params.id);

  return postsStore.posts.find((post) => post.id === postId);
});

const goBackToPosts = () => {
  router.push("/posts");
};

onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.loadPosts();
  }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div v-if="postsStore.loading">Loading post...</div>

      <div v-else-if="postsStore.error">
        <p>
          {{ postsStore.error }}
        </p>

        <button class="button" type="button" @click="postsStore.loadPosts">
          Retry
        </button>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </div>

      <article v-else-if="currentPost" class="post-card">
        <span> Post #{{ currentPost.id }} </span>

        <h1>
          {{ currentPost.title }}
        </h1>

        <p>
          {{ currentPost.body }}
        </p>

        <div class="post-actions">
          <button
            class="button favorite-button"
            :class="{
              'is-favorite': postsStore.isFavorite(currentPost.id),
            }"
            type="button"
            @click="postsStore.toggleFavorite(currentPost.id)"
          >
            {{
              postsStore.isFavorite(currentPost.id) ? "Unfavorite" : "Favorite"
            }}
          </button>

          <button class="button" type="button" @click="goBackToPosts">
            Back to Posts
          </button>
        </div>
      </article>

      <div v-else>
        <p>Post not found.</p>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </div>
    </div>
  </section>
</template>
