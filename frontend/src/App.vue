<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <span class="logo-icon">📈</span>
        <span class="logo-text">TradingAI</span>
      </div>

      <!-- Mobile Hamburger Button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="hamburger-line" :class="{ open: mobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ open: mobileMenuOpen }"></span>
        <span class="hamburger-line" :class="{ open: mobileMenuOpen }"></span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="nav-links desktop-nav">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/dashboard" exact-active-class="active">Dashboard</RouterLink>
      </nav>

      <!-- Mobile Navigation -->
      <transition name="slide">
        <nav v-if="mobileMenuOpen" class="mobile-nav" @click="closeMobileMenu">
          <RouterLink to="/" exact-active-class="active">Home</RouterLink>
          <RouterLink to="/dashboard" exact-active-class="active">Dashboard</RouterLink>
        </nav>
      </transition>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
/* Navbar Styles */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.8rem;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-links a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: left 0.3s ease;
}

.nav-links a:hover::before {
  left: 0;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

.nav-links .active {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 2rem;
  height: 0.25rem;
  background: white;
  border-radius: 10px;
  transition: all 0.3s ease;
  transform-origin: 1px;
}

.hamburger-line.open:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger-line.open:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger-line.open:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
}

/* Main Content */
.main-content {
  min-height: calc(100vh - 80px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1.5rem;
  }

  .logo {
    font-size: 1.3rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 70px;
    right: 0;
    width: 100%;
    max-width: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
    padding: 2rem 1rem;
    gap: 0.5rem;
    border-radius: 0 0 0 20px;
  }

  .mobile-nav a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: center;
  }

  .mobile-nav a:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateX(-5px);
  }

  .mobile-nav .active {
    background-color: rgba(255, 255, 255, 0.25);
    color: white;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 1rem;
  }

  .logo-text {
    font-size: 1.1rem;
  }
}

/* Slide Transition */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
