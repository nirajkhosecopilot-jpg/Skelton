import { useState } from 'react';

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
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo in top left corner */}
      <div className="fixed top-6 left-6 z-10">
        <svg width="60" height="60" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {/* Background circles (orbit rings) */}
          <g opacity="0.4" fill="none" stroke="#374151" strokeWidth="1.5">
            <circle cx="200" cy="200" r="60" />
            <circle cx="200" cy="200" r="90" />
            <circle cx="200" cy="200" r="120" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="180" />
          </g>

          {/* Small orbit dots */}
          <g fill="#374151">
            <circle cx="200" cy="140" r="3" />
            <circle cx="200" cy="260" r="3" />
            <circle cx="80"  cy="200" r="3" />
            <circle cx="320" cy="200" r="3" />

            <circle cx="125" cy="125" r="2.5" />
            <circle cx="275" cy="125" r="2.5" />
            <circle cx="125" cy="275" r="2.5" />
            <circle cx="275" cy="275" r="2.5" />

            <circle cx="90"  cy="160" r="2" />
            <circle cx="310" cy="160" r="2" />
            <circle cx="90"  cy="240" r="2" />
            <circle cx="310" cy="240" r="2" />
          </g>

          {/* Main stylized S shape */}
          <path
            d="M 200 110
               C 140 110, 110 150, 110 200
               C 110 250, 140 290, 200 290
               C 260 290, 290 250, 290 200
               C 290 150, 260 110, 200 110 Z
               M 200 150
               C 170 150, 150 170, 150 200
               C 150 230, 170 250, 200 250
               C 230 250, 250 230, 250 200
               C 250 170, 230 150, 200 150 Z"
            fill="#111827"
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Optional subtle inner glow/highlight */}
          <path
            d="M 200 130
               C 160 130, 135 165, 135 200
               C 135 235, 160 270, 200 270
               C 240 270, 265 235, 265 200
               C 265 165, 240 130, 200 130 Z"
            fill="none"
            stroke="#6B7280"
            strokeWidth="3"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-3">
            Project Description Form
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Please provide information about your project to help create a descriptive prompt for the project manager/technical architect.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {/* Project Description */}
            <div className="mb-6">
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-900 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows="6"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.projectDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.projectDescription && (
                <p className="text-red-500 text-sm mt-2">{errors.projectDescription}</p>
              )}
            </div>

            {/* Backend Framework */}
            <div className="mb-6">
              <label htmlFor="backendFramework" className="block text-sm font-medium text-gray-900 mb-2">
                Backend Framework <span className="text-red-500">*</span>
              </label>
              <select
                id="backendFramework"
                name="backendFramework"
                value={formData.backendFramework}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.backendFramework ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a backend framework...</option>
                {backendOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.backendFramework && (
                <p className="text-red-500 text-sm mt-2">{errors.backendFramework}</p>
              )}
            </div>

            {/* Frontend Framework */}
            <div className="mb-6">
              <label htmlFor="frontendFramework" className="block text-sm font-medium text-gray-900 mb-2">
                Frontend Framework <span className="text-red-500">*</span>
              </label>
              <select
                id="frontendFramework"
                name="frontendFramework"
                value={formData.frontendFramework}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.frontendFramework ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a frontend framework...</option>
                {frontendOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.frontendFramework && (
                <p className="text-red-500 text-sm mt-2">{errors.frontendFramework}</p>
              )}
            </div>

            {/* Database */}
            <div className="mb-6">
              <label htmlFor="database" className="block text-sm font-medium text-gray-900 mb-2">
                Database Preferred <span className="text-red-500">*</span>
              </label>
              <select
                id="database"
                name="database"
                value={formData.database}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.database ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a database...</option>
                {databaseOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.database && (
                <p className="text-red-500 text-sm mt-2">{errors.database}</p>
              )}
            </div>

            {/* Messaging Queue */}
            <div className="mb-6">
              <label htmlFor="messagingQueue" className="block text-sm font-medium text-gray-900 mb-2">
                Messaging Queue Framework <span className="text-red-500">*</span>
              </label>
              <select
                id="messagingQueue"
                name="messagingQueue"
                value={formData.messagingQueue}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.messagingQueue ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a messaging queue framework...</option>
                {messagingQueueOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.messagingQueue && (
                <p className="text-red-500 text-sm mt-2">{errors.messagingQueue}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {/* Submission Summary */}
        {submittedData && (
          <div className="mt-8 bg-white border border-green-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-light text-green-700 mb-6">
              Submitted Information
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <strong className="block text-sm font-medium text-gray-900 mb-2">Project Description:</strong>
                <p className="text-gray-700 leading-relaxed">{submittedData.projectDescription}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <strong className="block text-sm font-medium text-gray-900 mb-2">Backend Framework:</strong>
                <p className="text-gray-700">{submittedData.backendFramework}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <strong className="block text-sm font-medium text-gray-900 mb-2">Frontend Framework:</strong>
                <p className="text-gray-700">{submittedData.frontendFramework}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <strong className="block text-sm font-medium text-gray-900 mb-2">Database:</strong>
                <p className="text-gray-700">{submittedData.database}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <strong className="block text-sm font-medium text-gray-900 mb-2">Messaging Queue:</strong>
                <p className="text-gray-700">{submittedData.messagingQueue}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDescriptionForm;
