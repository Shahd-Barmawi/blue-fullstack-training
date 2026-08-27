<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { usePagesStore } from "../stores/pages";

const router = useRouter();
const pagesStore = usePagesStore();

onMounted(() => {
  pagesStore.loadManagementPages();
});

const createPage = () => {
  router.push("/manage/pages/create");
};

const editPage = (pageId) => {
  router.push(`/manage/pages/${pageId}/edit`);
};

const deletePage = async (pageId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this page?",
  );

  if (!confirmed) {
    return;
  }

  await pagesStore.deletePage(pageId);
};
</script>

<template>
  <main class="pages-management-page">
    <section class="section">
      <div class="container">
        <div class="pages-management-header">
          <div>
            <p class="section-label">CMS Management</p>

            <h1 class="section-title">Manage Pages</h1>

            <p class="section-description">
              Create, review, edit, and manage CMS pages.
            </p>
          </div>

          <button class="button" type="button" @click="createPage">
            + Create Page
          </button>
        </div>

        <!-- Loading -->
        <div v-if="pagesStore.loading" class="posts-state">
          Loading pages...
        </div>

        <!-- Error -->
        <div v-else-if="pagesStore.error" class="posts-state">
          <p>
            {{ pagesStore.error }}
          </p>

          <button
            class="button"
            type="button"
            @click="pagesStore.loadManagementPages"
          >
            Retry
          </button>
        </div>

        <!-- Delete Success -->
        <div v-if="pagesStore.deleteSuccess" class="form-status success">
          {{ pagesStore.deleteSuccess }}
        </div>

        <!-- Delete Error -->
        <div v-if="pagesStore.deleteError" class="form-status error">
          {{ pagesStore.deleteError }}
        </div>

        <!-- Empty -->
        <div
          v-if="
            !pagesStore.loading &&
            !pagesStore.error &&
            pagesStore.managementPages.length === 0
          "
          class="posts-state"
        >
          No pages have been created yet.
        </div>

        <!-- Pages List -->
        <div
          v-if="
            !pagesStore.loading &&
            !pagesStore.error &&
            pagesStore.managementPages.length > 0
          "
          class="posts-grid"
        >
          <article
            v-for="page in pagesStore.managementPages"
            :key="page.id"
            class="post-card"
          >
            <span> Page #{{ page.id }} </span>

            <h3>
              {{ page.title }}
            </h3>

            <p>
              <strong>Slug:</strong>
              {{ page.slug }}
            </p>

            <p>
              <strong>Status:</strong>
              {{ page.status }}
            </p>

            <p>
              {{ page.content }}
            </p>

            <div class="post-actions">
              <RouterLink
                v-if="page.status === 'published'"
                class="button"
                :to="`/pages/${page.slug}`"
              >
                View Public Page
              </RouterLink>

              <button class="button" type="button" @click="editPage(page.id)">
                Edit
              </button>

              <button
                class="button"
                type="button"
                :disabled="pagesStore.deleting"
                @click="deletePage(page.id)"
              >
                {{ pagesStore.deleting ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
