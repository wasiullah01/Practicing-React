import React from 'react'
import profileImage from '../assets/profile.png'

function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero-content">
        <p className="hero-tag">HELLO, I&apos;M WASI 👋</p>

        <h1>
          Building the Future with
          <span> AI &amp; Technology.</span>
        </h1>

        <p className="hero-description">
          I&apos;m a Computer Science graduate passionate about Artificial
          Intelligence, Machine Learning, Cybersecurity and building useful
          digital products.
        </p>

        <div className="hero-buttons">
          <a href="#skills" className="primary-btn">
            Explore My Skills
          </a>
          <a href="mailto:your-email@example.com" className="secondary-btn">
            Contact Me
          </a>
        </div>

        <div className="hero-info">
          <div>
            <h3>CS</h3>
            <p>Graduate</p>
          </div>
          <div>
            <h3>AI/ML</h3>
            <p>Enthusiast</p>
          </div>
          <div>
            <h3>Tech</h3>
            <p>Explorer</p>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src={profileImage} alt="Wasi" className="profile-image" />
        <p>Learning. Building. Growing.</p>
      </div>
    </section>
  )
}

export default Hero
