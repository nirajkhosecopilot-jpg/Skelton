import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Architecture() {
  const navigate = useNavigate();
  const [architectureData, setArchitectureData] = useState({
    pattern: '',
    deploymentStrategy: '',
    infrastructure: '',
    scalingApproach: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [validationMessage, setValidationMessage] = useState('');

  const architecturePatterns = [
    'Monolithic',
    'Microservices',
    'Serverless',
    'Event-Driven',
    'Layered Architecture',
    'Hexagonal Architecture',
    'CQRS',
    'Service-Oriented Architecture (SOA)',
    'Other'
  ];

  const deploymentStrategies = [
    'Blue-Green Deployment',
    'Rolling Deployment',
    'Canary Deployment',
    'Recreate Deployment',
    'A/B Testing',
    'Shadow Deployment',
    'Other'
  ];

  const infrastructureOptions = [
    'Cloud-Native (AWS)',
    'Cloud-Native (Azure)',
    'Cloud-Native (Google Cloud)',
    'Hybrid Cloud',
    'On-Premises',
    'Multi-Cloud',
    'Containerized (Kubernetes)',
    'Containerized (Docker)',
    'Serverless',
    'Other'
  ];

  const scalingOptions = [
    'Horizontal Scaling',
    'Vertical Scaling',
    'Auto-Scaling',
    'Manual Scaling',
    'Elastic Scaling',
    'Load Balancing',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArchitectureData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setValidationMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!architectureData.pattern) {
      newErrors.pattern = 'Architecture pattern is required';
    }

    if (!architectureData.deploymentStrategy) {
      newErrors.deploymentStrategy = 'Deployment strategy is required';
    }

    if (!architectureData.infrastructure) {
      newErrors.infrastructure = 'Infrastructure preference is required';
    }

    if (!architectureData.scalingApproach) {
      newErrors.scalingApproach = 'Scaling approach is required';
    }

    return newErrors;
  };

  const handleValidate = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidationMessage('Please fill in all required fields.');
      return;
    }

    setValidationMessage('Architecture configuration validated successfully! You can now proceed to the next step.');
    console.log('Architecture Configuration:', architectureData);
  };

  const handleNext = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidationMessage('Please validate your architecture configuration before proceeding.');
      return;
    }

    console.log('Proceeding with architecture:', architectureData);
    navigate('/architecture-overview');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo in top left corner */}
      <div className="fixed top-6 left-6 z-10 cursor-pointer" onClick={() => navigate('/')}>
        <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 30 10 L 70 10 L 70 30 L 50 30 L 50 40 L 70 40 L 70 90 L 30 90 L 30 70 L 50 70 L 50 60 L 30 60 Z"
            fill="#111827"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/required-information')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-light text-gray-900">
              System Architecture
            </h1>
          </div>
          <p className="text-gray-600 text-base ml-9">
            Define the architectural patterns, deployment strategy, and infrastructure requirements for your project.
          </p>
        </div>

        {/* Architecture Configuration Form */}
        <form className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {/* Architecture Pattern */}
            <div className="mb-6">
              <label htmlFor="pattern" className="block text-sm font-medium text-gray-900 mb-2">
                Architecture Pattern <span className="text-red-500">*</span>
              </label>
              <select
                id="pattern"
                name="pattern"
                value={architectureData.pattern}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.pattern ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an architecture pattern...</option>
                {architecturePatterns.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.pattern && (
                <p className="text-red-500 text-sm mt-2">{errors.pattern}</p>
              )}
            </div>

            {/* Deployment Strategy */}
            <div className="mb-6">
              <label htmlFor="deploymentStrategy" className="block text-sm font-medium text-gray-900 mb-2">
                Deployment Strategy <span className="text-red-500">*</span>
              </label>
              <select
                id="deploymentStrategy"
                name="deploymentStrategy"
                value={architectureData.deploymentStrategy}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.deploymentStrategy ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a deployment strategy...</option>
                {deploymentStrategies.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.deploymentStrategy && (
                <p className="text-red-500 text-sm mt-2">{errors.deploymentStrategy}</p>
              )}
            </div>

            {/* Infrastructure */}
            <div className="mb-6">
              <label htmlFor="infrastructure" className="block text-sm font-medium text-gray-900 mb-2">
                Infrastructure <span className="text-red-500">*</span>
              </label>
              <select
                id="infrastructure"
                name="infrastructure"
                value={architectureData.infrastructure}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.infrastructure ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select infrastructure preference...</option>
                {infrastructureOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.infrastructure && (
                <p className="text-red-500 text-sm mt-2">{errors.infrastructure}</p>
              )}
            </div>

            {/* Scaling Approach */}
            <div className="mb-6">
              <label htmlFor="scalingApproach" className="block text-sm font-medium text-gray-900 mb-2">
                Scaling Approach <span className="text-red-500">*</span>
              </label>
              <select
                id="scalingApproach"
                name="scalingApproach"
                value={architectureData.scalingApproach}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                  errors.scalingApproach ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select scaling approach...</option>
                {scalingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.scalingApproach && (
                <p className="text-red-500 text-sm mt-2">{errors.scalingApproach}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-900 mb-2">
                Additional Architectural Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={architectureData.additionalNotes}
                onChange={handleChange}
                placeholder="Any additional architectural considerations, constraints, or requirements..."
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-y"
              />
            </div>

            {/* Validation Message */}
            {validationMessage && (
              <div className={`p-4 rounded-lg border ${
                validationMessage.includes('successfully')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-2">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      validationMessage.includes('successfully') ? 'text-green-600' : 'text-amber-600'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {validationMessage.includes('successfully') ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                  </svg>
                  <p className="text-sm font-medium">{validationMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleValidate}
              className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            >
              Validate
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            >
              Next
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Review the{' '}
            <button onClick={() => navigate('/required-information')} className="text-gray-900 hover:underline font-medium">
              required information
            </button>
            {' '}or{' '}
            <button onClick={() => navigate('/')} className="text-gray-900 hover:underline font-medium">
              project description
            </button>
            {' '}you provided earlier.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Architecture;
