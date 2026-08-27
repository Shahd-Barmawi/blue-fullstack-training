<script setup>
import { computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import { usePagesStore } from "../stores/pages";

const route = useRoute();
const router = useRouter();
const pagesStore = usePagesStore();

const isEditMode = computed(() => Boolean(route.params.id));

const form = reactive({
  title: "",
  slug: "",
  content: "",
  status: "draft",
});

const validationErrors = computed(() => {
  return isEditMode.value
    ? pagesStore.updateValidationErrors
    : pagesStore.createValidationErrors;
});

const formError = computed(() => {
  return isEditMode.value ? pagesStore.updateError : pagesStore.createError;
});

const submitting = computed(() => {
  return isEditMode.value ? pagesStore.updating : pagesStore.creating;
});

const loadPageForEditing = async () => {
  if (!isEditMode.value) {
    return;
  }

  const success = await pagesStore.loadManagementPages();

  if (!success) {
    return;
  }

  const page = pagesStore.managementPages.find(
    (item) => item.id === Number(route.params.id),
  );

  if (!page) {
    pagesStore.updateError = "Page not found.";
    return;
  }

  form.title = page.title;
  form.slug = page.slug;
  form.content = page.content;
  form.status = page.status;
};

const submitForm = async () => {
  if (isEditMode.value) {
    const success = await pagesStore.updatePage(route.params.id, { ...form });

    if (success) {
      router.push("/manage/pages");
    }

    return;
  }

  const success = await pagesStore.createPage({ ...form });

  if (success) {
    router.push("/manage/pages");
  }
};

onMounted(() => {
  pagesStore.clearCreateState();
  pagesStore.clearUpdateState();

  loadPageForEditing();
});
</script>

<template>
  <main class="page-form-page">
    <section class="section">
      <div class="container">
        <p class="section-label">CMS Management</p>

        <h1 class="section-title">
          {{ isEditMode ? "Edit Page" : "Create Page" }}
        </h1>

        <p class="section-description">
          {{
            isEditMode
              ? "Update the page content and publishing status."
              : "Create a new CMS page."
          }}
        </p>

        <div v-if="formError" class="form-status error">
          {{ formError }}
        </div>

        <form class="post-form" @submit.prevent="submitForm">
          <!-- Title -->
          <div class="form-group">
            <label for="page-title"> Title </label>

            <input
              id="page-title"
              v-model="form.title"
              type="text"
              placeholder="Enter page title"
            />

            <p v-if="validationErrors.title" class="field-error">
              {{ validationErrors.title[0] }}
            </p>
          </div>

          <!-- Slug -->
          <div class="form-group">
            <label for="page-slug"> Slug </label>

            <input
              id="page-slug"
              v-model="form.slug"
              type="text"
              placeholder="example-page"
            />

            <p v-if="validationErrors.slug" class="field-error">
              {{ validationErrors.slug[0] }}
            </p>
          </div>

          <!-- Content -->
          <div class="form-group">
            <label for="page-content"> Content </label>

            <textarea
              id="page-content"
              v-model="form.content"
              rows="10"
              placeholder="Enter page content"
            ></textarea>

            <p v-if="validationErrors.content" class="field-error">
              {{ validationErrors.content[0] }}
            </p>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label for="page-status"> Status </label>

            <select id="page-status" v-model="form.status">
              <option value="draft">Draft</option>

              <option value="published">Published</option>
            </select>

            <p v-if="validationErrors.status" class="field-error">
              {{ validationErrors.status[0] }}
            </p>
          </div>

          <div class="post-actions">
            <button class="button" type="submit" :disabled="submitting">
              {{
                submitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Page"
                    : "Create Page"
              }}
            </button>

            <RouterLink class="button" to="/manage/pages"> Cancel </RouterLink>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>
