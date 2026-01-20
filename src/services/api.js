/**
 * API service for communicating with the Go backend
 */

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Validates a project description by sending it to the backend API
 * @param {Object} projectData - The project description data
 * @returns {Promise<Object>} - The validation response with missing information
 */
export async function validateProjectDescription(projectData) {
  try {
    const response = await fetch(`${API_URL}/api/project/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating project description:', error);
    throw error;
  }
}

/**
 * Checks if the API is healthy and reachable
 * @returns {Promise<Object>} - The health status
 */
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}

/**
 * Transforms form data to the format expected by the API
 * @param {Object} formData - The form data from the UI
 * @returns {Object} - The transformed data for the API
 */
export function transformFormDataForAPI(formData) {
  // Extract project name from description if not provided
  const descriptionLines = formData.projectDescription.split('\n');
  const projectName = descriptionLines[0].substring(0, 100); // First line as name

  return {
    name: projectName || 'Untitled Project',
    description: formData.projectDescription,
    type: 'web', // Default type, can be made dynamic
    technologyStack: [
      formData.backendFramework,
      formData.frontendFramework,
    ].filter(Boolean),
    databaseType: formData.database,
    authRequired: true, // Default, can be made dynamic
    deploymentPlatform: '', // Can be added to the form
    features: [], // Can be extracted from description
    teamSize: 0, // Can be added to the form
    timeline: '', // Can be added to the form
  };
}

/**
 * Generates project specification using AI
 * @param {Object} completeData - The complete project data from all pages
 * @returns {Promise<Object>} - The AI-generated specification
 */
export async function generateProjectSpecification(completeData) {
  try {
    const response = await fetch(`${API_URL}/api/project/generate-specification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating project specification:', error);
    throw error;
  }
}

/**
 * Downloads document in specified format
 * @param {string} format - The format (pdf, docx, jpg)
 * @param {Object} projectData - The complete project data
 * @param {Object} content - The AI-generated content
 * @returns {Promise<Blob>} - The document blob
 */
export async function downloadDocument(format, projectData, content) {
  try {
    const response = await fetch(`${API_URL}/api/project/download-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format,
        projectData,
        content
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Download failed with status ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
}
