<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["view-details"]);

const handleViewDetails = () => {
  emit("view-details", props.project);
};
</script>

<template>
  <article class="project-card">
    <span class="project-category">
      {{ project.category }}
    </span>

    <h3>{{ project.title }}</h3>

    <p>{{ project.description }}</p>

    <button class="button" type="button" @click="handleViewDetails">
      View Details
    </button>
  </article>
</template>
