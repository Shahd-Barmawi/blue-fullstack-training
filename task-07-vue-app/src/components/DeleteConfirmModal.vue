<script setup>
import { onBeforeUnmount, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
    default: "Delete Post",
  },

  message: {
    type: String,
    default: "Are you sure you want to delete this post?",
  },
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  if (!props.loading) {
    emit("close");
  }
};

const confirmDelete = () => {
  emit("confirm");
};

const handleKeydown = (event) => {
  if (event.key === "Escape" && props.show) {
    closeModal();
  }
};

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeydown);
    }
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="delete-modal">
      <div v-if="show" class="delete-modal-overlay" @click.self="closeModal">
        <div
          class="delete-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <div class="delete-modal-icon" aria-hidden="true">!</div>

          <h3 id="delete-modal-title">
            {{ title }}
          </h3>

          <p id="delete-modal-description">
            {{ message }}
          </p>

          <p class="delete-modal-warning">This action cannot be undone.</p>

          <div class="delete-modal-actions">
            <button
              class="delete-modal-cancel"
              type="button"
              :disabled="loading"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              class="delete-modal-confirm"
              type="button"
              :disabled="loading"
              @click="confirmDelete"
            >
              {{ loading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
