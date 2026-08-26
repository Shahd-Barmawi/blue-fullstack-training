import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { useAuthState } from "../composables/useAuthState";

describe("Authentication state", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    localStorage.clear();

    vi.restoreAllMocks();
  });

  it("stores authenticated user and token after login state is set", () => {
    const { token, user, isAuthenticated, setAuth } = useAuthState();

    const testUser = {
      id: 2,
      name: "User B",
      email: "userb@example.com",
    };

    setAuth("test-token-123", testUser);

    expect(token.value).toBe("test-token-123");

    expect(user.value).toEqual(testUser);

    expect(isAuthenticated.value).toBe(true);

    expect(localStorage.getItem("authToken")).toBe("test-token-123");

    expect(JSON.parse(localStorage.getItem("authUser"))).toEqual(testUser);
  });

  it("clears authentication state on logout cleanup", () => {
    const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthState();

    setAuth("test-token", {
      id: 1,
      name: "Test User",
    });

    clearAuth();

    expect(token.value).toBe("");
    expect(user.value).toBeNull();

    expect(isAuthenticated.value).toBe(false);

    expect(localStorage.getItem("authToken")).toBeNull();

    expect(localStorage.getItem("authUser")).toBeNull();
  });
});
