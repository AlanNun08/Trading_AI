<template>
  <main class="home">
    <section class="hero">
      <h1>📈 Welcome to Trading AI</h1>
      <p>
        Empower your trades with live data, news tracking, and AI-generated insights —
        all in one sleek dashboard built for serious investors.
      </p>
      <router-link to="/dashboard" class="cta-button">Launch Dashboard</router-link>
    </section>

    <section class="features">
      <div class="feature">
        <h2>🔥 Top Gainers</h2>
        <p>Quickly identify the biggest movers of the day and track their momentum.</p>
      </div>
      <div class="feature">
        <h2>📊 Live & Historical Charts</h2>
        <p>Switch between 1-day live data and 30-day trends with dynamic visualizations.</p>
      </div>
      <div class="feature">
        <h2>🧠 AI Market Insights</h2>
        <p>Understand news impact instantly with AI summaries and investment guidance.</p>
      </div>
    </section>

    <section class="footer">
      <p>Built for traders using Java, Vue 3, OpenAI, and Polygon.io APIs.</p>
      <router-link to="/dashboard">Explore Dashboard →</router-link>
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>
.home {
  padding: 2rem;
  background: #f5f9ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #212529;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #0d6efd;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #0b5ed7;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  text-align: left;
}

.feature h2 {
  color: #0d6efd;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.footer {
  text-align: center;
  font-size: 0.95rem;
  color: #6c757d;
  margin-top: 2rem;
}

.footer a {
  margin-left: 0.5rem;
  color: #0d6efd;
  text-decoration: underline;
  font-weight: 500;
}
</style>
