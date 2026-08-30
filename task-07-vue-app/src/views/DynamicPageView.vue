<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import { usePagesStore } from "../stores/pages";

import HeroBlock from "../components/blocks/HeroBlock.vue";
import TextBlock from "../components/blocks/TextBlock.vue";
import CallToActionBlock from "../components/blocks/CallToActionBlock.vue";
import FeatureListBlock from "../components/blocks/FeatureListBlock.vue";

const route = useRoute();
const pagesStore = usePagesStore();

/*
|--------------------------------------------------------------------------
| Supported Content Block Components
|--------------------------------------------------------------------------
*/

const blockComponents = {
  hero: HeroBlock,
  text: TextBlock,
  call_to_action: CallToActionBlock,
  feature_list: FeatureListBlock,
};

/*
|--------------------------------------------------------------------------
| Page Content Blocks
|--------------------------------------------------------------------------
*/

const contentBlocks = computed(() => {
  const blocks = pagesStore.selectedPage?.content_blocks;

  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks;
});

const getBlockComponent = (type) => {
  return blockComponents[type] || null;
};

/*
|--------------------------------------------------------------------------
| Load Current Page
|--------------------------------------------------------------------------
*/

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
    <!-- Loading -->
    <section v-if="pagesStore.loading" class="section">
      <div class="container">
        <div class="posts-state">Loading page...</div>
      </div>
    </section>

    <!-- Error -->
    <section v-else-if="pagesStore.error" class="section">
      <div class="container">
        <div class="posts-state">
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
      </div>
    </section>

    <!-- Dynamic Page -->
    <template v-else-if="pagesStore.selectedPage">
      <!-- Page Information -->
      <section class="section dynamic-page-heading">
        <div class="container">
          <p class="section-label">Dynamic Page</p>

          <h1 class="section-title">
            {{ pagesStore.selectedPage.title }}
          </h1>

          <p class="dynamic-page-slug">
            /pages/{{ pagesStore.selectedPage.slug }}
          </p>
        </div>
      </section>

      <!-- Dynamic Content Blocks -->
      <section v-if="contentBlocks.length > 0" class="dynamic-blocks">
        <template v-for="block in contentBlocks" :key="block.id">
          <component
            :is="getBlockComponent(block.type)"
            v-if="getBlockComponent(block.type)"
            :content="block.content"
          />
        </template>
      </section>

      <!-- Fallback for pages without blocks -->
      <section v-else class="section">
        <div class="container">
          <div class="dynamic-page-content">
            <div class="dynamic-page-body">
              {{ pagesStore.selectedPage.content }}
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Fallback -->
    <section v-else class="section">
      <div class="container">
        <div class="posts-state">Page not found.</div>
      </div>
    </section>
  </main>
</template>
