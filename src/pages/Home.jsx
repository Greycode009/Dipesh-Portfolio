import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Define the heartbeat animation keyframes
const heartbeat = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: {
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  },
};

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20">
      <motion.div
        className="flex flex-col-reverse md:flex-row items-center justify-between py-16 min-h-[70vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex-1 md:pr-10 mt-8 md:mt-0">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Hi, I'm <span className="text-primary">Dipesh Malla</span>
          </motion.h1>
          <motion.h2
            className="text-2xl text-dimtext font-normal mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {" "}
            Full Stack Developer
          </motion.h2>
          <motion.p
            className="text-lg leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            I specialize in building modern web applications with React and
            Node.js, focusing on scalable solutions and exceptional user
            experiences.
          </motion.p>

          <motion.div
            className="flex gap-5 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              to="/projects"
              className="bg-primary text-darktext px-6 py-3 rounded font-medium transition-all duration-300 hover:bg-secondary hover:-translate-y-1"
            >
              View Work
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary  px-6 py-3 rounded font-medium transition-all duration-300 hover:bg-primary/10 hover:-translate-y-1"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="relative w-4/5 p-2 max-w-md overflow-hidden rounded-full shadow-2xl"
            animate={heartbeat}
          >
            {/* Using logo.png as Dipesh Malla's image */}
            <img
              src="https://i.ibb.co/prB36m9q/logo.png"
              alt="Dipesh Malla"
              className="w-full h-auto block"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-14 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <h2 className="text-3xl text-center text-primary mb-10 relative after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[var(--color-primary)]  after:rounded-md">
          My Expertise
        </h2>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="bg-surface p-8 rounded-xl border border-primary/10 relative overflow-hidden transition-all duration-300"
            whileHover={{
              y: -15,
              boxShadow: "0 15px 30px rgba(150, 150, 150, 0.2)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>

            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-2xl text-primary">
              <i className="fas fa-code"></i>
            </div>
            <h3 className="text-xl font-medium mb-3  group-hover:text-primary transition-colors">
              Frontend Development
            </h3>
            <p className="text-dimtext mb-4">
              Creating responsive and interactive user interfaces with React,
              HTML, CSS, and JavaScript.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                React
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                JavaScript
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                CSS3
              </span>
            </div>
          </motion.div>

          <motion.div
            className="bg-surface p-8 rounded-xl border border-primary/10 relative overflow-hidden transition-all duration-300"
            whileHover={{
              y: -15,
              boxShadow: "0 15px 30px rgba(150, 150, 150, 0.2)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>{" "}
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-2xl text-primary">
              <i className="fab fa-node-js"></i>
            </div>
            <h3 className="text-xl font-medium mb-3  group-hover:text-primary transition-colors">
              Backend Development
            </h3>
            <p className="text-dimtext mb-4">
              Building robust server-side applications and APIs using Node.js
              and modern backend technologies.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                Node.js
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                Express.js
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                PostgreSQL
              </span>
            </div>
          </motion.div>

          <motion.div
            className="bg-surface p-8 rounded-xl border border-primary/10 relative overflow-hidden transition-all duration-300"
            whileHover={{
              y: -15,
              boxShadow: "0 15px 30px rgba(150, 150, 150, 0.2)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-2xl text-primary">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3 className="text-xl font-medium mb-3  group-hover:text-primary transition-colors">
              Responsive Web Design
            </h3>
            <p className="text-dimtext mb-4">
              Building websites that work seamlessly across all devices, from
              desktop to mobile.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                Media Queries
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                Flexbox
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5">
                Grid
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Link
            to="/about"
            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary font-medium rounded-full transition-all duration-300 hover:bg-primary/20"
          >
            View My Full Skill Set{" "}
            <i className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
