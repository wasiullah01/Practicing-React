
import React from 'react'

function Skills() {

  const skills = [
    { name: "JavaScript", level: "Learning" },
    { name: "React", level: "Learning" },
    { name: "Python", level: "Intermediate" },
    { name: "Artificial Intelligence", level: "Projects" },
    { name: "Machine Learning", level: "Projects" },
    { name: "Cybersecurity", level: "Learning" },
    { name: "HTML & CSS", level: "Fundamentals" },
    { name: "Git & GitHub", level: "Learning" }
  ];

  return (
    <section className="skills-section">

      <div className="section-heading">
        <p>WHAT I WORK WITH</p>
        <h2>My Technical Skills</h2>
        <span>
          Technologies and areas I'm exploring and building with.
        </span>
      </div>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div className="skill-card" key={index}>
            <h3>{skill.name}</h3>
            <p>{skill.level}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Skills
