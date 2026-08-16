<script setup>
import { usePostsStore } from "../stores/posts";
import { useActiveNavigation } from "../composables/useActiveNavigation";
import { useMobileMenu } from "../composables/useMobileMenu";

const postsStore = usePostsStore();

const { activeSection } = useActiveNavigation();

const { isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
</script>

<template>
  <header class="site-header">
    <div class="container header-container">
      <RouterLink to="/" class="brand" @click="closeMenu">
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
        aria-label="Toggle navigation menu"
        aria-controls="main-navigation"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        class="main-navigation"
        :class="{ 'is-open': isMenuOpen }"
        id="main-navigation"
        aria-label="Main navigation"
      >
        <ul class="nav-list">
          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'home' }"
              to="/"
              @click="closeMenu"
            >
              Home
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'about' }"
              :to="{ path: '/', hash: '#about' }"
              @click="closeMenu"
            >
              About
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'services' }"
              to="/services"
              @click="closeMenu"
            >
              Services
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'statistics' }"
              :to="{ path: '/', hash: '#statistics' }"
              @click="closeMenu"
            >
              Statistics
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'projects' }"
              :to="{ path: '/services', hash: '#projects' }"
              @click="closeMenu"
            >
              Projects
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'posts' }"
              to="/posts"
              @click="closeMenu"
            >
              Posts
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'favorites' }"
              to="/favorites"
              @click="closeMenu"
            >
              Favorites ({{ postsStore.favoriteCount }})
            </RouterLink>
          </li>

          <li>
            <RouterLink
              class="nav-link"
              :class="{ active: activeSection === 'contact' }"
              to="/contact"
              @click="closeMenu"
            >
              Contact
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
