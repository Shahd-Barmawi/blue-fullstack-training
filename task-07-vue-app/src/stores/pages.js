import { defineStore } from "pinia";

import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";

export const usePagesStore = defineStore("pages", {
  state: () => ({
    // =========================
    // PUBLIC PAGES
    // =========================
    pages: [],
    selectedPage: null,

    // =========================
    // MANAGEMENT PAGES
    // =========================
    managementPages: [],

    // =========================
    // GENERAL LOADING / ERROR
    // =========================
    loading: false,
    error: "",

    // =========================
    // CREATE PAGE
    // =========================
    creating: false,
    createError: "",
    createValidationErrors: {},
    createdPage: null,

    // =========================
    // UPDATE PAGE
    // =========================
    updating: false,
    updateError: "",
    updateValidationErrors: {},
    updatedPage: null,

    // =========================
    // DELETE PAGE
    // =========================
    deleting: false,
    deleteError: "",
    deleteSuccess: "",

    // =========================
    // CONTENT BLOCKS
    // =========================
    blocks: [],
    blocksLoading: false,
    blocksError: "",

    blockSubmitting: false,
    blockError: "",
    blockValidationErrors: {},

    blockDeleting: false,
    blockDeleteError: "",

    blockReordering: false,
    blockReorderError: "",
  }),

  actions: {
    // =========================
    // LOAD PUBLIC PAGES
    // =========================
    async loadPages() {
      this.loading = true;
      this.error = "";

      try {
        const { response, data } = await apiGet("/pages");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.pages = Array.isArray(data) ? data : data?.data || [];

        return this.pages;
      } catch (error) {
        this.error = "Unable to load pages. Please try again.";

        console.error(error);

        return [];
      } finally {
        this.loading = false;
      }
    },

    // =========================
    // LOAD PUBLIC PAGE BY SLUG
    // =========================
    async loadPageBySlug(slug) {
      this.loading = true;
      this.error = "";
      this.selectedPage = null;

      try {
        const { response, data } = await apiGet(`/pages/${slug}`);

        if (response.status === 404) {
          this.error = "Page not found.";

          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const page = data?.data || data;

        this.selectedPage = page;

        return page;
      } catch (error) {
        this.error = "Unable to load the page. Please try again.";

        console.error(error);

        return null;
      } finally {
        this.loading = false;
      }
    },

    // =========================
    // LOAD MANAGEMENT PAGES
    // =========================
    async loadManagementPages() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.error = "You must be logged in to manage pages.";

          return false;
        }

        const { response, data } = await apiGet("/manage/pages", {
          auth: true,
        });

        if (response.status === 401) {
          this.error = "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.error = "You are not authorized to manage pages.";

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.managementPages = Array.isArray(data) ? data : data?.data || [];

        return true;
      } catch (error) {
        this.error = "Unable to load management pages. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.loading = false;
      }
    },

    // =========================
    // LOAD ONE PAGE FOR MANAGEMENT
    // =========================
    async loadPageForManagement(pageId) {
      this.blocksLoading = true;
      this.blocksError = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.blocksError = "You must be logged in to manage page blocks.";

          return null;
        }

        const { response, data } = await apiGet(`/manage/pages/${pageId}`, {
          auth: true,
        });

        if (response.status === 401) {
          this.blocksError =
            "Your session is no longer valid. Please log in again.";

          return null;
        }

        if (response.status === 403) {
          this.blocksError = "You are not authorized to manage page blocks.";

          return null;
        }

        if (response.status === 404) {
          this.blocksError = "Page not found.";

          return null;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const page = data?.data || data;

        this.blocks = Array.isArray(page?.content_blocks)
          ? page.content_blocks
          : [];

        return page;
      } catch (error) {
        this.blocksError = "Unable to load page blocks. Please try again.";

        console.error(error);

        return null;
      } finally {
        this.blocksLoading = false;
      }
    },

    // =========================
    // CREATE PAGE
    // =========================
    async createPage(pageData) {
      this.creating = true;
      this.createError = "";
      this.createValidationErrors = {};
      this.createdPage = null;

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.createError = "You must be logged in to create a page.";

          return false;
        }

        const { response, data } = await apiPost("/pages", pageData, {
          auth: true,
        });

        if (response.status === 401) {
          this.createError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.createError = "You are not authorized to create pages.";

          return false;
        }

        if (response.status === 422) {
          this.createError =
            data?.message || "Please correct the validation errors.";

          this.createValidationErrors = data?.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.createdPage = data?.data || data;

        await this.loadManagementPages();

        return true;
      } catch (error) {
        this.createError = "Unable to create the page. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.creating = false;
      }
    },

    // =========================
    // UPDATE PAGE
    // =========================
    async updatePage(pageId, pageData) {
      this.updating = true;
      this.updateError = "";
      this.updateValidationErrors = {};
      this.updatedPage = null;

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.updateError = "You must be logged in to update a page.";

          return false;
        }

        const { response, data } = await apiPut(`/pages/${pageId}`, pageData, {
          auth: true,
        });

        if (response.status === 401) {
          this.updateError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.updateError = "You are not authorized to update pages.";

          return false;
        }

        if (response.status === 404) {
          this.updateError = "Page not found.";

          return false;
        }

        if (response.status === 422) {
          this.updateError =
            data?.message || "Please correct the validation errors.";

          this.updateValidationErrors = data?.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.updatedPage = data?.data || data;

        await this.loadManagementPages();

        return true;
      } catch (error) {
        this.updateError = "Unable to update the page. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.updating = false;
      }
    },

    // =========================
    // DELETE PAGE
    // =========================
    async deletePage(pageId) {
      this.deleting = true;
      this.deleteError = "";
      this.deleteSuccess = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.deleteError = "You must be logged in to delete a page.";

          return false;
        }

        const { response } = await apiDelete(`/pages/${pageId}`, {
          auth: true,
        });

        if (response.status === 401) {
          this.deleteError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.deleteError = "You are not authorized to delete pages.";

          return false;
        }

        if (response.status === 404) {
          this.deleteError = "Page not found.";

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.managementPages = this.managementPages.filter(
          (page) => page.id !== Number(pageId),
        );

        this.deleteSuccess = "Page deleted successfully!";

        return true;
      } catch (error) {
        this.deleteError = "Unable to delete the page. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.deleting = false;
      }
    },

    // =========================
    // CREATE CONTENT BLOCK
    // =========================
    async createBlock(pageId, blockData) {
      this.blockSubmitting = true;
      this.blockError = "";
      this.blockValidationErrors = {};

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.blockError = "You must be logged in to create content blocks.";

          return false;
        }

        const { response, data } = await apiPost(
          `/pages/${pageId}/blocks`,
          blockData,
          {
            auth: true,
          },
        );

        if (response.status === 401) {
          this.blockError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.blockError = "You are not authorized to create content blocks.";

          return false;
        }

        if (response.status === 404) {
          this.blockError = "Page not found.";

          return false;
        }

        if (response.status === 422) {
          this.blockError =
            data?.message || "Please correct the validation errors.";

          this.blockValidationErrors = data?.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        await this.loadPageForManagement(pageId);

        return true;
      } catch (error) {
        this.blockError =
          "Unable to create the content block. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.blockSubmitting = false;
      }
    },

    // =========================
    // UPDATE CONTENT BLOCK
    // =========================
    async updateBlock(pageId, blockId, blockData) {
      this.blockSubmitting = true;
      this.blockError = "";
      this.blockValidationErrors = {};

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.blockError = "You must be logged in to update content blocks.";

          return false;
        }

        const { response, data } = await apiPut(
          `/pages/${pageId}/blocks/${blockId}`,
          blockData,
          {
            auth: true,
          },
        );

        if (response.status === 401) {
          this.blockError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.blockError = "You are not authorized to update content blocks.";

          return false;
        }

        if (response.status === 404) {
          this.blockError = "Content block not found.";

          return false;
        }

        if (response.status === 422) {
          this.blockError =
            data?.message || "Please correct the validation errors.";

          this.blockValidationErrors = data?.errors || {};

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        await this.loadPageForManagement(pageId);

        return true;
      } catch (error) {
        this.blockError =
          "Unable to update the content block. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.blockSubmitting = false;
      }
    },

    // =========================
    // DELETE CONTENT BLOCK
    // =========================
    async deleteBlock(pageId, blockId) {
      this.blockDeleting = true;
      this.blockDeleteError = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.blockDeleteError =
            "You must be logged in to delete content blocks.";

          return false;
        }

        const { response } = await apiDelete(
          `/pages/${pageId}/blocks/${blockId}`,
          {
            auth: true,
          },
        );

        if (response.status === 401) {
          this.blockDeleteError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.blockDeleteError =
            "You are not authorized to delete content blocks.";

          return false;
        }

        if (response.status === 404) {
          this.blockDeleteError = "Content block not found.";

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.blocks = this.blocks.filter(
          (block) => block.id !== Number(blockId),
        );

        return true;
      } catch (error) {
        this.blockDeleteError =
          "Unable to delete the content block. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.blockDeleting = false;
      }
    },

    // =========================
    // REORDER CONTENT BLOCKS
    // =========================
    async reorderBlocks(pageId, reorderedBlocks) {
      this.blockReordering = true;
      this.blockReorderError = "";

      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          this.blockReorderError =
            "You must be logged in to reorder content blocks.";

          return false;
        }

        const { response, data } = await apiPut(
          `/pages/${pageId}/blocks/reorder`,
          {
            blocks: reorderedBlocks.map((block, index) => ({
              id: block.id,
              position: index,
            })),
          },
          {
            auth: true,
          },
        );

        if (response.status === 401) {
          this.blockReorderError =
            "Your session is no longer valid. Please log in again.";

          return false;
        }

        if (response.status === 403) {
          this.blockReorderError =
            "You are not authorized to reorder content blocks.";

          return false;
        }

        if (response.status === 404) {
          this.blockReorderError = "Page not found.";

          return false;
        }

        if (response.status === 422) {
          this.blockReorderError =
            data?.message || "Unable to reorder content blocks.";

          return false;
        }

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        this.blocks = Array.isArray(data?.blocks)
          ? data.blocks
          : reorderedBlocks;

        return true;
      } catch (error) {
        this.blockReorderError =
          "Unable to reorder content blocks. Please try again.";

        console.error(error);

        return false;
      } finally {
        this.blockReordering = false;
      }
    },

    // =========================
    // CLEAR STATES
    // =========================
    clearSelectedPage() {
      this.selectedPage = null;
    },

    clearCreateState() {
      this.createError = "";
      this.createValidationErrors = {};
      this.createdPage = null;
    },

    clearUpdateState() {
      this.updateError = "";
      this.updateValidationErrors = {};
      this.updatedPage = null;
    },

    clearDeleteState() {
      this.deleteError = "";
      this.deleteSuccess = "";
    },

    clearBlockState() {
      this.blocksError = "";
      this.blockError = "";
      this.blockValidationErrors = {};
      this.blockDeleteError = "";
      this.blockReorderError = "";
    },
  },
});
