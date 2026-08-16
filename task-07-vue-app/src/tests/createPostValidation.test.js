import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import CreatePostView from "../views/CreatePostView.vue";
import { usePostsStore } from "../stores/posts";

describe("CreatePostView validation", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("shows validation errors for an empty form", async () => {
    const wrapper = mount(CreatePostView, {
      global: {
        plugins: [createPinia()],
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
    expect(wrapper.text()).toContain("User ID is required.");
  });

  it("shows minimum length validation messages", async () => {
    const wrapper = mount(CreatePostView, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterLink: {
            template: "<a><slot /></a>",
          },
        },
      },
    });

    await wrapper.find("#post-title").setValue("hi");
    await wrapper.find("#post-body").setValue("hello");
    await wrapper.find("#user-id").setValue("1");

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
        userId: 1,
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

    await wrapper.find("#user-id").setValue("1");

    await wrapper.find("form").trigger("submit");

    await wrapper.vm.$nextTick();

    expect(postsStore.submitPost).toHaveBeenCalled();

    expect(wrapper.text()).toContain("Post created successfully!");

    expect(wrapper.text()).toContain("Returned Post ID: 13");
  });
});
