import { ref, computed, nextTick } from "vue";

export const useProjects = () => {
  const selectedCategory = ref("all");
  const selectedProject = ref(null);

  const projects = [
    {
      id: 1,
      title: "Business Website",
      category: "web",
      description: "Responsive business website for modern companies.",
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      category: "web",
      description:
        "Online shopping interface with product browsing and categories.",
    },
    {
      id: 3,
      title: "Car Rental App",
      category: "mobile",
      description: "Mobile application for browsing and renting vehicles.",
    },
    {
      id: 4,
      title: "Clinic Management App",
      category: "mobile",
      description:
        "Application for managing appointments and client communication.",
    },
    {
      id: 5,
      title: "Dashboard UI",
      category: "ui-ux",
      description:
        "Modern dashboard focused on clear information presentation.",
    },
    {
      id: 6,
      title: "Learning Platform UI",
      category: "ui-ux",
      description: "User-friendly interface for online courses and lessons.",
    },
    {
      id: 7,
      title: "Portfolio Website",
      category: "web",
      description: "Personal portfolio website with responsive layouts.",
    },
    {
      id: 8,
      title: "Booking App",
      category: "mobile",
      description: "Mobile booking interface for services and reservations.",
    },
  ];

  const filteredProjects = computed(() => {
    if (selectedCategory.value === "all") {
      return projects;
    }

    return projects.filter(
      (project) => project.category === selectedCategory.value,
    );
  });

  const selectCategory = (category) => {
    selectedCategory.value = category;
    selectedProject.value = null;
  };

  const handleProjectDetails = async (project) => {
    selectedProject.value = project;

    await nextTick();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const detailsSection = document.getElementById("selected-project");

        if (!detailsSection) {
          return;
        }

        const headerOffset = 100;

        const elementTop =
          detailsSection.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementTop - headerOffset,
          behavior: "smooth",
        });
      });
    });
  };

  const closeProjectDetails = () => {
    selectedProject.value = null;
  };

  return {
    selectedCategory,
    selectedProject,
    filteredProjects,
    selectCategory,
    handleProjectDetails,
    closeProjectDetails,
  };
};
