// src/components/ProductsSection.js
import React from 'react';
import leedLogo from '../assets/LEEDIT.webp'; // 이미지 파일명을 실제 파일명으로 변경해주세요

function ProductsSection() {
  return (
    <section id="products" className="section">
      <div className="container" data-aos="fade-up">
        <h2 className="text-center mb-5">Products</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-img-wrapper">
                <img 
                  src={leedLogo} 
                  className="card-img-top img-fluid" 
                  alt="LEED Certification Automation Software" 
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">LEED Certification Automation Software</h5>
                <p className="card-text">
                  Software that simplifies earning LEED credits by utilizing GIS, API, blueprints, and various datasets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;