<script setup></script>

<template>
  <header class="site-header">
    <div class="container header-container">
      <a href="#hero" class="brand">
        <img
          class="brand-logo"
          src="../assets/logo.png"
          alt="Blue Tech Solutions logo"
        />

        <h1>Blue Tech Solutions</h1>
      </a>

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
            <a class="nav-link" href="#hero">Home</a>
          </li>

          <li>
            <a class="nav-link" href="#about">About</a>
          </li>

          <li>
            <a class="nav-link" href="#services">Services</a>
          </li>

          <li>
            <a class="nav-link" href="#statistics">Statistics</a>
          </li>

          <li>
            <a class="nav-link" href="#projects">Projects</a>
          </li>

          <li>
            <a class="nav-link" href="#posts">Posts</a>
          </li>

          <li>
            <a class="nav-link" href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
