# Blue Tech Solutions — Full-Stack Training Project

A full-stack web application developed as part of the Blue Tech Solutions training program.

The project combines a Vue.js frontend with a Laravel REST API backend and includes authentication, posts, favorites, dynamic CMS pages, protected page management, validation, and automated testing.

---

## Project Structure

```text
blue-fullstack-training/
├── task-07-vue-app/          # Vue.js frontend
├── task-11-laravel-api/      # Laravel REST API
├── Task#18+19 Screenshots/   # Task testing and implementation screenshots
└── README.md                 # Main project documentation
```

The frontend and backend directories may also contain their own README files with project-specific information.

---

## Technologies Used

### Frontend

- Vue.js
- Vue Router
- Pinia
- JavaScript
- CSS
- Vite
- Vitest

### Backend

- Laravel
- PHP
- Laravel Sanctum
- SQLite
- REST API
- PHPUnit / Laravel Feature Tests

---

# Frontend Setup

Navigate to the Vue application:

```bash
cd task-07-vue-app
```

Install dependencies:

```bash
npm install
```

Create the local environment file from the example:

```bash
cp .env.example .env
```

Configure the Laravel API base URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the Vue development server:

```bash
npm run dev
```

The frontend is normally available at:

```text
http://localhost:5173
```

---

# Backend Setup

Navigate to the Laravel application:

```bash
cd task-11-laravel-api
```

Install PHP dependencies:

```bash
composer install
```

Create the local environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Run the database migrations:

```bash
php artisan migrate
```

If seed data is required, run:

```bash
php artisan db:seed
```

Start the Laravel development server:

```bash
php artisan serve
```

The API is normally available at:

```text
http://127.0.0.1:8000/api
```

---

# Authentication

The application uses token-based authentication for protected operations.

Authenticated frontend requests send the token using the standard Bearer authorization header:

```text
Authorization: Bearer <token>
```

Authentication tokens are never stored in the repository or committed inside environment files.

Protected routes and API endpoints return:

```text
401 Unauthenticated
```

when a valid authenticated session is not provided.

---

# Posts and Favorites

The application includes post-related functionality developed during the previous training tasks.

The frontend contains views and state management for functionality including:

- Viewing posts
- Viewing post details
- Creating posts
- Viewing the authenticated user's posts
- Managing favorites
- Authentication-aware routes

Vue Router protects functionality that requires authentication.

---

# Pages CMS Module

Task 18 introduces a simple Content Management System (CMS) for managing dynamic pages.

Each page contains:

- Title
- Slug
- Content
- Status

Supported statuses include:

```text
draft
published
```

Published pages can be accessed publicly using their slug.

Draft pages remain available through the authenticated management interface but are not exposed through the public page endpoint.

---

## Public Dynamic Pages

The Vue frontend supports the following dynamic route:

```text
/pages/:slug
```

Example:

```text
/pages/about-us
```

The route loads page content from the Laravel API based on the supplied slug.

A published page is rendered dynamically without requiring a separate Vue component for every CMS page.

If the page does not exist, has an invalid slug, or is not publicly available, the application displays an appropriate not-found state.

---

# Page Management Flow

Authenticated users can access the CMS page-management interface.

The management flow supports:

1. Listing existing CMS pages.
2. Creating a new page.
3. Entering a title, unique slug, content, and publishing status.
4. Editing existing page information.
5. Changing a page between `draft` and `published`.
6. Deleting pages.
7. Viewing published pages through their public dynamic route.
8. Displaying Laravel validation errors in the Vue form.

Management functionality is protected by authentication.

---

# Pages API Endpoints

## Public Endpoints

### List public pages

```http
GET /api/pages
```

Returns publicly available pages.

### Get page by slug

```http
GET /api/pages/{slug}
```

Returns a published page matching the supplied slug.

Example:

```http
GET /api/pages/about-us
```

A missing or unavailable page returns:

```text
404 Not Found
```

---

## Protected Management Endpoint

### List pages for management

```http
GET /api/manage/pages
```

Requires authentication and returns pages for the CMS management interface, including pages that are not publicly published.

Without authentication, the endpoint returns:

```text
401 Unauthenticated
```

---

## Protected Page Actions

### Create page

```http
POST /api/pages
```

Example request body:

