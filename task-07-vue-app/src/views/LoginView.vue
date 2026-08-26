<script setup>
import { useLogin } from "../composables/useLogin";

const { email, password, loading, error, login } = useLogin();
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-heading">
        <p class="login-label">ACCOUNT</p>

        <h1>Login</h1>

        <p>Sign in to manage your posts.</p>
      </div>

      <form class="login-form" @submit.prevent="login">
        <div class="login-form-group">
          <label for="email"> Email </label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
            :disabled="loading"
          />
        </div>

        <div class="login-form-group">
          <label for="password"> Password </label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
            :disabled="loading"
          />
        </div>

        <p v-if="error" class="login-error">
          {{ error }}
        </p>

        <button class="login-button" type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </section>
  </main>
</template>
