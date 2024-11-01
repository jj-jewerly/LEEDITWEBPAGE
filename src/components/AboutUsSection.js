// src/components/AboutUsSection.js
import React from 'react';

function AboutUsSection() {
  return (
    <section id="about" className="section py-5 bg-light">
      <div className="container" data-aos="fade-up">
        <h2 className="text-center mb-5">About Us</h2>
        <p className="text-center lead">
          EverPoint, established on August 16, 2024, is a company located in Sangil-dong, Gangdong-gu, Seoul. 
          We specialize in energy analysis, commissioning, and developing automation solutions for LEED certification. 
          Our goal is to achieve automation and connectivity in LEED certification work, providing more efficient services to our clients. 
          Currently, we are collaborating with HanmiGlobal on the Yangju Okjeong Logistics Warehouse project.
        </p>
      </div>
    </section>
  );
}

export default AboutUsSection;
