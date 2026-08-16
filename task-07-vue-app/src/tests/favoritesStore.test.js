import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePostsStore } from "../stores/posts";

describe("Favorites Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    localStorage.clear();
  });

  it("adds a post to favorites", () => {
    const postsStore = usePostsStore();

    postsStore.toggleFavorite(1);

    expect(postsStore.favoriteIds).toContain(1);
  });

  it("removes a post from favorites", () => {
    const postsStore = usePostsStore();

    postsStore.toggleFavorite(1);

    postsStore.toggleFavorite(1);

    expect(postsStore.favoriteIds).not.toContain(1);
  });

  it("restores favorites from localStorage", () => {
    localStorage.setItem("favoritePostIds", JSON.stringify([2, 4]));

    const postsStore = usePostsStore();

    postsStore.restoreFavorites();

    expect(postsStore.favoriteIds).toEqual([2, 4]);
  });
});
