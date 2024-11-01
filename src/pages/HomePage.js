// src/pages/HomePage.js
import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import AboutUsSection from '../components/AboutUsSection';
import ServicesSection from '../components/ServicesSection';
import ProductsSection from '../components/ProductsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FounderSection from '../components/FounderSection';
import ContactSection from '../components/ContactSection';

function HomePage() {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 80;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <ProductsSection />
      <TestimonialsSection />
      <FounderSection />
      <ContactSection />
    </>
  );
}

export default HomePage;