// src/components/ContactSection.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  emailjs.init("ESn5zxgJxz64qdq7J");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    emailjs.send(
      'service_hr31ncb', // EmailJS Service ID
      'template_8oz7iho', // EmailJS Template ID
      {
        to_email: 'gnt8521@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      'YOUR_USER_ID' // EmailJS User ID
    )
    .then((response) => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    })
    .catch((error) => {
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    });
  };

  return (
    <section id="contact" className="section bg-light">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Send Message
                  </button>
                  {status === 'success' && (
                    <div className="alert alert-success mt-3">
                      Message sent successfully!
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="alert alert-danger mt-3">
                      Failed to send message. Please try again.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;