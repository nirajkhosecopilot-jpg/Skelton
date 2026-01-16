import { useState } from 'react';
import './ProjectDescriptionForm.css';

function ProjectDescriptionForm() {
  const [formData, setFormData] = useState({
    projectDescription: '',
    backendFramework: '',
    frontendFramework: '',
    database: '',
    messagingQueue: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const backendOptions = [
    'Node.js (Express)',
    'Node.js (NestJS)',
    'Python (Django)',
    'Python (FastAPI)',
    'Python (Flask)',
    'Java (Spring Boot)',
    'Ruby on Rails',
    '.NET Core',
    'Go',
    'PHP (Laravel)',
    'Other'
  ];

  const frontendOptions = [
    'React',
    'Vue.js',
    'Angular',
    'Next.js',
    'Svelte',
    'Vanilla JavaScript',
    'Other'
  ];

  const databaseOptions = [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'SQLite',
    'Redis',
    'Microsoft SQL Server',
    'Oracle',
    'Cassandra',
    'DynamoDB',
    'Other'
  ];

  const messagingQueueOptions = [
    'RabbitMQ',
    'Apache Kafka',
    'Redis (Pub/Sub)',
    'AWS SQS',
    'Google Cloud Pub/Sub',
    'Azure Service Bus',
    'Apache ActiveMQ',
    'NATS',
    'None',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (formData.projectDescription.trim().length < 10) {
      newErrors.projectDescription = 'Project description must be at least 10 characters';
    }

    if (!formData.backendFramework) {
      newErrors.backendFramework = 'Backend framework is required';
    }

    if (!formData.frontendFramework) {
      newErrors.frontendFramework = 'Frontend framework is required';
    }

    if (!formData.database) {
      newErrors.database = 'Database preference is required';
    }

    if (!formData.messagingQueue) {
      newErrors.messagingQueue = 'Messaging queue framework is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Store the submitted data
    setSubmittedData(formData);

    // Log to console (in production, this would be sent to backend)
    console.log('Project Information Submitted:', formData);

    // Show success message
    alert('Project information submitted successfully! Check console for details.');
  };

  const handleReset = () => {
    setFormData({
      projectDescription: '',
      backendFramework: '',
      frontendFramework: '',
      database: '',
      messagingQueue: ''
    });
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Project Description Form</h1>
        <p>Please provide information about your project to help create a descriptive prompt for the project manager/technical architect.</p>
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="projectDescription">
            Project Description <span className="required">*</span>
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Describe your project in detail..."
            rows="6"
            className={errors.projectDescription ? 'error' : ''}
          />
          {errors.projectDescription && (
            <span className="error-message">{errors.projectDescription}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="backendFramework">
            Backend Framework <span className="required">*</span>
          </label>
          <select
            id="backendFramework"
            name="backendFramework"
            value={formData.backendFramework}
            onChange={handleChange}
            className={errors.backendFramework ? 'error' : ''}
          >
            <option value="">Select a backend framework...</option>
            {backendOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.backendFramework && (
            <span className="error-message">{errors.backendFramework}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="frontendFramework">
            Frontend Framework <span className="required">*</span>
          </label>
          <select
            id="frontendFramework"
            name="frontendFramework"
            value={formData.frontendFramework}
            onChange={handleChange}
            className={errors.frontendFramework ? 'error' : ''}
          >
            <option value="">Select a frontend framework...</option>
            {frontendOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.frontendFramework && (
            <span className="error-message">{errors.frontendFramework}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="database">
            Database Preferred <span className="required">*</span>
          </label>
          <select
            id="database"
            name="database"
            value={formData.database}
            onChange={handleChange}
            className={errors.database ? 'error' : ''}
          >
            <option value="">Select a database...</option>
            {databaseOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.database && (
            <span className="error-message">{errors.database}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="messagingQueue">
            Messaging Queue Framework <span className="required">*</span>
          </label>
          <select
            id="messagingQueue"
            name="messagingQueue"
            value={formData.messagingQueue}
            onChange={handleChange}
            className={errors.messagingQueue ? 'error' : ''}
          >
            <option value="">Select a messaging queue framework...</option>
            {messagingQueueOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.messagingQueue && (
            <span className="error-message">{errors.messagingQueue}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="submission-summary">
          <h2>Submitted Information</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Project Description:</strong>
              <p>{submittedData.projectDescription}</p>
            </div>
            <div className="summary-item">
              <strong>Backend Framework:</strong>
              <p>{submittedData.backendFramework}</p>
            </div>
            <div className="summary-item">
              <strong>Frontend Framework:</strong>
              <p>{submittedData.frontendFramework}</p>
            </div>
            <div className="summary-item">
              <strong>Database:</strong>
              <p>{submittedData.database}</p>
            </div>
            <div className="summary-item">
              <strong>Messaging Queue:</strong>
              <p>{submittedData.messagingQueue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDescriptionForm;
