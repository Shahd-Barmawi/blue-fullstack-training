<script setup>
import { ref, computed } from "vue";
import backArrow from "../assets/back-arrow.jpg";

const title = ref("");
const body = ref("");
const userId = ref("");

const titleError = ref("");
const bodyError = ref("");
const userIdError = ref("");

const bodyCharacterCount = computed(() => {
  return body.value.length;
});

const handleSubmit = () => {
  titleError.value = "";
  bodyError.value = "";
  userIdError.value = "";

  let isValid = true;

  if (!title.value.trim()) {
    titleError.value = "Title is required.";
    isValid = false;
  } else if (title.value.trim().length < 5) {
    titleError.value = "Title must be at least 5 characters.";
    isValid = false;
  }

  if (!body.value.trim()) {
    bodyError.value = "Body is required.";
    isValid = false;
  } else if (body.value.trim().length < 10) {
    bodyError.value = "Body must be at least 10 characters.";
    isValid = false;
  }

  const userIdNumber = Number(userId.value);

  if (userId.value === "") {
    userIdError.value = "User ID is required.";
    isValid = false;
  } else if (!Number.isInteger(userIdNumber) || userIdNumber <= 0) {
    userIdError.value = "User ID must be a positive number.";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  console.log("Valid form");
  console.log("Title:", title.value);
  console.log("Body:", body.value);
  console.log("User ID:", userId.value);
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

          <span>Back to Posts</span>
        </RouterLink>
      </div>

      <form class="create-post-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="post-title">Title</label>

          <input
            id="post-title"
            v-model="title"
            class="form-control"
            :class="{ 'is-invalid': titleError }"
            type="text"
            placeholder="Enter post title"
          />

          <p v-if="titleError" class="error-message">
            {{ titleError }}
          </p>
        </div>

        <div class="form-group">
          <label for="post-body">Body</label>

          <textarea
            id="post-body"
            v-model="body"
            class="form-control"
            :class="{ 'is-invalid': bodyError }"
            rows="6"
            maxlength="500"
            placeholder="Enter post content"
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
          <label for="user-id">User ID</label>

          <input
            id="user-id"
            v-model="userId"
            class="form-control"
            :class="{ 'is-invalid': userIdError }"
            type="number"
            placeholder="Enter user ID"
          />

          <p v-if="userIdError" class="error-message">
            {{ userIdError }}
          </p>
        </div>

        <button class="button create-post-button" type="submit">
          Create Post
        </button>
      </form>
    </div>
  </section>
</template>
