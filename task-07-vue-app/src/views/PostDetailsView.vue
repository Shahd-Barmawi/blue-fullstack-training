<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const post = ref(null);
const loading = ref(false);
const error = ref("");

const loadPost = async () => {
  loading.value = true;
  error.value = "";
  post.value = null;

  const postId = route.params.id;

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );

    if (!response.ok) {
      throw new Error("Post not found");
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error("Post not found");
    }

    post.value = data;
  } catch (err) {
    error.value = "Unable to load this post.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goBackToPosts = () => {
  router.push("/posts");
};

onMounted(() => {
  loadPost();
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div v-if="loading">Loading post...</div>

      <div v-else-if="error">
        <p>{{ error }}</p>

        <button class="button" type="button" @click="loadPost">Retry</button>

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
