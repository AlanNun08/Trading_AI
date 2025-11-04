<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">✨</span>
          <span class="badge-text">AI-Powered Trading</span>
        </div>
        <h1 class="hero-title">
          Welcome to <span class="gradient-text">TradingAI</span>
        </h1>
        <p class="hero-description">
          Empower your trades with real-time data, intelligent news tracking, and AI-generated insights.
          All in one sleek dashboard built for serious investors.
        </p>
        <div class="cta-buttons">
          <router-link to="/dashboard" class="cta-button primary">
            <span>Launch Dashboard</span>
            <span class="button-icon">→</span>
          </router-link>
          <a href="#features" class="cta-button secondary">Learn More</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-card card-1">
          <div class="card-header">AAPL</div>
          <div class="card-value">+12.5%</div>
        </div>
        <div class="floating-card card-2">
          <div class="card-header">TSLA</div>
          <div class="card-value">+8.3%</div>
        </div>
        <div class="floating-card card-3">
          <div class="card-header">NVDA</div>
          <div class="card-value">+15.7%</div>
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <h2 class="section-title">Powerful Trading Features</h2>
      <div class="features-grid">
        <div class="feature" data-aos="fade-up">
          <div class="feature-icon">🔥</div>
          <h3>Top Gainers</h3>
          <p>Instantly identify the biggest market movers and track their momentum in real-time.</p>
        </div>
        <div class="feature" data-aos="fade-up" data-aos-delay="100">
          <div class="feature-icon">📊</div>
          <h3>Live & Historical Charts</h3>
          <p>Switch seamlessly between 1-day live data and 30-day trends with dynamic visualizations.</p>
        </div>
        <div class="feature" data-aos="fade-up" data-aos-delay="200">
          <div class="feature-icon">🧠</div>
          <h3>AI Market Insights</h3>
          <p>Understand market news impact instantly with AI-powered summaries and investment guidance.</p>
        </div>
        <div class="feature" data-aos="fade-up" data-aos-delay="300">
          <div class="feature-icon">⚡</div>
          <h3>Real-Time Updates</h3>
          <p>Get instant price updates and market data to make informed trading decisions quickly.</p>
        </div>
        <div class="feature" data-aos="fade-up" data-aos-delay="400">
          <div class="feature-icon">📱</div>
          <h3>Mobile Responsive</h3>
          <p>Trade on the go with our fully responsive design that works flawlessly on any device.</p>
        </div>
        <div class="feature" data-aos="fade-up" data-aos-delay="500">
          <div class="feature-icon">🎯</div>
          <h3>Smart Alerts</h3>
          <p>Never miss an opportunity with intelligent alerts for price movements and market events.</p>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="stat-item">
        <div class="stat-value">1000+</div>
        <div class="stat-label">Active Traders</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">$10M+</div>
        <div class="stat-label">Trading Volume</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">99.9%</div>
        <div class="stat-label">Uptime</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">24/7</div>
        <div class="stat-label">Support</div>
      </div>
    </section>

    <section class="footer">
      <div class="footer-content">
        <p class="footer-tech">Built with Vue 3, Java, OpenAI, and Polygon.io APIs</p>
        <router-link to="/dashboard" class="footer-link">Get Started Now →</router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>
.home {
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1a202c;
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 85vh;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.badge-icon {
  font-size: 1.2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cta-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.cta-button.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.cta-button.secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
}

.button-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .button-icon {
  transform: translateX(5px);
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 500px;
  animation: fadeIn 1s ease-out 0.3s both;
}

.floating-card {
  position: absolute;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
  min-width: 150px;
}

.floating-card.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.floating-card.card-2 {
  top: 40%;
  right: 20%;
  animation-delay: 1s;
}

.floating-card.card-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 2s;
}

.card-header {
  font-weight: 700;
  font-size: 1.2rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Features Section */
.features {
  padding: 5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  color: #1a202c;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

.feature h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
}

.feature p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Stats Section */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 4rem auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Footer Section */
.footer {
  padding: 3rem 2rem;
  text-align: center;
  background: #f8f9ff;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-tech {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-link:hover {
  transform: translateX(5px);
  color: #764ba2;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1.5rem;
  }

  .hero-visual {
    height: 300px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
    min-height: auto;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .hero-visual {
    display: none;
  }

  .cta-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features {
    padding: 3rem 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
    margin: 2rem 1rem;
    padding: 2rem 1rem;
  }

  .stat-value {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .feature {
    padding: 1.5rem;
  }
}
</style>
