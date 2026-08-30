<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="cms-block cms-text-block">
    <div class="cms-block-inner">
      <h2 v-if="content.heading">
        {{ content.heading }}
      </h2>

      <p>
        {{ content.text || "" }}
      </p>
    </div>
  </section>
</template>
