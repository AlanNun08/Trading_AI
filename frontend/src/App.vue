<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="logo">📈 Stock Viewer</div>

      <nav class="nav-links">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/dashboard" exact-active-class="active">Stocks</RouterLink>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
/* Basic layout */
.navbar {
  background-color: #1a1a1a;
  padding: 1rem 2rem;
  color: white;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.2s;
}

.nav-links a:hover {
  background-color: #333;
  color: white;
}

.nav-links .active {
  background-color: #007bff;
  color: white;
}

/* Optional: page spacing below header */
.main-content {
  padding: 2rem;
}
</style>
