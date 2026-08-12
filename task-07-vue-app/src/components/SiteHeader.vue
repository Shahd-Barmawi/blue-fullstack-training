<script setup>
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();
</script>

<template>
  <header class="site-header">
    <div class="container header-container">
      <RouterLink to="/" class="brand">
        <img
          class="brand-logo"
          src="../assets/logo.png"
          alt="Blue Tech Solutions logo"
        />

        <h1>Blue Tech Solutions</h1>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        aria-label="Open navigation menu"
        aria-controls="main-navigation"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        class="main-navigation"
        id="main-navigation"
        aria-label="Main navigation"
      >
        <ul class="nav-list">
          <li>
            <RouterLink class="nav-link" to="/"> Home </RouterLink>
          </li>

          <li>
            <RouterLink class="nav-link" :to="{ path: '/', hash: '#about' }">
              About
            </RouterLink>
          </li>

          <li>
            <RouterLink class="nav-link" to="/services"> Services </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :to="{ path: '/', hash: '#statistics' }"
            >
              Statistics
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :to="{ path: '/services', hash: '#projects' }"
            >
              Projects
            </RouterLink>
          </li>

          <li>
            <RouterLink class="nav-link" to="/posts"> Posts </RouterLink>
          </li>

          <li>
            <RouterLink class="nav-link" to="/favorites">
              Favorites ({{ postsStore.favoriteCount }})
            </RouterLink>
          </li>

          <li>
            <RouterLink class="nav-link" to="/contact"> Contact </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
