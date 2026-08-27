<script setup>
import { computed, onMounted, reactive, ref } from "vue";
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

/*
|--------------------------------------------------------------------------
| Block Form State
|--------------------------------------------------------------------------
*/

const editingBlockId = ref(null);

const blockForm = reactive({
  type: "hero",
  position: 0,
  contentText: "",
});

const blockTypeOptions = [
  {
    value: "hero",
    label: "Hero",
  },
  {
    value: "text",
    label: "Text",
  },
  {
    value: "call_to_action",
    label: "Call to Action",
  },
  {
    value: "feature_list",
    label: "Feature List",
  },
];

const blockFormTitle = computed(() => {
  return editingBlockId.value ? "Edit Content Block" : "Add Content Block";
});

const blockSubmitLabel = computed(() => {
  if (pagesStore.blockSubmitting) {
    return "Saving Block...";
  }

  return editingBlockId.value ? "Update Block" : "Add Block";
});

/*
|--------------------------------------------------------------------------
| Page Loading
|--------------------------------------------------------------------------
*/

const loadPageForEditing = async () => {
  if (!isEditMode.value) {
    return;
  }

  const page = await pagesStore.loadPageForManagement(route.params.id);

  if (!page) {
    pagesStore.updateError = pagesStore.blocksError || "Page not found.";

    return;
  }

  form.title = page.title;
  form.slug = page.slug;
  form.content = page.content;
  form.status = page.status;
};

/*
|--------------------------------------------------------------------------
| Page Submit
|--------------------------------------------------------------------------
*/

const submitForm = async () => {
  if (isEditMode.value) {
    const success = await pagesStore.updatePage(route.params.id, {
      ...form,
    });

    if (success) {
      router.push("/manage/pages");
    }

    return;
  }

  const success = await pagesStore.createPage({
    ...form,
  });

  if (success) {
    router.push("/manage/pages");
  }
};

/*
|--------------------------------------------------------------------------
| Block Helpers
|--------------------------------------------------------------------------
*/

const resetBlockForm = () => {
  editingBlockId.value = null;

  blockForm.type = "hero";
  blockForm.position = pagesStore.blocks.length;
  blockForm.contentText = "";

  pagesStore.clearBlockState();
};

const getBlockContentText = (block) => {
  if (!block?.content) {
    return "";
  }

  if (typeof block.content === "string") {
    return block.content;
  }

  return JSON.stringify(block.content, null, 2);
};

const parseBlockContent = () => {
  const value = blockForm.contentText.trim();

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return {
      text: value,
    };
  }
};

const startEditingBlock = (block) => {
  editingBlockId.value = block.id;

  blockForm.type = block.type;
  blockForm.position = block.position;
  blockForm.contentText = getBlockContentText(block);

  pagesStore.clearBlockState();

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const submitBlock = async () => {
  const content = parseBlockContent();

  if (!content) {
    pagesStore.blockError = "Block content is required.";

    return;
  }

  const payload = {
    type: blockForm.type,
    position: Number(blockForm.position),
    content,
  };

  let success = false;

  if (editingBlockId.value) {
    success = await pagesStore.updateBlock(
      route.params.id,
      editingBlockId.value,
      payload,
    );
  } else {
    success = await pagesStore.createBlock(route.params.id, payload);
  }

  if (success) {
    resetBlockForm();
  }
};

const deleteBlock = async (blockId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this content block?",
  );

  if (!confirmed) {
    return;
  }

  const success = await pagesStore.deleteBlock(route.params.id, blockId);

  if (success && editingBlockId.value === blockId) {
    resetBlockForm();
  }
};

/*
|--------------------------------------------------------------------------
| Reorder Blocks
|--------------------------------------------------------------------------
*/

const moveBlockUp = async (index) => {
  if (index <= 0) {
    return;
  }

  const reordered = [...pagesStore.blocks];

  const current = reordered[index];

  reordered[index] = reordered[index - 1];
  reordered[index - 1] = current;

  await pagesStore.reorderBlocks(route.params.id, reordered);
};

