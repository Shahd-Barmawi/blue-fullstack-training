# Task 07 – Vue.js Fundamentals

## Overview

This project is a Vue.js version of the previous responsive website developed during Task 06.

The application was rebuilt using Vue 3 and Vite by dividing the website into reusable components while keeping the same design and functionality.

---

## Technologies Used

- Vue 3
- Vite
- JavaScript
- HTML5
- CSS3
- JSONPlaceholder REST API

---

## Features

### Component-Based Architecture

The application was divided into reusable Vue components including:

- Site Header
- Hero Section
- About Section
- Services Section
- Service Card
- Statistics Section
- Projects Section
- Project Card
- Posts Section
- Contact Section
- Site Footer

---

### Vue Concepts Used

- Vue Components
- Props
- Custom Events
- ref()
- computed()
- v-for
- v-if / v-else
- v-model
- onMounted()

---

### Project Filtering

Projects can be filtered by category:

- All
- Web
- Mobile
- UI/UX

Filtering is implemented using Vue's reactive state and computed properties.

---

### REST API Integration

The application loads posts dynamically from:

https://jsonplaceholder.typicode.com/posts

Implemented features:

- Loading state
- Error handling
- Retry button
- Search functionality
- Dynamic rendering using Vue

---

## Screenshots

### Vue Homepage

![Homepage](screenshots/vue-homepage.png)

---

### Components Structure

![Components](screenshots/vue-components.png)

---

### Project Filtering

![Project Filter](screenshots/project-filter.png)

---

### REST API Integration

![Posts API](screenshots/posts-api.png)

---

## Learning Outcomes

Through this task I learned how to:

- Build applications using Vue 3 and Vite.
- Create reusable components.
- Pass data using Props.
- Communicate between components using Custom Events.
- Manage reactive state with ref().
- Create computed properties.
- Render dynamic lists using v-for.
- Build user interactions using Vue directives.
- Integrate REST APIs inside Vue components.
- Handle loading, error, retry, and search states.

---

## Project Structure

```text
task-07-vue-app
│
├── src
│   ├── components
│   │   ├── SiteHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── ServicesSection.vue
│   │   ├── ServiceCard.vue
│   │   ├── StatisticsSection.vue
│   │   ├── ProjectsSection.vue
│   │   ├── ProjectCard.vue
│   │   ├── PostsSection.vue
│   │   ├── ContactSection.vue
│   │   └── SiteFooter.vue
│   │
│   ├── App.vue
│   └── main.js
│
├── screenshots
├── package.json
└── README.md
```

---

## Author

**Shahd Barmawi**