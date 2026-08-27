<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import { usePagesStore } from "../stores/pages";

const route = useRoute();
const pagesStore = usePagesStore();

const loadCurrentPage = async () => {
  const slug = String(route.params.slug || "").trim();

  if (!slug) {
    pagesStore.error = "Page not found.";
    pagesStore.selectedPage = null;

    return;
  }

  await pagesStore.loadPageBySlug(slug);
};

onMounted(() => {
  loadCurrentPage();
});

watch(
  () => route.params.slug,
  () => {
    loadCurrentPage();
  },
);
</script>

<template>
  <main class="dynamic-page">
    <section class="section">
      <div class="container">
        <!-- Loading -->
        <div v-if="pagesStore.loading" class="posts-state">Loading page...</div>

        <!-- Error -->
        <div v-else-if="pagesStore.error" class="posts-state">
          <p>
            {{ pagesStore.error }}
          </p>

          <button
            v-if="pagesStore.error !== 'Page not found.'"
            class="button"
            type="button"
            @click="loadCurrentPage"
          >
            Retry
          </button>

          <RouterLink class="button" to="/"> Back to Home </RouterLink>
        </div>

        <!-- Page -->
        <article
          v-else-if="pagesStore.selectedPage"
          class="dynamic-page-content"
        >
          <p class="section-label">Dynamic Page</p>

          <h1 class="section-title">
            {{ pagesStore.selectedPage.title }}
          </h1>

          <p class="dynamic-page-slug">
            /pages/{{ pagesStore.selectedPage.slug }}
          </p>

          <div class="dynamic-page-body">
            {{ pagesStore.selectedPage.content }}
          </div>
        </article>

        <!-- Fallback -->
        <div v-else class="posts-state">Page not found.</div>
      </div>
    </section>
  </main>
</template>
