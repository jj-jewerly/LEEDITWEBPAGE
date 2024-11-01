// src/components/FounderSection.js
import React from 'react';

function FounderSection() {
  return (
    <section id="founder" className="section bg-light">
      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h3 className="text-primary mb-4">Founder & CEO</h3>
            <p className="lead">
              Graduated from Michigan Tech with a degree in Mechanical Engineering, holding certifications including Mechanical FE, LEED AP BD+C, ID+C, and ACG Cx Authority.
              With expertise in energy analysis and commissioning, established EverPoint to achieve automation and connectivity in LEED certification tasks.
              Currently developing software using Python, GIS, API, and various datasets to simplify the process of earning LEED credits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FounderSection;