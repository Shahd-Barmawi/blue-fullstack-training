<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section class="cms-block cms-unsupported-block">
    <div class="cms-block-inner">
      <div class="cms-unsupported-message">
        <h2>Unsupported Content Block</h2>

        <p>
          This content block type is not supported:
          <strong>{{ type }}</strong>
        </p>
      </div>
    </div>
  </section>
</template>
