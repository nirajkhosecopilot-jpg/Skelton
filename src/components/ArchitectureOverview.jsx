import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const ArchitectureOverview = () => {
  const navigate = useNavigate();
  const [downloadFormat, setDownloadFormat] = useState('txt');
  const folderStructureRef = useRef(null);

  // Recommended folder structure
  const folderStructure = {
    'project-root': {
      type: 'folder',
      children: {
        'backend': {
          type: 'folder',
          description: 'Backend services and API',
          children: {
            'src': {
              type: 'folder',
              children: {
                'controllers': { type: 'folder', description: 'API route controllers' },
                'models': { type: 'folder', description: 'Data models and schemas' },
                'services': { type: 'folder', description: 'Business logic layer' },
                'middlewares': { type: 'folder', description: 'Express/HTTP middlewares' },
                'routes': { type: 'folder', description: 'API route definitions' },
                'config': { type: 'folder', description: 'Configuration files' },
                'utils': { type: 'folder', description: 'Helper utilities' }
              }
            },
            'tests': { type: 'folder', description: 'Backend test suites' },
            'package.json': { type: 'file' },
            '.env': { type: 'file', description: 'Environment variables' }
          }
        },
        'frontend': {
          type: 'folder',
          description: 'Client-side application',
          children: {
            'src': {
              type: 'folder',
              children: {
                'components': { type: 'folder', description: 'React components' },
                'pages': { type: 'folder', description: 'Page components' },
                'hooks': { type: 'folder', description: 'Custom React hooks' },
                'contexts': { type: 'folder', description: 'React context providers' },
                'services': { type: 'folder', description: 'API client services' },
                'utils': { type: 'folder', description: 'Utility functions' },
                'assets': { type: 'folder', description: 'Images, fonts, static files' },
                'styles': { type: 'folder', description: 'CSS/styling files' }
              }
            },
            'public': { type: 'folder', description: 'Static public assets' },
            'tests': { type: 'folder', description: 'Frontend test suites' },
            'package.json': { type: 'file' },
            'vite.config.js': { type: 'file', description: 'Build configuration' }
          }
        },
        'database': {
          type: 'folder',
          description: 'Database schemas and migrations',
          children: {
            'migrations': { type: 'folder', description: 'Database migration scripts' },
            'seeds': { type: 'folder', description: 'Seed data for development' },
            'schemas': { type: 'folder', description: 'Database schema definitions' },
            'scripts': { type: 'folder', description: 'Database utility scripts' }
          }
        },
        'messaging': {
          type: 'folder',
          description: 'Message queue configurations',
          children: {
            'consumers': { type: 'folder', description: 'Message consumers/subscribers' },
            'producers': { type: 'folder', description: 'Message producers/publishers' },
            'configs': { type: 'folder', description: 'Queue configurations' },
            'handlers': { type: 'folder', description: 'Message handler logic' }
          }
        },
        'shared': {
          type: 'folder',
          description: 'Shared code across services',
          children: {
            'types': { type: 'folder', description: 'TypeScript types/interfaces' },
            'constants': { type: 'folder', description: 'Shared constants' },
            'utils': { type: 'folder', description: 'Shared utility functions' }
          }
        },
        'docker': {
          type: 'folder',
          description: 'Docker configurations',
          children: {
            'Dockerfile.backend': { type: 'file' },
            'Dockerfile.frontend': { type: 'file' },
            'docker-compose.yml': { type: 'file' }
          }
        },
        'docs': { type: 'folder', description: 'Project documentation' },
        '.github': {
          type: 'folder',
          description: 'GitHub workflows and templates',
          children: {
            'workflows': { type: 'folder', description: 'CI/CD workflows' }
          }
        },
        'README.md': { type: 'file' },
        '.gitignore': { type: 'file' },
        'package.json': { type: 'file', description: 'Root package file (monorepo)' }
      }
    }
  };

  // Convert structure to text format
  const structureToText = (obj, prefix = '') => {
    let result = '';
    const entries = Object.entries(obj);

    entries.forEach(([key, value], index) => {
      const isLastItem = index === entries.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const extension = isLastItem ? '    ' : '│   ';

      if (key === 'type' || key === 'description') return;

      const icon = value.type === 'folder' ? '📁' : '📄';
      const description = value.description ? ` - ${value.description}` : '';

      result += `${prefix}${connector}${icon} ${key}${description}\n`;

      if (value.children) {
        result += structureToText(value.children, prefix + extension);
      }
    });

    return result;
  };

  // Convert structure to JSON
  const structureToJSON = () => {
    return JSON.stringify(folderStructure, null, 2);
  };

  // Generate downloadable content
  const generateDownloadContent = () => {
    const header = `# Recommended Project Architecture\n# Full-Stack Application Structure\n\n`;
    const textContent = structureToText(folderStructure);

    switch (downloadFormat) {
      case 'txt':
        return header + textContent;
      case 'json':
        return structureToJSON();
      case 'md':
        return `# Recommended Project Architecture\n\n## Full-Stack Application Structure\n\n\`\`\`\n${textContent}\`\`\`\n\n## Description\n\nThis architecture supports a full-stack application with:\n- **Backend**: RESTful API services\n- **Frontend**: Modern React application\n- **Database**: Schema management and migrations\n- **Messaging**: Message queue framework integration\n- **Shared**: Common code and utilities\n- **Docker**: Containerization support\n`;
      default:
        return textContent;
    }
  };

  // Download as file
  const handleDownload = () => {
    const content = generateDownloadContent();
    const mimeTypes = {
      txt: 'text/plain',
      json: 'application/json',
      md: 'text/markdown'
    };

    const blob = new Blob([content], { type: mimeTypes[downloadFormat] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-overview.${downloadFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render folder structure recursively
  const renderStructure = (obj, level = 0) => {
    return Object.entries(obj).map(([key, value]) => {
      if (key === 'type' || key === 'description') return null;

      const isFolder = value.type === 'folder';
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
        <div key={key} className="group">
          <div
            className="flex items-start gap-2 py-1.5 px-3 rounded hover:bg-gray-50 transition-colors"
            style={{ marginLeft: `${level * 24}px` }}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isFolder ? 'text-gray-900' : 'text-gray-600'}`}>
                  {key}
                </span>
                {value.description && (
                  <span className="text-xs text-gray-500 truncate">
                    {value.description}
                  </span>
                )}
              </div>
            </div>
          </div>
          {value.children && (
            <div className="mt-1">
              {renderStructure(value.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

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

          <h1 className="text-4xl font-light text-gray-900 mb-3">
            Architecture Overview
          </h1>
          <p className="text-gray-600 text-lg">
            Recommended folder structure for a full-stack application with backend, frontend, database, and message queuing framework.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: 'Backend', icon: '⚙️', desc: 'API & Services' },
            { title: 'Frontend', icon: '🎨', desc: 'React UI' },
            { title: 'Database', icon: '🗄️', desc: 'Schemas & Migrations' },
            { title: 'Messaging', icon: '📨', desc: 'Queue Framework' }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Folder Structure Visualization */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-medium text-gray-900">
              Folder Structure
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Expandable tree view of the recommended project architecture
            </p>
          </div>

          <div
            ref={folderStructureRef}
            className="p-6 bg-gray-50 font-mono text-sm overflow-x-auto max-h-[600px] overflow-y-auto"
          >
            {renderStructure(folderStructure)}
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Download Structure
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Export the folder structure in your preferred format
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Format Selection */}
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
                <option value="txt">Text File (.txt)</option>
                <option value="json">JSON (.json)</option>
                <option value="md">Markdown (.md)</option>
              </select>
            </div>

            {/* Download Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all font-medium"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Architecture Notes */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Architecture Notes
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span><strong>Monorepo structure:</strong> All services in one repository for easier dependency management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span><strong>Separation of concerns:</strong> Clear boundaries between frontend, backend, and infrastructure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span><strong>Shared code:</strong> Common types, constants, and utilities accessible to all services</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span><strong>Scalability:</strong> Structure supports microservices migration when needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span><strong>DevOps ready:</strong> Docker configurations and CI/CD workflow templates included</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureOverview;
