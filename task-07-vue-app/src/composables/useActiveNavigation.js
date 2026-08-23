import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

import { useRoute } from "vue-router";

export const useActiveNavigation = () => {
  const route = useRoute();

  const activeSection = ref("");

  const getSections = () => {
    if (route.path === "/") {
      return [
        { id: "hero", name: "home" },
        { id: "about", name: "about" },
        { id: "statistics", name: "statistics" },
      ];
    }

    if (route.path === "/services") {
      return [
        { id: "services", name: "services" },
        { id: "projects", name: "projects" },
      ];
    }

    return [];
  };

  const setActiveRoute = () => {
    activeSection.value = "";

    if (route.path === "/login") {
      activeSection.value = "login";
      return;
    }

    if (route.path.startsWith("/posts")) {
      activeSection.value = "posts";
      return;
    }

    if (route.path === "/favorites") {
      activeSection.value = "favorites";
      return;
    }

    if (route.path === "/contact") {
      activeSection.value = "contact";
      return;
    }

    if (route.path === "/") {
      activeSection.value = "home";
      return;
    }

    if (route.path === "/services") {
      activeSection.value = "services";
    }
  };

  const updateActiveSection = () => {
    const sections = getSections();

    if (sections.length === 0) {
      setActiveRoute();
      return;
    }

    const activationPoint = window.innerHeight * 0.6;

    let currentSection = sections[0].name;

    sections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();

      if (rect.top <= activationPoint && rect.bottom > 0) {
        currentSection = section.name;
      }
    });

    activeSection.value = currentSection;
  };

  const setupNavigation = async () => {
    await nextTick();

    setActiveRoute();
    updateActiveSection();
  };

  watch(
    () => route.fullPath,
    async () => {
      await setupNavigation();
    },
  );

  onMounted(async () => {
    await setupNavigation();

    window.addEventListener("scroll", updateActiveSection, { passive: true });

    window.addEventListener("resize", updateActiveSection);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", updateActiveSection);

    window.removeEventListener("resize", updateActiveSection);
  });

  return {
    activeSection,
  };
};
