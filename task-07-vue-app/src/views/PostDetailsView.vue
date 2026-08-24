<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { usePostsStore } from "../stores/posts";
import { useAuthState } from "../composables/useAuthState";
import { useCategories } from "../composables/useCategories";

const route = useRoute();
const router = useRouter();

const postsStore = usePostsStore();

const { isAuthenticated, user } = useAuthState();

const { categories, categoriesLoading, categoriesError, loadCategories } =
  useCategories();

const isEditing = ref(false);

const editTitle = ref("");
const editBody = ref("");
const editStatus = ref("draft");
const editCategoryId = ref("");

const currentPost = computed(() => {
  const postId = Number(route.params.id);

  const postFromCurrentPage = postsStore.posts.find(
    (post) => post.id === postId,
  );

  if (postFromCurrentPage) {
    return postFromCurrentPage;
  }

  if (postsStore.selectedPost?.id === postId) {
    return postsStore.selectedPost;
  }

  return null;
});

/*
 * The user can edit/delete only their own post.
 */
const isOwner = computed(() => {
  if (!isAuthenticated.value || !user.value || !currentPost.value) {
    return false;
  }

  return Number(currentPost.value.author?.id) === Number(user.value.id);
});

const goBackToPosts = () => {
  router.push("/posts");
};

const populateEditForm = () => {
  if (!currentPost.value) {
    return;
  }

  editTitle.value = currentPost.value.title;

  editBody.value = currentPost.value.body;

  editStatus.value = currentPost.value.status;

  editCategoryId.value =
    currentPost.value.category?.id || currentPost.value.category_id || "";
};

const startEditing = () => {
  if (!isOwner.value) {
    return;
  }

  postsStore.clearUpdateState();
  postsStore.clearDeleteState();

  populateEditForm();

  isEditing.value = true;
};

const cancelEditing = () => {
  postsStore.clearUpdateState();

  populateEditForm();

  isEditing.value = false;
};

const saveUpdate = async () => {
  if (!isOwner.value || !currentPost.value) {
    return;
  }

  postsStore.clearUpdateState();

  const postData = {
    title: editTitle.value.trim(),
    body: editBody.value.trim(),
    status: editStatus.value,
    category_id: Number(editCategoryId.value),
  };

  const success = await postsStore.updatePost(currentPost.value.id, postData);

  if (success) {
    isEditing.value = false;
  }
};

const deletePost = async () => {
  if (!isOwner.value || !currentPost.value) {
    return;
  }

  postsStore.clearDeleteState();

  const confirmed = window.confirm(
    "Are you sure you want to delete this post?",
  );

  if (!confirmed) {
    return;
  }

  const success = await postsStore.deletePost(currentPost.value.id);

  if (success) {
    await router.push("/posts");
  }
};

const openEditFromQuery = () => {
  if (route.query.edit === "1" && isOwner.value) {
    populateEditForm();

    isEditing.value = true;
  }
};

watch(editTitle, () => {
  if (postsStore.updateValidationErrors.title) {
    postsStore.updateValidationErrors.title = [];
  }
});

watch(editBody, () => {
  if (postsStore.updateValidationErrors.body) {
    postsStore.updateValidationErrors.body = [];
  }
});

watch(editCategoryId, () => {
  if (postsStore.updateValidationErrors.category_id) {
    postsStore.updateValidationErrors.category_id = [];
  }
});

watch(editStatus, () => {
  if (postsStore.updateValidationErrors.status) {
    postsStore.updateValidationErrors.status = [];
  }
});

onMounted(async () => {
  const postId = Number(route.params.id);

  postsStore.clearDeleteState();
  postsStore.clearUpdateState();

  if (!currentPost.value) {
    await postsStore.loadPost(postId);
  }

  populateEditForm();

  openEditFromQuery();
});
</script>

