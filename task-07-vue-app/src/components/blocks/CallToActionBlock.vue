<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="cms-block cms-cta-block">
    <div class="cms-block-inner">
      <h2 v-if="content.heading">
        {{ content.heading }}
      </h2>

      <p v-if="content.text">
        {{ content.text }}
      </p>

      <RouterLink
        v-if="content.button_text && content.button_url"
        class="button"
        :to="content.button_url"
      >
        {{ content.button_text }}
      </RouterLink>
    </div>
  </section>
</template>
