<script setup>
import { ref, computed } from "vue";
import ProjectCard from "./ProjectCard.vue";

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
    description: "Modern dashboard focused on clear information presentation.",
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

const handleProjectDetails = (project) => {
  selectedProject.value = project;
};
</script>

<template>
  <section id="projects" class="projects section">
    <div class="container">
      <p class="section-label projects-label">Featured Projects</p>

      <h2 class="section-title">Projects Built With Modern Technologies</h2>

      <p class="section-description">
        Explore some of our featured digital projects across web, mobile, and
        UI/UX solutions.
      </p>

      <div class="project-filters" aria-label="Project category filters">
        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'all' }"
          type="button"
          @click="selectedCategory = 'all'"
        >
          All
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'web' }"
          type="button"
          @click="selectedCategory = 'web'"
        >
          Web
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'mobile' }"
          type="button"
          @click="selectedCategory = 'mobile'"
        >
          Mobile
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'ui-ux' }"
          type="button"
          @click="selectedCategory = 'ui-ux'"
        >
          UI/UX
        </button>
      </div>

      <div class="projects-grid">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view-details="handleProjectDetails"
        />
      </div>

      <div v-if="selectedProject" class="selected-project">
        <h3>Selected Project</h3>

        <p>
          You selected:
          <strong>
            {{ selectedProject.title }}
          </strong>
        </p>

        <p>
          {{ selectedProject.description }}
        </p>
      </div>
    </div>
  </section>
</template>
