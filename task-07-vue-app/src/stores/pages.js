import { defineStore } from "pinia";

import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";

export const usePagesStore = defineStore("pages", {
  state: () => ({
    // Public pages
    pages: [],
    selectedPage: null,

    // Management pages
    managementPages: [],

    // General loading/error
    loading: false,
    error: "",

    // Create
    creating: false,
    createError: "",
    createValidationErrors: {},
    createdPage: null,

    // Update
    updating: false,
    updateError: "",
    updateValidationErrors: {},
    updatedPage: null,

    // Delete
    deleting: false,
    deleteError: "",
    deleteSuccess: "",
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
  },
});
