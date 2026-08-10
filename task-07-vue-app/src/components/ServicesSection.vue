<script setup>
import ServiceCard from "./ServiceCard.vue";

const services = [
  {
    id: 1,
    number: "01",
    title: "Web Development",
    description:
      "Professional, modern, and user-friendly websites built for different business needs.",
  },
  {
    id: 2,
    number: "02",
    title: "Mobile Applications",
    description:
      "Reliable Android and iOS applications with clear, accessible, and modern interfaces.",
  },
  {
    id: 3,
    number: "03",
    title: "UI/UX Design",
    description:
      "Modern interfaces focused on usability, accessibility, and a smooth user experience.",
  },
  {
    id: 4,
    number: "04",
    title: "Cloud Services",
    description:
      "Flexible cloud infrastructure and deployment solutions for modern digital systems.",
  },
  {
    id: 5,
    number: "05",
    title: "Cyber Security",
    description:
      "Security practices that help protect systems, applications, and business information.",
  },
  {
    id: 6,
    number: "06",
    title: "Technical Support",
    description:
      "Reliable maintenance and technical assistance to keep systems working smoothly.",
  },
];
</script>

<template>
  <section id="services" class="services section">
    <div class="container">
      <p class="section-label services-label">What We Offer</p>

      <h2 class="section-title">Our Services</h2>

      <p class="section-description">
        We provide professional digital services that help businesses improve
        their systems, grow online, and deliver better user experiences.
      </p>

      <div class="services-grid">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :number="service.number"
          :title="service.title"
          :description="service.description"
        />
      </div>
    </div>
  </section>
</template>
