// src/components/TestimonialsSection.js
import React from 'react';

function TestimonialsSection() {
  return (
    <section id="testimonials" className="section bg-white py-5">
      <div className="container" data-aos="fade-up">
        <h2 className="text-center mb-5">Testimonials</h2>
        <div className="row justify-content-center">
          <div className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <p className="card-text text-muted">"EverPoint's solutions have made LEED certification much simpler."</p>
                <h5 className="card-title mt-4 text-primary">- HanmiGlobal</h5>
              </div>
            </div>
          </div>
          {/* 추가적인 고객 평가를 여기에 추가할 수 있습니다 */}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