const moveBlockDown = async (index) => {
  if (index >= pagesStore.blocks.length - 1) {
    return;
  }

  const reordered = [...pagesStore.blocks];

  const current = reordered[index];

  reordered[index] = reordered[index + 1];
  reordered[index + 1] = current;

  await pagesStore.reorderBlocks(route.params.id, reordered);
};

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  pagesStore.clearCreateState();
  pagesStore.clearUpdateState();
  pagesStore.clearBlockState();

  await loadPageForEditing();

  if (isEditMode.value) {
    blockForm.position = pagesStore.blocks.length;
  }
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
              ? "Update the page content, publishing status, and reusable content blocks."
              : "Create a new CMS page."
          }}
        </p>

        <div v-if="formError" class="form-status error">
          {{ formError }}
        </div>

        <!-- =========================
             PAGE FORM
        ========================== -->

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

        <!-- =========================
             CONTENT BLOCK MANAGEMENT
        ========================== -->

        <section v-if="isEditMode" class="blocks-management">
          <div class="blocks-management-heading">
            <div>
              <p class="section-label">Reusable Content</p>

              <h2>Content Blocks</h2>

              <p>
                Add, edit, delete, and reorder the blocks used by this page.
              </p>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="pagesStore.blocksLoading" class="posts-state">
            Loading content blocks...
          </div>

          <!-- Load Error -->
          <div v-else-if="pagesStore.blocksError" class="form-status error">
            {{ pagesStore.blocksError }}
          </div>

          <!-- Reorder Error -->
          <div v-if="pagesStore.blockReorderError" class="form-status error">
            {{ pagesStore.blockReorderError }}
          </div>

          <!-- Delete Error -->
          <div v-if="pagesStore.blockDeleteError" class="form-status error">
            {{ pagesStore.blockDeleteError }}
          </div>

          <!-- Empty -->
          <div
            v-if="
              !pagesStore.blocksLoading &&
              !pagesStore.blocksError &&
              pagesStore.blocks.length === 0
            "
            class="posts-state"
          >
            This page does not have any content blocks yet.
          </div>

          <!-- Blocks List -->
          <div
            v-if="!pagesStore.blocksLoading && pagesStore.blocks.length > 0"
            class="blocks-list"
          >
            <article
              v-for="(block, index) in pagesStore.blocks"
              :key="block.id"
              class="content-block-card"
            >
              <div class="content-block-header">
                <div>
                  <span class="content-block-position">
                    Position {{ block.position }}
                  </span>

                  <h3>
                    {{ block.type }}
                  </h3>
                </div>

                <div class="content-block-order-actions">
                  <button
                    class="button"
                    type="button"
                    :disabled="index === 0 || pagesStore.blockReordering"
                    @click="moveBlockUp(index)"
                  >
                    ↑ Up
                  </button>

                  <button
                    class="button"
                    type="button"
                    :disabled="
                      index === pagesStore.blocks.length - 1 ||
                      pagesStore.blockReordering
                    "
                    @click="moveBlockDown(index)"
                  >
                    ↓ Down
                  </button>
                </div>
              </div>

              <pre class="content-block-preview">{{
                getBlockContentText(block)
              }}</pre>

              <div class="post-actions">
                <button
                  class="button"
                  type="button"
                  @click="startEditingBlock(block)"
                >
                  Edit Block
                </button>

                <button
                  class="button"
                  type="button"
                  :disabled="pagesStore.blockDeleting"
                  @click="deleteBlock(block.id)"
                >
                  {{
                    pagesStore.blockDeleting ? "Deleting..." : "Delete Block"
                  }}
                </button>
              </div>
            </article>
          </div>

          <!-- =========================
               ADD / EDIT BLOCK FORM
          ========================== -->

          <form class="post-form block-form" @submit.prevent="submitBlock">
            <h3>
              {{ blockFormTitle }}
            </h3>

            <!-- Block Type -->
            <div class="form-group">
              <label for="block-type"> Block Type </label>

              <select id="block-type" v-model="blockForm.type">
                <option
                  v-for="option in blockTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <p
                v-if="pagesStore.blockValidationErrors.type"
                class="field-error"
              >
                {{ pagesStore.blockValidationErrors.type[0] }}
              </p>
            </div>

            <!-- Position -->
            <div class="form-group">
              <label for="block-position"> Position </label>

              <input
                id="block-position"
                v-model.number="blockForm.position"
                type="number"
                min="0"
              />

              <p
                v-if="pagesStore.blockValidationErrors.position"
                class="field-error"
              >
                {{ pagesStore.blockValidationErrors.position[0] }}
              </p>
            </div>

            <!-- Content -->
            <div class="form-group">
              <label for="block-content"> Content / Configuration </label>

              <textarea
                id="block-content"
                v-model="blockForm.contentText"
                rows="8"
                placeholder='Enter JSON such as {"heading":"Welcome"} or simple text.'
              ></textarea>

              <p class="block-help-text">
                You may enter JSON configuration or plain text.
              </p>

              <p
                v-if="pagesStore.blockValidationErrors.content"
                class="field-error"
              >
                {{ pagesStore.blockValidationErrors.content[0] }}
              </p>
            </div>

            <div v-if="pagesStore.blockError" class="form-status error">
              {{ pagesStore.blockError }}
            </div>

            <div class="post-actions">
              <button
                class="button"
                type="submit"
                :disabled="pagesStore.blockSubmitting"
              >
                {{ blockSubmitLabel }}
              </button>

              <button
                v-if="editingBlockId"
                class="button"
                type="button"
                @click="resetBlockForm"
              >
                Cancel Edit
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  </main>
</template>