<template>
  <section class="section">
    <div class="container">
      <!-- Loading -->
      <div v-if="postsStore.loading">Loading post...</div>

      <!-- Load Error -->
      <div v-else-if="postsStore.error && !currentPost">
        <p>
          {{ postsStore.error }}
        </p>

        <button
          class="button"
          type="button"
          @click="postsStore.loadPost(Number(route.params.id))"
        >
          Retry
        </button>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </div>

      <!-- Post -->
      <article v-else-if="currentPost" class="post-card">
        <!-- Normal View -->
        <template v-if="!isEditing">
          <span> Post #{{ currentPost.id }} </span>

          <h1>
            {{ currentPost.title }}
          </h1>

          <p>
            {{ currentPost.body }}
          </p>

          <div class="post-meta">
            <p>
              <strong>Status:</strong>
              {{ currentPost.status }}
            </p>

            <p>
              <strong>Category:</strong>
              {{ currentPost.category?.name || "No category" }}
            </p>

            <p>
              <strong>Author:</strong>
              {{ currentPost.author?.name || "Unknown author" }}
            </p>
          </div>

          <!-- Update Success -->
          <div v-if="postsStore.updatedPost" class="form-status success">
            Post updated successfully!
          </div>

          <!-- Delete Error -->
          <div v-if="postsStore.deleteError" class="form-status error">
            {{ postsStore.deleteError }}
          </div>

          <div class="post-actions">
            <!-- Favorite: any authenticated user -->
            <button
              v-if="isAuthenticated"
              class="button favorite-button"
              :class="{
                'is-favorite': postsStore.isFavorite(currentPost.id),
              }"
              type="button"
              @click="postsStore.toggleFavorite(currentPost.id)"
            >
              {{
                postsStore.isFavorite(currentPost.id)
                  ? "Unfavorite"
                  : "Favorite"
              }}
            </button>

            <!-- Edit: owner only -->
            <button
              v-if="isOwner"
              class="button"
              type="button"
              @click="startEditing"
            >
              Edit Post
            </button>

            <!-- Delete: owner only -->
            <button
              v-if="isOwner"
              class="button"
              type="button"
              :disabled="postsStore.deleting"
              @click="deletePost"
            >
              {{ postsStore.deleting ? "Deleting..." : "Delete Post" }}
            </button>

            <button class="button" type="button" @click="goBackToPosts">
              Back to Posts
            </button>
          </div>
        </template>

        <!-- Edit View -->
        <template v-else>
          <h2>Edit Post #{{ currentPost.id }}</h2>

          <!-- Title -->
          <div class="form-group">
            <label for="edit-title"> Title </label>

            <input
              id="edit-title"
              v-model="editTitle"
              class="form-control"
              :class="{
                'is-invalid': postsStore.updateValidationErrors.title?.length,
              }"
              type="text"
              :disabled="postsStore.updating"
            />

            <p
              v-if="postsStore.updateValidationErrors.title?.length"
              class="error-message"
            >
              {{ postsStore.updateValidationErrors.title[0] }}
            </p>
          </div>

          <!-- Body -->
          <div class="form-group">
            <label for="edit-body"> Body </label>

            <textarea
              id="edit-body"
              v-model="editBody"
              class="form-control"
              :class="{
                'is-invalid': postsStore.updateValidationErrors.body?.length,
              }"
              rows="6"
              maxlength="500"
              :disabled="postsStore.updating"
            ></textarea>

            <p
              v-if="postsStore.updateValidationErrors.body?.length"
              class="error-message"
            >
              {{ postsStore.updateValidationErrors.body[0] }}
            </p>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label for="edit-category"> Category </label>

            <p v-if="categoriesLoading">Loading categories...</p>

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
              id="edit-category"
              v-model="editCategoryId"
              class="form-control"
              :class="{
                'is-invalid':
                  postsStore.updateValidationErrors.category_id?.length,
              }"
              :disabled="postsStore.updating"
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

            <p
              v-if="postsStore.updateValidationErrors.category_id?.length"
              class="error-message"
            >
              {{ postsStore.updateValidationErrors.category_id[0] }}
            </p>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label for="edit-status"> Status </label>

            <select
              id="edit-status"
              v-model="editStatus"
              class="form-control"
              :disabled="postsStore.updating"
            >
              <option value="draft">Draft</option>

              <option value="published">Published</option>
            </select>

            <p
              v-if="postsStore.updateValidationErrors.status?.length"
              class="error-message"
            >
              {{ postsStore.updateValidationErrors.status[0] }}
            </p>
          </div>

          <!-- Update Error -->
          <div v-if="postsStore.updateError" class="form-status error">
            {{ postsStore.updateError }}
          </div>

          <div class="post-actions">
            <button
              class="button"
              type="button"
              :disabled="postsStore.updating"
              @click="saveUpdate"
            >
              {{ postsStore.updating ? "Saving..." : "Save Changes" }}
            </button>

            <button
              class="button"
              type="button"
              :disabled="postsStore.updating"
              @click="cancelEditing"
            >
              Cancel
            </button>
          </div>
        </template>
      </article>

      <!-- Not Found -->
      <div v-else>
        <p>Post not found.</p>

        <button class="button" type="button" @click="goBackToPosts">
          Back to Posts
        </button>
      </div>
    </div>
  </section>
</template>
