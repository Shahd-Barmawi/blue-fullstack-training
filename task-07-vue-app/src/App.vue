<script setup>
import SiteHeader from "./components/SiteHeader.vue";
import FooterSection from "./components/SiteFooter.vue";
</script>

<template>
  <SiteHeader />

  <RouterView />

  <FooterSection />
</template>
