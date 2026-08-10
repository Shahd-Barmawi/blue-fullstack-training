<script setup>
defineProps({
  number: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <article class="card service-card">
    <span class="service-number">
      {{ number }}
    </span>

    <h3>
      {{ title }}
    </h3>

    <p>
      {{ description }}
    </p>
  </article>
</template>
