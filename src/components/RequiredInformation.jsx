import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RequiredInformation() {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  // Sample/dummy required information items
  const requiredItems = [
    {
      id: 1,
      title: 'Authentication & Authorization',
      description: 'Specify authentication methods (OAuth, JWT, Session-based) and role-based access control requirements',
      status: 'missing'
    },
    {
      id: 2,
      title: 'API Design & Documentation',
      description: 'Define REST/GraphQL endpoints, API versioning strategy, and documentation standards (Swagger/OpenAPI)',
      status: 'missing'
    },
    {
      id: 3,
      title: 'Data Models & Relationships',
      description: 'Detail entity relationships, data schemas, migration strategy, and database indexing requirements',
      status: 'missing'
    },
    {
      id: 4,
      title: 'Performance & Scalability Requirements',
      description: 'Expected load, response time targets, caching strategy, and horizontal/vertical scaling plans',
      status: 'missing'
    },
    {
      id: 5,
      title: 'Security & Compliance',
      description: 'Data encryption requirements, compliance standards (GDPR, HIPAA), security audit needs',
      status: 'missing'
    },
    {
      id: 6,
      title: 'Testing Strategy',
      description: 'Unit testing framework, integration testing approach, E2E testing tools, and code coverage goals',
      status: 'missing'
    },
    {
      id: 7,
      title: 'Deployment & Infrastructure',
      description: 'Hosting platform (AWS, Azure, GCP), CI/CD pipeline, container orchestration, monitoring tools',
      status: 'missing'
    }
  ];

  const handleValidate = () => {
    if (!additionalInfo.trim()) {
      setValidationMessage('Please provide additional information to address the missing requirements.');
      return;
    }

    if (additionalInfo.trim().length < 50) {
      setValidationMessage('Please provide more detailed information (at least 50 characters).');
      return;
    }

    setValidationMessage('Information validated successfully! You can now proceed to the next step.');
    console.log('Additional Information Provided:', additionalInfo);
  };

  const handleNext = () => {
    if (!additionalInfo.trim() || additionalInfo.trim().length < 50) {
      setValidationMessage('Please validate your information before proceeding.');
      return;
    }

    // In future, this would navigate to the next page
    console.log('Proceeding to next step with information:', additionalInfo);
    alert('Moving to next step! (Next page to be implemented)');
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
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-light text-gray-900">
              Required Information
            </h1>
          </div>
          <p className="text-gray-600 text-base ml-9">
            Based on your project description, we need additional details to create a comprehensive technical specification.
          </p>
        </div>

        {/* Required Information List */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-1">
                Missing Critical Details
              </h2>
              <p className="text-sm text-gray-600">
                Please provide information for the following areas to proceed
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {requiredItems.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-6">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-900 mb-3">
            Provide Additional Information <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Please address the missing requirements listed above. Provide as much detail as possible to help us create an accurate technical specification.
          </p>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => {
              setAdditionalInfo(e.target.value);
              setValidationMessage('');
            }}
            placeholder="Enter detailed information about authentication, API design, data models, performance requirements, security measures, testing strategy, and deployment plans..."
            rows="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-y"
          />
          <div className="mt-2 text-sm text-gray-500">
            Minimum 50 characters required • {additionalInfo.length} characters
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div className={`mt-4 p-4 rounded-lg border ${
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
            onClick={handleValidate}
            className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
          >
            Validate
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
          >
            Next
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Review the{' '}
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

export default RequiredInformation;
