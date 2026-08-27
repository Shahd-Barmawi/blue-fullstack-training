import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { usePagesStore } from "../stores/pages";

vi.mock("../services/api", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

import { apiGet } from "../services/api";

describe("Dynamic page loading", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
  });

  it("loads a published page successfully by slug", async () => {
    apiGet.mockResolvedValue({
      response: {
        ok: true,
        status: 200,
      },

      data: {
        id: 1,
        title: "About Us",
        slug: "about-us",
        content: "This is the About Us page content.",
        status: "published",
      },
    });

    const store = usePagesStore();

    expect(store.loading).toBe(false);

    const loadPromise = store.loadPageBySlug("about-us");

    expect(store.loading).toBe(true);

    await loadPromise;

    expect(store.loading).toBe(false);

    expect(store.error).toBe("");

    expect(store.selectedPage).not.toBeNull();

    expect(store.selectedPage.title).toBe("About Us");

    expect(store.selectedPage.slug).toBe("about-us");

    expect(store.selectedPage.status).toBe("published");

    expect(apiGet).toHaveBeenCalledWith("/pages/about-us");
  });

  it("shows page not found when slug does not exist", async () => {
    apiGet.mockResolvedValue({
      response: {
        ok: false,
        status: 404,
      },

      data: {
        message: "Page not found",
      },
    });

    const store = usePagesStore();

    const page = await store.loadPageBySlug("missing-page");

    expect(store.loading).toBe(false);

    expect(page).toBeNull();

    expect(store.selectedPage).toBeNull();

    expect(store.error).toBe("Page not found.");

    expect(apiGet).toHaveBeenCalledWith("/pages/missing-page");
  });

  it("shows an error state when the page request fails", async () => {
    apiGet.mockRejectedValue(new Error("Network error"));

    const store = usePagesStore();

    const page = await store.loadPageBySlug("about-us");

    expect(store.loading).toBe(false);

    expect(page).toBeNull();

    expect(store.selectedPage).toBeNull();

    expect(store.error).toBe("Unable to load the page. Please try again.");
  });
});
