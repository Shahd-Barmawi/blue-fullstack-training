import { ref, onMounted, onBeforeUnmount } from "vue";

export const useMobileMenu = () => {
  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleEscape);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleEscape);
  });

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
  };
};
