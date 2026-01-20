import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateProjectDescription, transformFormDataForAPI } from '../services/api';

function ProjectDescriptionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectDescription: '',
    backendFramework: '',
    frontendFramework: '',
    database: '',
    messagingQueue: '',
    mode: 'online' // 'online' or 'offline'
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

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

  const handleModeToggle = () => {
    setFormData(prev => ({
      ...prev,
      mode: prev.mode === 'online' ? 'offline' : 'online'
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Transform form data to API format
      const apiData = transformFormDataForAPI(formData);

      // Call the API to validate project description
      const response = await validateProjectDescription(apiData);

      // Store the submitted data
      setSubmittedData(formData);

      // Log to console
      console.log('Project Information Submitted:', formData);
      console.log('API Response:', response);

      // Navigate to Required Information page with API response
      navigate('/required-information', {
        state: {
          formData,
          apiResponse: response
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiError(error.message || 'Failed to connect to the API. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectDescription: '',
      backendFramework: '',
      frontendFramework: '',
      database: '',
      messagingQueue: '',
      mode: 'online'
    });
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo in top left corner */}
      <div className="fixed top-6 left-6 z-10">
        <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 30 10 L 70 10 L 70 30 L 50 30 L 50 40 L 70 40 L 70 90 L 30 90 L 30 70 L 50 70 L 50 60 L 30 60 Z"
            fill="#111827"
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

            {/* Online/Offline Mode Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                AI Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleModeToggle}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                        formData.mode === 'online' ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      role="switch"
                      aria-checked={formData.mode === 'online'}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          formData.mode === 'online' ? 'translate-x-9' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.mode === 'online' ? 'Online (Claude API)' : 'Offline (OLLAMA Local)'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 ml-20">
                    {formData.mode === 'online'
                      ? 'Using Claude AI API for generation (requires API key)'
                      : 'Using local OLLAMA with llama3.3:latest (no API key needed)'}
                  </p>
                </div>
              </div>
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
                disabled={isSubmitting}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                  </div>
                </div>
              </div>
            )}
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
