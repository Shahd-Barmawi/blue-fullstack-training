<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="cms-block cms-hero-block">
    <div class="cms-block-inner">
      <h1>
        {{ content.heading || "Welcome" }}
      </h1>

      <p v-if="content.subheading">
        {{ content.subheading }}
      </p>
    </div>
  </section>
</template>
