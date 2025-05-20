import React, { useState } from 'react';
import Contact from 'app/components/UI/Contact';
const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormErrors({
      ...formErrors,
      [e.target.name]: '',
    });
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      setSubmitted(true);
      // Here you could handle sending form data to backend or an API
      // For now, just simulate success
    } else {
      setFormErrors(errors);
      setSubmitted(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      <p style={styles.subtitle}>We'd love to hear from you! Please fill out the form below.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            id="name"
            style={{ ...styles.input, borderColor: formErrors.name ? '#e74c3c' : '#ccc' }}
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
          {formErrors.name && <span style={styles.error}>{formErrors.name}</span>}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            style={{ ...styles.input, borderColor: formErrors.email ? '#e74c3c' : '#ccc' }}
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
          {formErrors.email && <span style={styles.error}>{formErrors.email}</span>}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="subject" style={styles.label}>Subject</label>
          <input
            type="text"
            name="subject"
            id="subject"
            style={{ ...styles.input, borderColor: formErrors.subject ? '#e74c3c' : '#ccc' }}
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject of your message"
          />
          {formErrors.subject && <span style={styles.error}>{formErrors.subject}</span>}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>Message</label>
          <textarea
            name="message"
            id="message"
            rows={5}
            style={{ ...styles.textarea, borderColor: formErrors.message ? '#e74c3c' : '#ccc' }}
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
          />
          {formErrors.message && <span style={styles.error}>{formErrors.message}</span>}
        </div>
        <button type="submit" style={styles.button}>Send Message</button>
        {submitted && <p style={styles.success}>Thank you! Your message has been sent.</p>}
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    backgroundColor: '#f9fafa',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#7f8c8d',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 6,
    fontWeight: 600,
  },
  input: {
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  textarea: {
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px 20px',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  success: {
    marginTop: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
};

export default ContactUsPage;
