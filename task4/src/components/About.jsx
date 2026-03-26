function About() {
  return (
    <div className="page-container">
      <h1>About This Application</h1>
      <div className="about-content">
        <h2>Project Overview</h2>
        <p>
          This React application demonstrates the implementation of client-side routing and
          form handling using modern React practices. It showcases how to build single-page
          applications (SPAs) that provide a seamless user experience.
        </p>

        <h2>Technologies Used</h2>
        <ul>
          <li><strong>React 19:</strong> A JavaScript library for building user interfaces with reusable components</li>
          <li><strong>Vite:</strong> Next generation frontend tooling with lightning fast HMR</li>
          <li><strong>React Router 6:</strong> Enables client-side routing for navigation without page reloads</li>
          <li><strong>React Hooks:</strong> useState for managing component state and local data</li>
        </ul>

      </div>
    </div>
  )
}

export default About
