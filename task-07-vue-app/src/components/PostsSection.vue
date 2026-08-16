<script setup>
import ProjectCard from "./ProjectCard.vue";
import { useProjects } from "../composables/useProjects";

const {
  selectedCategory,
  selectedProject,
  filteredProjects,
  selectCategory,
  handleProjectDetails,
  closeProjectDetails,
} = useProjects();
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
          @click="selectCategory('all')"
        >
          All
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'web' }"
          type="button"
          @click="selectCategory('web')"
        >
          Web
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'mobile' }"
          type="button"
          @click="selectCategory('mobile')"
        >
          Mobile
        </button>

        <button
          class="project-filter"
          :class="{ active: selectedCategory === 'ui-ux' }"
          type="button"
          @click="selectCategory('ui-ux')"
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

      <div
        v-if="selectedProject"
        id="selected-project"
        class="selected-project"
      >
        <p class="section-label">Project Details</p>

        <h3>
          {{ selectedProject.title }}
        </h3>

        <p>
          {{ selectedProject.description }}
        </p>

        <p>
          Category:
          <strong>
            {{ selectedProject.category }}
          </strong>
        </p>

        <button
          class="button button-secondary"
          type="button"
          @click="closeProjectDetails"
        >
          Close Details
        </button>
      </div>
    </div>
  </section>
</template>
