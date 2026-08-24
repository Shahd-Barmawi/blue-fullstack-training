<script setup>
import { computed, onMounted } from "vue";

import { useRouter } from "vue-router";

import { usePostsStore } from "../stores/posts";
import { useAuthState } from "../composables/useAuthState";

const router = useRouter();

const postsStore = usePostsStore();

const { user } = useAuthState();

const myPosts = computed(() => {
  if (!user.value) {
    return [];
  }

  return postsStore.posts.filter((post) => post.author?.id === user.value.id);
});

const editPost = (postId) => {
  router.push({
    path: `/posts/${postId}`,
    query: {
      edit: "1",
    },
  });
};

const viewPost = (postId) => {
  router.push(`/posts/${postId}`);
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

onMounted(async () => {
  if (postsStore.posts.length === 0) {
    await postsStore.loadPosts();
  }
});
</script>

<template>
  <section class="posts section">
    <div class="container">
      <p class="section-label">My Posts</p>

      <h2 class="section-title">My Resources</h2>

      <p class="section-description">
        Manage the posts created by your account.
      </p>

      <div class="posts-actions">
        <RouterLink class="button" to="/posts/create"> + New Post </RouterLink>

        <RouterLink class="button" to="/posts"> All Posts </RouterLink>
      </div>

      <div v-if="postsStore.loading" class="posts-state">
        Loading your posts...
      </div>

      <div v-else-if="postsStore.error" class="posts-state">
        <p>
          {{ postsStore.error }}
        </p>

        <button class="button" type="button" @click="postsStore.loadPosts">
          Retry
        </button>
      </div>

      <div v-else-if="postsStore.deleteError" class="form-status error">
        {{ postsStore.deleteError }}
      </div>

      <div v-else-if="myPosts.length === 0" class="posts-state">
        You have not created any posts yet.
      </div>

      <div v-else class="posts-grid">
        <article v-for="post in myPosts" :key="post.id" class="post-card">
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
            <button class="button" type="button" @click="editPost(post.id)">
              Edit
            </button>

            <button
              class="button"
              type="button"
              :disabled="postsStore.deleting"
              @click="deletePost(post.id)"
            >
              {{ postsStore.deleting ? "Deleting..." : "Delete" }}
            </button>

            <button class="button" type="button" @click="viewPost(post.id)">
              View Details
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
