import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ArchitectureOverview from '../ArchitectureOverview';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ArchitectureOverview', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===== RENDERING TESTS =====
  describe('Rendering', () => {
    it('should render the page with title and description', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText(/Architecture Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended folder structure for a full-stack application/i)).toBeInTheDocument();
    });

    it('should render the logo SVG', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('height', '60');
    });

    it('should render back to architecture button', () => {
      renderWithRouter(<ArchitectureOverview />);
      expect(screen.getByText(/Back to Architecture/i)).toBeInTheDocument();
    });

    it('should render all 4 key feature cards', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('Messaging')).toBeInTheDocument();
    });

    it('should render key feature descriptions', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('API & Services')).toBeInTheDocument();
      expect(screen.getByText('React UI')).toBeInTheDocument();
      expect(screen.getByText('Schemas & Migrations')).toBeInTheDocument();
      expect(screen.getByText('Queue Framework')).toBeInTheDocument();
    });

    it('should render key feature icons', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('⚙️')).toBeInTheDocument();
      expect(screen.getByText('🎨')).toBeInTheDocument();
      expect(screen.getByText('🗄️')).toBeInTheDocument();
      expect(screen.getByText('📨')).toBeInTheDocument();
    });

    it('should render folder structure section', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByRole('heading', { name: /Folder Structure/i })).toBeInTheDocument();
      expect(screen.getByText(/Expandable tree view/i)).toBeInTheDocument();
    });

    it('should render download section', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText(/Download Structure/i)).toBeInTheDocument();
      expect(screen.getByText(/Export the folder structure/i)).toBeInTheDocument();
    });

    it('should render format selector', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByLabelText(/Select Format/i)).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Text File/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /JSON/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Markdown/i })).toBeInTheDocument();
    });

    it('should render download button', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    });

    it('should render architecture notes section', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByRole('heading', { name: /Architecture Notes/i })).toBeInTheDocument();
      expect(screen.getByText(/Monorepo structure/i)).toBeInTheDocument();
      expect(screen.getByText(/Separation of concerns/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Shared code/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Scalability/i)).toBeInTheDocument();
      expect(screen.getByText(/DevOps ready/i)).toBeInTheDocument();
    });

    it('should render main folder structure elements', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('project-root')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('database')).toBeInTheDocument();
      expect(screen.getByText('messaging')).toBeInTheDocument();
      expect(screen.getByText('shared')).toBeInTheDocument();
      expect(screen.getByText('docker')).toBeInTheDocument();
      expect(screen.getByText('docs')).toBeInTheDocument();
      expect(screen.getByText('.github')).toBeInTheDocument();
    });

    it('should render backend subfolder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getAllByText('controllers').length).toBeGreaterThan(0);
      expect(screen.getAllByText('models').length).toBeGreaterThan(0);
      expect(screen.getAllByText('services').length).toBeGreaterThan(0);
      expect(screen.getAllByText('middlewares').length).toBeGreaterThan(0);
      expect(screen.getAllByText('routes').length).toBeGreaterThan(0);
      expect(screen.getAllByText('config').length).toBeGreaterThan(0);
      expect(screen.getAllByText('utils').length).toBeGreaterThan(0);
    });

    it('should render frontend subfolder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('components')).toBeInTheDocument();
      expect(screen.getByText('pages')).toBeInTheDocument();
      expect(screen.getByText('hooks')).toBeInTheDocument();
      expect(screen.getByText('contexts')).toBeInTheDocument();
      expect(screen.getByText('assets')).toBeInTheDocument();
      expect(screen.getByText('styles')).toBeInTheDocument();
    });

    it('should render file descriptions', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText(/Backend services and API/i)).toBeInTheDocument();
      expect(screen.getByText(/Client-side application/i)).toBeInTheDocument();
      expect(screen.getByText(/API route controllers/i)).toBeInTheDocument();
      expect(screen.getByText(/React components/i)).toBeInTheDocument();
    });

    it('should render file elements', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getAllByText('package.json').length).toBeGreaterThan(0);
      expect(screen.getAllByText('.env').length).toBeGreaterThan(0);
      expect(screen.getAllByText('README.md').length).toBeGreaterThan(0);
      expect(screen.getAllByText('.gitignore').length).toBeGreaterThan(0);
    });
  });

  // ===== NAVIGATION TESTS =====
  describe('Navigation', () => {
    it('should navigate to architecture when back button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const backButton = screen.getByText(/Back to Architecture/i);
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture');
    });

    it('should navigate to home when logo is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const logo = container.querySelector('.cursor-pointer');
      await user.click(logo);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // ===== FORMAT SELECTION TESTS =====
  describe('Format Selection', () => {
    it('should have txt format selected by default', () => {
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      expect(select).toHaveValue('txt');
    });

    it('should change to json format when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');

      expect(select).toHaveValue('json');
    });

    it('should change to markdown format when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'md');

      expect(select).toHaveValue('md');
    });

    it('should change back to txt format', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');
      await user.selectOptions(select, 'txt');

      expect(select).toHaveValue('txt');
    });

    it('should handle multiple format changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);

      await user.selectOptions(select, 'json');
      expect(select).toHaveValue('json');

      await user.selectOptions(select, 'md');
      expect(select).toHaveValue('md');

      await user.selectOptions(select, 'txt');
      expect(select).toHaveValue('txt');
    });
  });

  // ===== DOWNLOAD FUNCTIONALITY TESTS =====
  describe('Download Functionality', () => {
    it('should trigger download when download button is clicked', async () => {
      const user = userEvent.setup();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      renderWithRouter(<ArchitectureOverview />);

      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should download txt file with correct filename', async () => {
      const user = userEvent.setup();
      let createdLink = null;
      const originalAppendChild = document.body.appendChild.bind(document.body);
      const originalRemoveChild = document.body.removeChild.bind(document.body);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          createdLink = node;
          return node;
        }
        return originalAppendChild(node);
      });

      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          return node;
        }
        return originalRemoveChild(node);
      });

      renderWithRouter(<ArchitectureOverview />);

      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      expect(createdLink).not.toBeNull();
      expect(createdLink.download).toBe('architecture-overview.txt');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should download json file when json format is selected', async () => {
      const user = userEvent.setup();
      let createdLink = null;
      const originalAppendChild = document.body.appendChild.bind(document.body);
      const originalRemoveChild = document.body.removeChild.bind(document.body);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          createdLink = node;
          return node;
        }
        return originalAppendChild(node);
      });

      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          return node;
        }
        return originalRemoveChild(node);
      });

      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');

      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      expect(createdLink).not.toBeNull();
      expect(createdLink.download).toBe('architecture-overview.json');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should download markdown file when md format is selected', async () => {
      const user = userEvent.setup();
      let createdLink = null;
      const originalAppendChild = document.body.appendChild.bind(document.body);
      const originalRemoveChild = document.body.removeChild.bind(document.body);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          createdLink = node;
          return node;
        }
        return originalAppendChild(node);
      });

      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
        if (node.tagName && node.tagName.toUpperCase() === 'A') {
          return node;
        }
        return originalRemoveChild(node);
      });

      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'md');

      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      expect(createdLink).not.toBeNull();
      expect(createdLink.download).toBe('architecture-overview.md');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should handle multiple downloads', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const downloadButton = screen.getByRole('button', { name: /Download/i });

      await user.click(downloadButton);
      await user.click(downloadButton);
      await user.click(downloadButton);

      expect(global.URL.createObjectURL).toHaveBeenCalledTimes(3);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(3);
    });
  });

  // ===== UI STATE TESTS =====
  describe('UI State', () => {
    it('should have correct initial state', () => {
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      expect(select).toHaveValue('txt');
    });

    it('should maintain folder structure visibility', () => {
      renderWithRouter(<ArchitectureOverview />);

      // Main folders should be visible
      expect(screen.getByText('backend')).toBeVisible();
      expect(screen.getByText('frontend')).toBeVisible();
      expect(screen.getByText('database')).toBeVisible();
    });

    it('should show nested folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      // Nested folders should be rendered
      expect(screen.getByText('controllers')).toBeInTheDocument();
      expect(screen.getByText('models')).toBeInTheDocument();
      expect(screen.getByText('components')).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const folderStructure = container.querySelector('.font-mono');
      expect(folderStructure).toBeInTheDocument();
      expect(folderStructure).toHaveClass('bg-gray-50');
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility', () => {
    it('should have proper label for format selector', () => {
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      expect(select).toBeInTheDocument();
    });

    it('should have proper button role for download', () => {
      renderWithRouter(<ArchitectureOverview />);

      const downloadButton = screen.getByRole('button', { name: /Download/i });
      expect(downloadButton).toBeInTheDocument();
    });

    it('should have proper button role for back navigation', () => {
      renderWithRouter(<ArchitectureOverview />);

      const backButton = screen.getByRole('button', { name: /Back to Architecture/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const h1 = container.querySelector('h1');
      const h2 = container.querySelectorAll('h2');
      const h3 = container.querySelector('h3');

      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/Architecture Overview/i);
      expect(h2.length).toBeGreaterThan(0);
      expect(h3).toBeInTheDocument();
    });

    it('should have focusable interactive elements', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.click(select);

      expect(select).toHaveFocus();
    });
  });

  // ===== FOLDER STRUCTURE RENDERING TESTS =====
  describe('Folder Structure Rendering', () => {
    it('should render folder icons', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      // Should have folder icons (yellow color class)
      const folderIcons = container.querySelectorAll('.text-yellow-500');
      expect(folderIcons.length).toBeGreaterThan(0);
    });

    it('should render file icons', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      // Should have file icons (gray color class)
      const fileIcons = container.querySelectorAll('.text-gray-400');
      expect(fileIcons.length).toBeGreaterThan(0);
    });

    it('should render nested structure with proper indentation', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const nestedElements = container.querySelectorAll('[style*="margin-left"]');
      expect(nestedElements.length).toBeGreaterThan(0);
    });

    it('should render database folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('migrations')).toBeInTheDocument();
      expect(screen.getByText('seeds')).toBeInTheDocument();
      expect(screen.getByText('schemas')).toBeInTheDocument();
      expect(screen.getByText('scripts')).toBeInTheDocument();
    });

    it('should render messaging folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('consumers')).toBeInTheDocument();
      expect(screen.getByText('producers')).toBeInTheDocument();
      expect(screen.getByText('configs')).toBeInTheDocument();
      expect(screen.getByText('handlers')).toBeInTheDocument();
    });

    it('should render shared folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('types')).toBeInTheDocument();
      expect(screen.getByText('constants')).toBeInTheDocument();
    });

    it('should render docker folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('Dockerfile.backend')).toBeInTheDocument();
      expect(screen.getByText('Dockerfile.frontend')).toBeInTheDocument();
      expect(screen.getByText('docker-compose.yml')).toBeInTheDocument();
    });

    it('should render github folder structure', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('workflows')).toBeInTheDocument();
    });

    it('should render tests folders for both backend and frontend', () => {
      renderWithRouter(<ArchitectureOverview />);

      const testsElements = screen.getAllByText('tests');
      expect(testsElements.length).toBeGreaterThanOrEqual(2);
    });

    it('should render public folder for frontend', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('public')).toBeInTheDocument();
    });

    it('should render vite config file', () => {
      renderWithRouter(<ArchitectureOverview />);

      expect(screen.getByText('vite.config.js')).toBeInTheDocument();
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    it('should handle rapid format changes before download', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);

      await user.selectOptions(select, 'json');
      await user.selectOptions(select, 'md');
      await user.selectOptions(select, 'txt');
      await user.selectOptions(select, 'json');

      expect(select).toHaveValue('json');
    });

    it('should handle download clicks in rapid succession', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const downloadButton = screen.getByRole('button', { name: /Download/i });

      await user.click(downloadButton);
      await user.click(downloadButton);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should maintain state during navigation attempts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');

      // Should maintain selection even after clicking other elements
      const backButton = screen.getByText(/Back to Architecture/i);
      await user.hover(backButton);

      expect(select).toHaveValue('json');
    });

    it('should have scrollable folder structure', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const folderContainer = container.querySelector('.overflow-y-auto');
      expect(folderContainer).toBeInTheDocument();
      expect(folderContainer).toHaveClass('max-h-[600px]');
    });

    it('should have responsive grid layout for key features', () => {
      const { container } = renderWithRouter(<ArchitectureOverview />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });
  });

  // ===== INTEGRATION TESTS =====
  describe('Integration', () => {
    it('should allow complete workflow: view structure, change format, download', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      // View structure
      expect(screen.getByText('project-root')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();

      // Change format
      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');
      expect(select).toHaveValue('json');

      // Download
      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should allow navigation back after viewing', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      // View some structure elements
      expect(screen.getByText('backend')).toBeInTheDocument();
      expect(screen.getByText('frontend')).toBeInTheDocument();

      // Navigate back
      const backButton = screen.getByText(/Back to Architecture/i);
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture');
    });

    it('should handle multiple interactions correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      // Change format
      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'md');

      // Download
      const downloadButton = screen.getByRole('button', { name: /Download/i });
      await user.click(downloadButton);

      // Change format again
      await user.selectOptions(select, 'json');

      // Download again
      await user.click(downloadButton);

      expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2);
    });

    it('should maintain UI state throughout interactions', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ArchitectureOverview />);

      // Interact with format selector
      const select = screen.getByLabelText(/Select Format/i);
      await user.selectOptions(select, 'json');

      // Hover over different elements
      await user.hover(screen.getByText('Backend'));
      await user.hover(screen.getByText('Frontend'));

      // State should remain
      expect(select).toHaveValue('json');
      expect(screen.getByText('project-root')).toBeInTheDocument();
    });

    it('should display all architecture notes correctly', () => {
      renderWithRouter(<ArchitectureOverview />);

      const notes = [
        'Monorepo structure',
        'Separation of concerns',
        'Shared code',
        'Scalability',
        'DevOps ready'
      ];

      notes.forEach(note => {
        expect(screen.getAllByText(new RegExp(note, 'i')).length).toBeGreaterThan(0);
      });
    });
  });
});
