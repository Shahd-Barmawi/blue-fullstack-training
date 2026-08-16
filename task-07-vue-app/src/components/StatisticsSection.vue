<script setup>
import { useStatisticsCounter } from "../composables/useStatisticsCounter";

const { completedProjects, happyClients, yearsExperience } =
  useStatisticsCounter();
</script>

<template>
  <section id="statistics" class="statistics section">
    <div class="container">
      <p class="section-label statistics-label">Our Achievements</p>

      <h2 class="section-title statistics-title">
        Numbers That Reflect Our Experience
      </h2>

      <p class="section-description statistics-description">
        Our work is reflected in the projects we complete, the clients we
        support, and the experience we continue to build.
      </p>

      <div class="statistics-grid">
        <article class="statistic-card">
          <h3 class="statistic-number">{{ completedProjects }}+</h3>

          <p class="statistic-label">Completed Projects</p>
        </article>

        <article class="statistic-card">
          <h3 class="statistic-number">{{ happyClients }}+</h3>

          <p class="statistic-label">Happy Clients</p>
        </article>

        <article class="statistic-card">
          <h3 class="statistic-number">{{ yearsExperience }}+</h3>

          <p class="statistic-label">Years of Experience</p>
        </article>
      </div>
    </div>
  </section>
</template>
