import React from 'react'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Skills from './components/Skills'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Skills />
      </main>

      <Footer />
    </>
  )
}

export default App
