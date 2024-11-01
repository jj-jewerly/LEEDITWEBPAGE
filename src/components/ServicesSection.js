// src/components/ServicesSection.js
import React from 'react';
import energyAnalysis from '../assets/energy-analysis.png';
import commissioning from '../assets/commissioning.jpg';
import leedit from '../assets/LEEDIT.webp';

function ServicesSection() {
  return (
    <section id="services" className="section bg-light py-5">
      <div className="container" data-aos="fade-up">
        <h2 className="text-center mb-5">Our Services</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img src={energyAnalysis} className="card-img-top img-fluid rounded-top" alt="Energy Analysis" />
              <div className="card-body text-center">
                <h5 className="card-title">Energy Analysis</h5>
                <p className="card-text">Energy efficiency analysis of buildings using the latest technology.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img src={commissioning} className="card-img-top img-fluid rounded-top" alt="Commissioning" />
              <div className="card-body text-center">
                <h5 className="card-title">Commissioning</h5>
                <p className="card-text">Professional commissioning services to ensure optimal system performance.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img src={leedit} className="card-img-top img-fluid rounded-top" alt="LEED Certification Automation Solutions" />
              <div className="card-body text-center">
                <h5 className="card-title">LEED Certification Automation Solutions</h5>
                <p className="card-text">Developing solutions to automate the LEED certification process, enhancing efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
