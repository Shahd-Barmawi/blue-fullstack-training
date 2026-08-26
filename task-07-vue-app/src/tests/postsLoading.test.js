import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { usePostsStore } from "../stores/posts";

vi.mock("../services/api", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

import { apiGet } from "../services/api";

describe("Posts loading state", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
  });

  it("loads posts successfully from mocked API", async () => {
    apiGet.mockResolvedValue({
      response: {
        ok: true,
        status: 200,
      },

      data: {
        data: [
          {
            id: 1,
            title: "Test Post",
            body: "Test post body",
            status: "published",

            category: {
              id: 1,
              name: "Technology",
            },

            author: {
              id: 1,
              name: "Test User",
            },
          },
        ],

        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 2,
          total: 1,
        },

        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      },
    });

    const store = usePostsStore();

    expect(store.loading).toBe(false);

    const loadPromise = store.loadPosts();

    expect(store.loading).toBe(true);

    await loadPromise;

    expect(store.loading).toBe(false);

    expect(store.error).toBe("");

    expect(store.posts).toHaveLength(1);

    expect(store.posts[0].title).toBe("Test Post");

    expect(store.totalPosts).toBe(1);

    expect(apiGet).toHaveBeenCalledWith("/posts?page=1");
  });

  it("shows an error state when posts request fails", async () => {
    apiGet.mockRejectedValue(new Error("Network error"));

    const store = usePostsStore();

    await store.loadPosts();

    expect(store.loading).toBe(false);

    expect(store.posts).toEqual([]);

    expect(store.error).toBe(
      "Unable to load posts from the Laravel API. Please try again.",
    );
  });
});
