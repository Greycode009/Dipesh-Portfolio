import React, { useState } from "react";
import { motion } from "framer-motion";
import SocialIcons from "../components/SocialIcons";
import "../About.css";

function About() {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const skills = [
    {
      name: "React",
      icon: "fab fa-react",
      description:
        "Building interactive UIs with modern React features including hooks, context API, and custom components. Expert in React ecosystem.",
      category: "frontend",
    },
    {
      name: "JavaScript",
      icon: "fab fa-js-square",
      description:
        "Creating dynamic web experiences with ES6+ features, asynchronous programming, and modern JavaScript patterns and best practices.",
      category: "frontend",
    },
    {
      name: "HTML5 & CSS3",
      icon: "fab fa-html5",
      description:
        "Crafting semantic markup and responsive designs with modern CSS techniques including Grid, Flexbox, and CSS animations.",
      category: "frontend",
    },
    {
      name: "Tailwind CSS",
      icon: "tailwind-icon",
      description:
        "Creating beautiful, responsive designs with utility-first CSS framework. Experienced in custom configuration and component design.",
      category: "frontend",
    },
    {
      name: "UI/UX Design",
      icon: "fas fa-palette",
      description:
        "Designing intuitive interfaces focused on accessibility and user experience. Skilled in wireframing, prototyping, and user testing.",
      category: "frontend",
    },
    {
      name: "Git & GitHub",
      icon: "fab fa-git-alt",
      description:
        "Version control and collaborative development with Git and GitHub. Experienced with branching strategies, pull requests, and team workflows.",
      category: "development",
    },
    {
      name: "Node.js",
      icon: "fab fa-node-js",
      description:
        "Building scalable server-side applications with Node.js. Proficient in Express.js for RESTful APIs and backend services.",
      category: "backend",
    },
    {
      name: "Sequelize ORM",
      icon: "fas fa-database",
      description:
        "Expertise in database modeling and management using Sequelize ORM with Node.js. Proficient in relationships, migrations, and queries.",
      category: "backend",
    },
    {
      name: "PostgreSQL",
      icon: "fas fa-database",
      description:
        "Advanced database design and management with PostgreSQL. Experienced in complex queries, optimizations, and data modeling.",
      category: "database",
    },
  ];

  const timeline = [
    {
      year: "2025",
      title: "Full Stack Developer",
      description:
        "Started working on more complex full-stack applications and AI integrations.",
      highlight: true,
    },
    {
      year: "2024",
      title: "Frontend Specialist",
      description: "Specialized in React and modern frontend frameworks.",
      highlight: true,
    },
    {
      year: "2023",
      title: "Web Development Journey",
      description:
        "Began learning web development through online courses and personal projects.",
      highlight: true,
    },
    {
      year: "2022",
      title: "Programming Foundations",
      description:
        "Started exploring the world of programming and computer science.",
      highlight: true,
    },
  ];

  return (
    <div className="about-container">
      <motion.section
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-overlay"></div>{" "}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          About Me
        </motion.h1>
        <motion.div
          className="about-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span>Full Stack Developer</span>
          <svg
            className="separator-dot"
            width="5"
            height="5"
            viewBox="0 0 5 5"
            aria-hidden="true"
          >
            <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
          </svg>
          <span>React Developer</span>
          <svg
            className="separator-dot"
            width="5"
            height="5"
            viewBox="0 0 5 5"
            aria-hidden="true"
          >
            <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
          </svg>
          <span>Node.js Developer</span>
        </motion.div>
      </motion.section>

      <div className="about-content">
        <motion.section
          className="bio-section"
          {...fadeIn}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2>My Story</h2>
          <div className="bio-container">
            <div className="bio-text">
              {" "}
              <p>
                Hi, I'm <span className="highlight">Dipesh Malla</span>, a
                full-stack developer from Nepal. I specialize in building modern
                web applications using React on the frontend and Node.js on the
                backend. My passion lies in creating scalable and efficient
                solutions that deliver exceptional user experiences.
              </p>
              <p>
                With 2 years of experience in web development, I've evolved from
                frontend development with React and JavaScript to mastering
                full-stack development. I work extensively with Node.js,
                Express, and PostgreSQL to build robust backend systems. I'm
                particularly passionate about creating clean, maintainable code
                and implementing efficient database solutions that power
                seamless user experiences.
              </p>
            </div>
            <div className="bio-image">
              <div className="image-frame">
                {/* Using logo.png from public folder */}
                <img
                  src="https://i.postimg.cc/Pq4BzmS1/bio-logo.png"
                  alt="Dipesh Malla"
                />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="skills-section"
          {...fadeIn}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2>My Skills</h2>
          <div className="skills-container">
            <div className="skills-categories">
              <div className="category-tags">
                <span
                  className={`category-tag all ${
                    activeCategory === "all" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("all")}
                >
                  All
                </span>
                <span
                  className={`category-tag frontend ${
                    activeCategory === "frontend" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("frontend")}
                >
                  Frontend
                </span>
                <span
                  className={`category-tag development ${
                    activeCategory === "backend" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("backend")}
                >
                  Backend
                </span>
                {/* <span
                  className={`category-tag design ${
                    activeCategory === "design" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("design")}
                >
                  Design
                </span> */}

                <span
                  className={`category-tag database ${
                    activeCategory === "database" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("database")}
                >
                  Database
                </span>
                <span
                  className={`category-tag development ${
                    activeCategory === "development" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("development")}
                >
                  Development
                </span>
              </div>
            </div>

            <div className="skills-grid">
              {skills
                .filter(
                  (skill) =>
                    activeCategory === "all" ||
                    skill.category === activeCategory
                )
                .map((skill, index) => (
                  <motion.div
                    className={`skill-card ${skill.category}`}
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    whileHover={{
                      y: -10,
                      boxShadow: "0 10px 25px rgba(187, 134, 252, 0.3)",
                      transition: { duration: 0.2 },
                    }}
                    data-skill={skill.name}
                  >
                    <div className="skill-icon">
                      {skill.icon === "tailwind-icon" ? (
                        <i className={skill.icon}></i>
                      ) : (
                        <i className={skill.icon}></i>
                      )}
                    </div>
                    <h3>{skill.name}</h3>
                    <p>{skill.description}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="journey-section"
          {...fadeIn}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2>My Journey</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <motion.div
                className={`timeline-item ${
                  item.highlight ? "highlight-journey" : ""
                }`}
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
              >
                <div className="timeline-content">
                  <div className="year-badge">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
            <div className="timeline-line"></div>
          </div>
        </motion.section>

        <motion.div
          className="quote-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <blockquote>
            "When I'm not coding, you'll find me contributing to open-source,
            helping peers learn, or exploring the latest in web development
            technologies. I believe in lifelong learning, mentorship, and giving
            back to the tech community."
          </blockquote>
        </motion.div>

        <motion.section
          className="connect-section"
          {...fadeIn}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2>Let's Connect</h2>
          <p>
            I'm always open to new opportunities, collaborations, and
            interesting conversations.
          </p>
          <SocialIcons />
        </motion.section>
      </div>
    </div>
  );
}

export default About;
