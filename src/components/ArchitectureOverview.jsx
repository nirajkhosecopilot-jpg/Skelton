import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateProjectSpecification, downloadDocument } from '../services/api';

const ArchitectureOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiContent, setAiContent] = useState(null);
  const [completeData, setCompleteData] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  // Get complete data from navigation state
  useEffect(() => {
    const data = location.state?.completeData;
    if (!data) {
      setError('No project data available. Please start from the beginning.');
      setIsLoading(false);
      return;
    }

    setCompleteData(data);
    generateSpec(data);
  }, [location.state]);

  const generateSpec = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating specification with data:', data);
      const result = await generateProjectSpecification(data);
      console.log('Received AI content:', result);
      setAiContent(result);
    } catch (err) {
      console.error('Error generating specification:', err);
      setError(err.message || 'Failed to generate specification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!aiContent || !completeData) {
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await downloadDocument(downloadFormat, completeData, aiContent);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-specification.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError(`Failed to download document: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderFolderTree = (tree, level = 0) => {
    if (!tree || tree.length === 0) return null;

    return tree.map((node, index) => {
      const isFolder = node.type === 'folder';
      const icon = isFolder ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );

      return (
        <div key={`${node.name}-${index}`} className="group">
          <div
            className="flex items-start gap-2 py-1.5 px-3 rounded hover:bg-gray-50 transition-colors"
            style={{ marginLeft: `${level * 24}px` }}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isFolder ? 'text-gray-900' : 'text-gray-600'}`}>
                  {node.name}
                </span>
                {node.description && (
                  <span className="text-xs text-gray-500 truncate">
                    {node.description}
                  </span>
                )}
              </div>
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="mt-1">
              {renderFolderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-lg text-gray-700">
            {completeData?.mode === 'offline'
              ? 'Generating specification using local OLLAMA...'
              : 'Generating specification using Claude AI...'}
          </p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error && !completeData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Logo */}
      <div className="fixed top-6 left-6 z-10 cursor-pointer" onClick={() => navigate('/')}>
        <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 30 10 L 70 10 L 70 30 L 50 30 L 50 40 L 70 40 L 70 90 L 30 90 L 30 70 L 50 70 L 50 60 L 30 60 Z"
            fill="#111827"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/architecture')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Architecture
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-3">
                Architecture Overview
              </h1>
              <p className="text-gray-600 text-lg">
                {completeData?.mode === 'offline'
                  ? 'AI-generated specification using local OLLAMA'
                  : 'AI-generated specification using Claude AI'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {aiContent?.status === 'success' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Generated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {aiContent && (
          <>
            {/* Project Overview */}
            {aiContent.technicalSpecification?.projectOverview && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  {aiContent.technicalSpecification.projectOverview.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {aiContent.technicalSpecification.projectOverview.description}
                </p>
                {aiContent.technicalSpecification.projectOverview.goals && aiContent.technicalSpecification.projectOverview.goals.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Goals:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {aiContent.technicalSpecification.projectOverview.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Folder Structure */}
            {aiContent.folderStructure && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-medium text-gray-900">
                    Folder Structure
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {aiContent.folderStructure.rootFolder || 'Project structure'}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 font-mono text-sm overflow-x-auto max-h-[600px] overflow-y-auto">
                  {renderFolderTree(aiContent.folderStructure.tree)}
                </div>
              </div>
            )}

            {/* System Architecture */}
            {aiContent.technicalSpecification?.systemArchitecture && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  System Architecture
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Pattern:</strong> {aiContent.technicalSpecification.systemArchitecture.pattern}
                </p>
                <p className="text-gray-700 mb-4">
                  {aiContent.technicalSpecification.systemArchitecture.description}
                </p>
                {aiContent.technicalSpecification.systemArchitecture.components && aiContent.technicalSpecification.systemArchitecture.components.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiContent.technicalSpecification.systemArchitecture.components.map((component, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-900 mb-1">{component.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{component.type}</p>
                        <p className="text-sm text-gray-600">{component.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Download Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Download Specification
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Export the complete project specification in your preferred format
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="downloadFormat" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Format
                  </label>
                  <select
                    id="downloadFormat"
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="jpg">Image (.jpg)</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isDownloading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {aiContent.message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{aiContent.message}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArchitectureOverview;
