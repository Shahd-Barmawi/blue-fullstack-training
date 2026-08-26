import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import CreatePostView from "../views/CreatePostView.vue";
import { usePostsStore } from "../stores/posts";

vi.mock("../composables/useCategories", () => ({
  useCategories: () => ({
    categories: [
      {
        id: 1,
        name: "Technology",
      },
    ],
    categoriesLoading: false,
    categoriesError: "",
    loadCategories: vi.fn(),
  }),
}));

describe("CreatePostView validation", () => {
  beforeEach(() => {
    const pinia = createPinia();

    setActivePinia(pinia);

    localStorage.clear();

    vi.clearAllMocks();
  });

  it("shows validation errors for an empty form", async () => {
    const pinia = createPinia();

    setActivePinia(pinia);

    const wrapper = mount(CreatePostView, {
      global: {
        plugins: [pinia],

        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
          },
        },
      },
    });

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Title is required.");

    expect(wrapper.text()).toContain("Body is required.");

    expect(wrapper.text()).toContain("Category is required.");
  });

  it("shows minimum length validation messages", async () => {
    const pinia = createPinia();

    setActivePinia(pinia);

    const wrapper = mount(CreatePostView, {
      global: {
        plugins: [pinia],

        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
          },
        },
      },
    });

    await wrapper.find("#post-title").setValue("hi");

    await wrapper.find("#post-body").setValue("hello");

    await wrapper.find("#post-category").setValue("1");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Title must be at least 5 characters.");

    expect(wrapper.text()).toContain("Body must be at least 10 characters.");
  });

  it("shows success UI after a valid mocked submission", async () => {
    const pinia = createPinia();

    setActivePinia(pinia);

    const postsStore = usePostsStore();

    vi.spyOn(postsStore, "submitPost").mockImplementation(async () => {
      postsStore.createdPost = {
        id: 13,
        title: "Testing post",
        body: "This is a valid post body.",
        status: "published",

        category: {
          id: 1,
          name: "Technology",
        },

        author: {
          id: 2,
          name: "User B",
        },
      };

      return true;
    });

    const wrapper = mount(CreatePostView, {
      global: {
        plugins: [pinia],

        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
          },
        },
      },
    });

    await wrapper.find("#post-title").setValue("Testing post");

    await wrapper.find("#post-body").setValue("This is a valid post body.");

    await wrapper.find("#post-category").setValue("1");

    await wrapper.find("#post-status").setValue("published");

    await wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    expect(postsStore.submitPost).toHaveBeenCalled();

    expect(wrapper.text()).toContain("Post created successfully!");

    expect(wrapper.text()).toContain("Returned Post ID: 13");
  });
});
