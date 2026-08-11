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

---
# Task 08 – Vue Router, Dynamic Routes, and Reusable API Logic

## Overview

In Task 08, the existing Vue application was extended into a multi-page Single Page Application (SPA) using Vue Router.

The task focused on route-level navigation, dynamic post routes, reusable API logic, route-aware search, error handling, and maintaining the existing responsive design.

## Features Completed

- Configured Vue Router using `createRouter` and `createWebHistory`.
- Added route-level views for:
  - Home
  - Services
  - Posts
  - Contact
- Used `RouterView` to render pages dynamically.
- Replaced traditional navigation links with `RouterLink`.
- Added lazy loading for selected route-level views.
- Added smooth scrolling for section-based navigation.
- Added a dynamic route for individual posts:
  - `/posts/:id`
- Used `useRoute()` to read the post ID from the URL.
- Used `useRouter()` for programmatic navigation.
- Added a reusable `usePosts` composable for API logic.
- Added loading, error, and retry states.
- Added a `View Details` link for each post.
- Added a `Back to Posts` action on the post details page.
- Added a catch-all 404 Not Found route.
- Synchronized post search with the URL query string.
- Search state is restored after refreshing the page.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/services` | Services and Projects |
| `/posts` | Posts list |
| `/posts/:id` | Dynamic post details |
| `/contact` | Contact page |
| `/:pathMatch(.*)*` | 404 Not Found page |

## Reusable Composable

The posts API logic was moved into:

`src/composables/usePosts.js`

The composable manages:

- Posts data
- Single post data
- Loading state
- Error state
- Loading all posts
- Loading a post by ID
- Retry behavior

This keeps API logic reusable and avoids duplicating the same fetching logic across components and views.

## Route-Aware Search

The Posts page synchronizes the search value with the URL query string.

Example:

`/posts?q=qui`

Refreshing or directly opening this URL restores the search value and filtered results.

## Error Handling

The application includes handling for:

- API loading states
- API request errors
- Retry actions
- Invalid post IDs
- Unknown routes using a 404 page

## Evidence

### Route-Level Navigation

![Route-Level Navigation](screenshots/task08-routes.png)

### Dynamic Post Details

![Dynamic Post Details](screenshots/task08-post-details.png)

### Route-Aware Search

![Route-Aware Search](screenshots/task08-route-search.png)

## Technologies Used

- Vue 3
- Vue Router
- Composition API
- JavaScript
- REST API
- JSONPlaceholder
- HTML5
- CSS3
- Vite

## API

Posts are loaded from the JSONPlaceholder REST API.

## Testing

The application was tested for:

- Route navigation
- Browser Back and Forward navigation
- Direct route access
- Page refresh on nested routes
- Dynamic post routes
- Invalid post IDs
- Unknown routes
- Search query persistence
- API loading and error states
- Retry functionality
- Responsive behavior

## Remaining Work

None.

## Challenges

One of the main challenges was transitioning from a single-page section-based navigation structure to Vue Router.

The previous implementation relied heavily on anchor links such as `#posts`, `#services`, and `#contact`. After introducing Vue Router, these links initially conflicted with the new route-based navigation.

Another challenge was understanding the difference between static routes, dynamic routes, route parameters, and query parameters. Refactoring the existing API logic into a reusable composable also required restructuring code that was previously located directly inside the component.

These issues were resolved by separating route-level views, using `RouterLink`, introducing the `usePosts` composable, and synchronizing search state with the route query.

## Latest Progress

Task 08 has been completed with routing, dynamic post details, reusable API logic, route-aware search, error handling, and 404 handling.