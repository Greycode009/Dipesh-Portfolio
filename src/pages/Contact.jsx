import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import '../Contact.css';

// EmailJS configuration
const SERVICE_ID = 'service_ypix5q7';
const TEMPLATE_ID = 'template_5jfszow';
const USER_ID = 'XWDNojF92emN4PUsd';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const form = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setCurrentField(field);
  };

  const handleBlur = () => {
    setCurrentField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Send the email using EmailJS
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, USER_ID)
      .then((response) => {
        console.log('Email sent successfully:', response);
        setStatus('success');
        // Reset form after submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setStatus('error');
        setTimeout(() => setStatus(''), 5000); // Clear status after 5 seconds
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="contact-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="contact-wrapper">
        <motion.div className="contact-info" variants={itemVariants}>
          <h1>Let's Connect</h1>
          <p className="subtitle">I'm excited to collaborate on your next project</p>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="h-12 w-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="info-content">
                <h3>Location</h3>
                <p>Nepalgunj, Nepal</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="h-12 w-12 bg-[var(--color-primary)]  rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="info-content">
                <h3>Email</h3>
                <p>dipeshmalla000@gmail.com</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="h-12 w-12 bg-[var(--color-primary)]   rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="info-content">
                <h3>Phone</h3>
                <p>+977 9869705507</p>
              </div>
            </div>
          </div>
          
          <div className="contact-availability">
            <div className="availability-indicator">
              <span className="status-dot"></span>
              <span>Available for freelance work</span>
            </div>
            <p>I typically respond within 24 hours</p>
          </div>
        </motion.div>
        
        <motion.div className="contact-form-container" variants={itemVariants}>
          <div className="form-header">
            <h2>Hire Me for Your Project</h2>
            <p>Fill out the form below to discuss your project needs</p>
          </div>
          
          <form className="contact-form" ref={form} onSubmit={handleSubmit}>
            <div className={`form-group ${currentField === 'name' ? 'focused' : ''}`}>
              <label htmlFor="name">
                <i className="fa-solid fa-user text-[var(--color-primary)]"></i>
                <span>Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                required
              />
              <div className="focus-border"></div>
            </div>
            
            <div className={`form-group ${currentField === 'email' ? 'focused' : ''}`}>
              <label htmlFor="email">
                <i className="fa-solid fa-envelope text-[var(--color-primary)]"></i>
                <span>Email</span>
              </label>
              <input
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                required
              />
              <div className="focus-border"></div>
            </div>
            
            <div className={`form-group ${currentField === 'subject' ? 'focused' : ''}`}>
              <label htmlFor="subject">
                <i className="fa-solid fa-tag text-[var(--color-primary)]"></i>
                <span>Subject & Budget</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => handleFocus('subject')}
                onBlur={handleBlur}
                required
              />
              <div className="focus-border"></div>
            </div>
            
            <div className={`form-group ${currentField === 'message' ? 'focused' : ''}`}>
              <label htmlFor="message">
                <i className="fa-solid fa-message text-[var(--color-primary)]"></i>
                <span>Message</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={handleBlur}
                rows="5"
                required
              ></textarea>
              <div className="focus-border"></div>
            </div>

            {/* Hidden field for recipient email */}
            <input type="hidden" name="to_email" value="gamerdipesh002@gmail.com" />
            
            <div className="form-footer">
              <motion.button 
                type="submit" 
                className="submit-btn " 
                disabled={status === 'sending'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === 'sending' ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane "></i>
                    <span>Hire Me</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
          
          {status === 'success' && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <i className="fa-solid fa-circle-check"></i>
              <p>Thanks for reaching out! I'll review your project request and get back to you soon.</p>
            </motion.div>
          )}
          
          {status === 'error' && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <i className="fa-solid fa-circle-exclamation"></i>
              <p>Failed to send message. Please try again later.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <motion.div 
        className="contact-background-elements"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-element element-1"></div>
        <div className="bg-element element-2"></div>
        <div className="bg-element element-3"></div>
      </motion.div>
    </motion.div>
  );
}

export default Contact; 