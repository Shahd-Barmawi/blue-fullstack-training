<script setup>
import { ref, computed, watch } from "vue";

import { usePostsStore } from "../stores/posts";
import { useCategories } from "../composables/useCategories";

import backArrow from "../assets/back-arrow.jpg";

const postsStore = usePostsStore();

const { categories, categoriesLoading, categoriesError, loadCategories } =
  useCategories();

const title = ref("");
const body = ref("");
const categoryId = ref("");
const status = ref("draft");

const titleError = ref("");
const bodyError = ref("");
const categoryError = ref("");

const bodyCharacterCount = computed(() => {
  return body.value.length;
});

const validateTitle = () => {
  if (!title.value.trim()) {
    titleError.value = "Title is required.";
  } else if (title.value.trim().length < 5) {
    titleError.value = "Title must be at least 5 characters.";
  } else {
    titleError.value = "";
  }
};

const validateBody = () => {
  if (!body.value.trim()) {
    bodyError.value = "Body is required.";
  } else if (body.value.trim().length < 10) {
    bodyError.value = "Body must be at least 10 characters.";
  } else {
    bodyError.value = "";
  }
};

const validateCategory = () => {
  if (!categoryId.value) {
    categoryError.value = "Category is required.";
  } else {
    categoryError.value = "";
  }
};

watch(title, () => {
  if (titleError.value) {
    validateTitle();
  }
});

watch(body, () => {
  if (bodyError.value) {
    validateBody();
  }
});

watch(categoryId, () => {
  if (categoryError.value) {
    validateCategory();
  }
});

const validateForm = () => {
  validateTitle();
  validateBody();
  validateCategory();

  return !titleError.value && !bodyError.value && !categoryError.value;
};

const getPostData = () => {
  return {
    title: title.value.trim(),
    body: body.value.trim(),
    status: status.value,
    category_id: Number(categoryId.value),
  };
};

const resetForm = () => {
  title.value = "";
  body.value = "";
  categoryId.value = "";
  status.value = "draft";

  titleError.value = "";
  bodyError.value = "";
  categoryError.value = "";
};

const handleSubmit = async () => {
  postsStore.submitError = "";
  postsStore.createdPost = null;

  if (!validateForm()) {
    return;
  }

  const success = await postsStore.submitPost(getPostData());

  if (success) {
    resetForm();
  }
};

const retrySubmit = async () => {
  postsStore.submitError = "";

  if (!validateForm()) {
    return;
  }

  const success = await postsStore.submitPost(getPostData());

  if (success) {
    resetForm();
  }
};

const createAnotherPost = () => {
  postsStore.clearCreatedPost();

  resetForm();
};
</script>

<template>
  <section class="section">
    <div class="container create-post-container">
      <p class="section-label">Create Post</p>

      <h2 class="section-title">Add a New Post</h2>

      <p class="section-description">
        Complete the form below to create a new post.
      </p>

      <div class="create-post-navigation">
        <RouterLink class="create-post-back-link" to="/posts">
          <img :src="backArrow" class="back-arrow-icon" alt="" />

          <span> Back to Posts </span>
        </RouterLink>
      </div>

      <form class="create-post-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="post-title"> Title </label>

          <input
            id="post-title"
            v-model="title"
            class="form-control"
            :class="{
              'is-invalid': titleError,
            }"
            type="text"
            placeholder="Enter post title"
            :disabled="postsStore.submitting"
          />

          <p v-if="titleError" class="error-message">
            {{ titleError }}
          </p>
        </div>

        <div class="form-group">
          <label for="post-body"> Body </label>

          <textarea
            id="post-body"
            v-model="body"
            class="form-control"
            :class="{
              'is-invalid': bodyError,
            }"
            rows="6"
            maxlength="500"
            placeholder="Enter post content"
            :disabled="postsStore.submitting"
          ></textarea>

          <div class="message-details">
            <p v-if="bodyError" class="error-message">
              {{ bodyError }}
            </p>

            <span v-else></span>

            <span class="character-count">
              {{ bodyCharacterCount }} / 500
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="post-category"> Category </label>

          <p v-if="categoriesLoading" class="form-status">
            Loading categories...
          </p>

          <div v-else-if="categoriesError" class="form-status error">
            <p>
              {{ categoriesError }}
            </p>

            <button class="button" type="button" @click="loadCategories">
              Retry
            </button>
          </div>

          <select
            v-else
            id="post-category"
            v-model="categoryId"
            class="form-control"
            :class="{
              'is-invalid': categoryError,
            }"
            :disabled="postsStore.submitting"
          >
            <option value="">Select a category</option>

            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>

          <p v-if="categoryError" class="error-message">
            {{ categoryError }}
          </p>
        </div>

        <div class="form-group">
          <label for="post-status"> Status </label>

          <select
            id="post-status"
            v-model="status"
            class="form-control"
            :disabled="postsStore.submitting"
          >
            <option value="draft">Draft</option>

            <option value="published">Published</option>
          </select>
        </div>

        <div v-if="postsStore.submitError" class="form-status error">
          <p>
            {{ postsStore.submitError }}
          </p>

          <button
            class="button"
            type="button"
            :disabled="postsStore.submitting"
            @click="retrySubmit"
          >
            {{ postsStore.submitting ? "Retrying..." : "Retry" }}
          </button>
        </div>

        <div v-if="postsStore.createdPost" class="form-status success">
          <p>Post created successfully!</p>

          <p>
            Returned Post ID:
            {{ postsStore.createdPost.id }}
          </p>

          <button class="button" type="button" @click="createAnotherPost">
            Create Another Post
          </button>
        </div>

        <button
          v-if="!postsStore.createdPost && !postsStore.submitError"
          class="button create-post-button"
          type="submit"
          :disabled="postsStore.submitting"
        >
          {{ postsStore.submitting ? "Creating Post..." : "Create Post" }}
        </button>
      </form>
    </div>
  </section>
</template>
