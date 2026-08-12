<script setup>
import { onMounted } from "vue";
import SiteHeader from "./components/SiteHeader.vue";
import FooterSection from "./components/SiteFooter.vue";
import { usePostsStore } from "./stores/posts";

const postsStore = usePostsStore();

onMounted(() => {
  postsStore.restoreFavorites();
});
</script>

<template>
  <SiteHeader />

  <RouterView />

  <FooterSection />
</template>
