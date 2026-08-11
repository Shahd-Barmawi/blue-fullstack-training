<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePosts } from "../composables/usePosts";

const route = useRoute();
const router = useRouter();

const { post, loading, error, loadPostById } = usePosts();

const goBackToPosts = () => {
  router.push("/posts");
};

onMounted(() => {
  loadPostById(route.params.id);
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div v-if="loading">Loading post...</div>

      <div v-else-if="error">
        <p>{{ error }}</p>

        <button
          class="button"
          type="button"
          @click="loadPostById(route.params.id)"
        >
          Retry
        </button>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </div>

      <article v-else-if="post" class="post-card">
        <span> Post #{{ post.id }} </span>

        <h1>
          {{ post.title }}
        </h1>

        <p>
          {{ post.body }}
        </p>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </article>
    </div>
  </section>
</template>
