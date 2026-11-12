import React from 'react'

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">
        WASI<span>.</span>
      </h2>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <a href="mailto:your-email@example.com" className="nav-btn">
        Let&apos;s Talk
      </a>
    </nav>
  )
}

export default Navbar
