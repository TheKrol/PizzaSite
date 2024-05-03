import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Sidebar from '../components/Sidebar';
import './contact.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const Contact = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Sending email using emailjs
    emailjs
      .sendForm(
        'service_mnjrj7x',
        'template_lt5hdio',
        e.target,
        'K2pia5vh68GOXOjpb'
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);

          // Show a custom toast message for successful email sending
          toast.success('Email sent successfully!', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });


          setSuccess(true);
        },
        (error) => {
          console.error('Email send failed:', error.text);

          // Show a custom toast message for failed email sending
          toast.error('Email send failed.');
          setSuccess(false);
        }
      );

    // Clear the form after sending email
    setFormData({ from_name: '', from_email: '', message: '' });
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar for navigation */}
      <Sidebar />
      <div className="contact-container">
        {/* Contact form */}
        <div className='Contact-container-background'>
          <h1 className="contact-heading">Contact Us</h1>


          {/* Form for submitting contact details */}
          <form onSubmit={sendEmail} className="contact-form">
            <div className="form-group">
              <label htmlFor="from_name">Full Name</label>
              <input
                type="text"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                required
                placeholder='Enter your  full name'
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="from_email">Email</label>
              <input
                type="email"
                name="from_email"
                value={formData.from_email}
                onChange={handleChange}
                required
                placeholder='Enter your email'
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={500}
                className="form-control"
                placeholder='Enter your message'

              />
              <p><br></br>You can't write no more than  {500 - formData.message.length}  characters</p>
            </div>
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>

          <ToastContainer position="top-center" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
