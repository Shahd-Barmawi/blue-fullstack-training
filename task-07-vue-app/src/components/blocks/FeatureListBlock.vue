<script setup>
import { computed } from "vue";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const features = computed(() => {
  return Array.isArray(props.content.features) ? props.content.features : [];
});
</script>

<template>
  <section class="cms-block cms-features-block">
    <div class="cms-block-inner">
      <h2 v-if="content.heading">
        {{ content.heading }}
      </h2>

      <div v-if="features.length" class="cms-features-list">
        <article
          v-for="(feature, index) in features"
          :key="index"
          class="cms-feature-item"
        >
          <h3 v-if="feature.title">
            {{ feature.title }}
          </h3>

          <p v-if="feature.description">
            {{ feature.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
