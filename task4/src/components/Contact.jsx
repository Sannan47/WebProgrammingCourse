import { useState } from 'react'

function Contact() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [submitMessage, setSubmitMessage] = useState('')

  // Handle input change events
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault()

    // Validate form data
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitMessage('Please fill in all fields.')
      return
    }

    // Log form data to console
    console.log('Form Submitted with the following data:')
    console.log({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      timestamp: new Date().toLocaleString()
    })

    // Show success message
    setSubmitMessage(`Thank you, ${formData.name}! Your message has been received.`)

    // Clear form fields
    clearForm()
  }

  // Clear form fields
  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      message: ''
    })
    // Clear success message after 5 seconds
    setTimeout(() => setSubmitMessage(''), 5000)
  }

  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>Have a message for us? Please fill out the form below and we'll get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Submit</button>
          <button type="button" className="btn-clear" onClick={clearForm}>Clear</button>
        </div>
      </form>

      {submitMessage && (
        <div className="submit-message success">
          {submitMessage}
        </div>
      )}
    </div>
  )
}

export default Contact