```json
{
  "title": "About Us",
  "slug": "about-us",
  "content": "About Us page content.",
  "status": "published"
}
```

### Update page

```http
PUT /api/pages/{id}
```

Example:

```http
PUT /api/pages/1
```

### Delete page

```http
DELETE /api/pages/{id}
```

Example:

```http
DELETE /api/pages/1
```

Create, update, and delete operations require authentication.

---

# Validation

Page data is validated on the Laravel server.

Required page fields include:

```text
title
slug
content
status
```

The slug must be unique.

Attempting to create a page using an existing slug results in a validation error.

Invalid requests return:

```text
422 Unprocessable Content
```

with field-specific validation errors.

The Vue management form reads these Laravel validation errors and displays them next to the relevant fields.

Server-side validation remains authoritative even when frontend validation is also present.

---

# Page Visibility

Page visibility depends on its publishing status.

### Published

A page with:

```text
status = published
```

can be retrieved using its public slug.

### Draft

A page with:

```text
status = draft
```

is not available through the public page route.

Attempting to retrieve a draft page publicly results in:

```text
404 Not Found
```

This prevents unpublished CMS content from being exposed to public visitors.

---

# Security

The Pages module follows the authentication and security rules used throughout the application.

Security measures include:

- Protected management endpoints
- Protected create, update, and delete operations
- Bearer-token authentication
- Server-side Laravel validation
- Unique slug validation
- Draft-page visibility restrictions
- Environment secrets excluded from source control
- No credentials or authentication tokens committed to the repository

Environment configuration should be stored locally in `.env`.

Only safe example values should be included in `.env.example`.

---

# Database and Migrations

The Pages module requires the pages database table.

After pulling the project, run:

```bash
php artisan migrate
```

To rebuild the local development database when appropriate:

```bash
php artisan migrate:fresh
```

If the project seeders are required:

```bash
php artisan db:seed
```

Or rebuild and seed in one command:

```bash
php artisan migrate:fresh --seed
```

---

# Testing

The project contains automated backend and frontend tests.

## Laravel Page API Tests

From:

```text
task-11-laravel-api
```

run:

```bash
php artisan test --filter=PageApiFeatureTest
```

The Pages feature tests cover:

- Public published-page retrieval
- Draft page public visibility restrictions
- Protected management access
- Authenticated page creation
- Required-field validation
- Duplicate slug validation
- Missing page response

Current Pages test result:

```text
7 passed
19 assertions
```

To run all Laravel tests:

```bash
php artisan test
```

---

## Vue Tests

From:

```text
task-07-vue-app
```

run:

```bash
npm test -- --run
```

The dynamic page tests cover:

- Loading a page by slug
- Handling a missing page
- Handling API/network failures

Current frontend test result:

```text
5 test files passed
13 tests passed
```

---

# Pages Module Example Flow

A typical CMS workflow is:

```text
Authenticated User
       |
       v
Pages Management
       |
       +---- Create Page
       |
       +---- Edit Page
       |
       +---- Delete Page
       |
       +---- Set Draft / Published
                 |
                 v
          Published Page
                 |
                 v
          /pages/:slug
```

For example, creating:

```text
Title: Contact Information
Slug: contact-information
Status: published
```

makes the page publicly accessible from:

```text
/pages/contact-information
```

Changing the same page to:

```text
status: draft
```

removes it from public access while keeping it available through the authenticated management interface.

---

# Error Handling

The application handles common API errors with appropriate responses and frontend feedback.

| Status | Meaning |
|---|---|
| `401` | Authentication is required or the session is invalid |
| `403` | The authenticated user is not authorized |
| `404` | Requested page was not found or is not publicly available |
| `422` | Request data failed Laravel validation |

Validation errors returned by Laravel are displayed in the Vue management form.

---

# Task 18 — Pages CMS

Task 18 extends the full-stack project with dynamic content management.

Implemented functionality includes:

- Pages database model and persistence
- Public published-page API
- Dynamic Vue page rendering
- Authenticated page management
- Create and edit forms
- Draft and published statuses
- Duplicate slug prevention
- Required-field validation
- Laravel validation feedback in Vue
- Missing-page handling
- Protected management actions
- Backend feature tests
- Frontend dynamic-page tests
- Pages module documentation

---

## Author

Developed as part of the Blue Tech Solutions Full-Stack Training Program.