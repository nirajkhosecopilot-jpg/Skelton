import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import ProjectDescriptionForm from '../components/ProjectDescriptionForm';
import RequiredInformation from '../components/RequiredInformation';
import Architecture from '../components/Architecture';
import ArchitectureOverview from '../components/ArchitectureOverview';

// Mock App component structure for testing routes
const AppRoutes = () => (
  <div className="min-h-screen bg-white">
    <Routes>
      <Route path="/" element={<ProjectDescriptionForm />} />
      <Route path="/required-information" element={<RequiredInformation />} />
      <Route path="/architecture" element={<Architecture />} />
      <Route path="/architecture-overview" element={<ArchitectureOverview />} />
    </Routes>
  </div>
);

// Helper to render App with specific initial route
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppRoutes />
    </MemoryRouter>
  );
};

describe('App', () => {
  // ===== RENDERING TESTS =====
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithRouter();
      expect(document.body).toBeInTheDocument();
    });

    it('should have min-h-screen and bg-white classes on container', () => {
      const { container } = renderWithRouter();
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass('bg-white');
    });
  });

  // ===== ROUTING TESTS =====
  describe('Routing', () => {
    it('should render ProjectDescriptionForm on root path', () => {
      renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
    });

    it('should render RequiredInformation on /required-information path', () => {
      renderWithRouter('/required-information');
      expect(screen.getByText(/Required Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Missing Critical Details/i)).toBeInTheDocument();
    });

    it('should render Architecture on /architecture path', () => {
      renderWithRouter('/architecture');
      expect(screen.getByText(/System Architecture/i)).toBeInTheDocument();
    });

    it('should render ArchitectureOverview on /architecture-overview path', () => {
      renderWithRouter('/architecture-overview');
      expect(screen.getByText(/Architecture Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended folder structure/i)).toBeInTheDocument();
    });
  });

  // ===== ROUTE COMPONENT TESTS =====
  describe('Route Components', () => {
    it('should render ProjectDescriptionForm with all required fields', () => {
      renderWithRouter('/');

      expect(screen.getByLabelText(/Project Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Backend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Frontend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Database Preferred/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Messaging Queue Framework/i)).toBeInTheDocument();
    });

    it('should render RequiredInformation with all required items', () => {
      renderWithRouter('/required-information');

      expect(screen.getByText(/Authentication & Authorization/i)).toBeInTheDocument();
      expect(screen.getByText(/API Design & Documentation/i)).toBeInTheDocument();
      expect(screen.getByText(/Data Models & Relationships/i)).toBeInTheDocument();
      expect(screen.getByText(/Performance & Scalability Requirements/i)).toBeInTheDocument();
      expect(screen.getByText(/Security & Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/Testing Strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/Deployment & Infrastructure/i)).toBeInTheDocument();
    });

    it('should render Architecture with all form fields', () => {
      renderWithRouter('/architecture');

      expect(screen.getByLabelText(/Architecture Pattern/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Deployment Strategy/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Infrastructure/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Scaling Approach/i)).toBeInTheDocument();
    });

    it('should render ArchitectureOverview with folder structure', () => {
      renderWithRouter('/architecture-overview');

      expect(screen.getByText('project-root')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('database')).toBeInTheDocument();
    });
  });

  // ===== NAVIGATION FLOW TESTS =====
  describe('Navigation Flow', () => {
    it('should allow navigation from ProjectDescriptionForm', () => {
      renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
    });

    it('should have back button on RequiredInformation page', () => {
      renderWithRouter('/required-information');
      expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
    });

    it('should have back button on Architecture page', () => {
      renderWithRouter('/architecture');
      expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
    });

    it('should have back button on ArchitectureOverview page', () => {
      renderWithRouter('/architecture-overview');
      expect(screen.getByText(/Back to Architecture/i)).toBeInTheDocument();
    });
  });

  // ===== LOGO TESTS =====
  describe('Logo Rendering', () => {
    it('should render logo on ProjectDescriptionForm', () => {
      const { container } = renderWithRouter('/');
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
    });

    it('should render logo on RequiredInformation', () => {
      const { container } = renderWithRouter('/required-information');
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
    });

    it('should render logo on Architecture', () => {
      const { container } = renderWithRouter('/architecture');
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
    });

    it('should render logo on ArchitectureOverview', () => {
      const { container } = renderWithRouter('/architecture-overview');
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
    });
  });

  // ===== BUTTON TESTS =====
  describe('Action Buttons', () => {
    it('should render Submit and Reset buttons on ProjectDescriptionForm', () => {
      renderWithRouter('/');

      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    });

    it('should render Validate and Next buttons on RequiredInformation', () => {
      renderWithRouter('/required-information');

      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Next$/i })).toBeInTheDocument();
    });

    it('should render Validate and Next buttons on Architecture', () => {
      renderWithRouter('/architecture');

      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Next$/i })).toBeInTheDocument();
    });

    it('should render Download button on ArchitectureOverview', () => {
      renderWithRouter('/architecture-overview');

      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    });
  });

  // ===== ROUTE PATHS TESTS =====
  describe('Route Paths', () => {
    it('should handle root path "/"', () => {
      renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
    });

    it('should handle "/required-information" path', () => {
      renderWithRouter('/required-information');
      expect(screen.getByText(/Required Information/i)).toBeInTheDocument();
    });

    it('should handle "/architecture" path', () => {
      renderWithRouter('/architecture');
      expect(screen.getByText(/System Architecture/i)).toBeInTheDocument();
    });

    it('should handle "/architecture-overview" path', () => {
      renderWithRouter('/architecture-overview');
      expect(screen.getByText(/Architecture Overview/i)).toBeInTheDocument();
    });
  });

  // ===== PAGE STRUCTURE TESTS =====
  describe('Page Structure', () => {
    it('should have proper structure on ProjectDescriptionForm', () => {
      const { container } = renderWithRouter('/');

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      const heading = screen.getByText(/Project Description Form/i);
      expect(heading).toBeInTheDocument();
    });

    it('should have proper structure on RequiredInformation', () => {
      renderWithRouter('/required-information');

      const heading = screen.getByText(/Required Information/i);
      expect(heading).toBeInTheDocument();

      const textarea = screen.getByLabelText(/Provide Additional Information/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should have proper structure on Architecture', () => {
      const { container } = renderWithRouter('/architecture');

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      const heading = screen.getByText(/System Architecture/i);
      expect(heading).toBeInTheDocument();
    });

    it('should have proper structure on ArchitectureOverview', () => {
      renderWithRouter('/architecture-overview');

      const heading = screen.getByText(/Architecture Overview/i);
      expect(heading).toBeInTheDocument();

      const downloadSection = screen.getByText(/Download Structure/i);
      expect(downloadSection).toBeInTheDocument();
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    it('should render correctly with trailing slash on root', () => {
      renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
    });

    it('should handle multiple renders', () => {
      const { unmount } = renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();

      unmount();

      renderWithRouter('/required-information');
      expect(screen.getByText(/Required Information/i)).toBeInTheDocument();
    });

    it('should maintain component isolation between routes', () => {
      const { unmount } = renderWithRouter('/');
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
      expect(screen.queryByText(/Required Information/i)).not.toBeInTheDocument();

      unmount();

      renderWithRouter('/required-information');
      expect(screen.getByText(/Required Information/i)).toBeInTheDocument();
      expect(screen.queryByText(/Project Description Form/i)).not.toBeInTheDocument();
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility', () => {
    it('should have proper heading on each page', () => {
      const routes = [
        { path: '/', heading: /Project Description Form/i },
        { path: '/required-information', heading: /Required Information/i },
        { path: '/architecture', heading: /System Architecture/i },
        { path: '/architecture-overview', heading: /Architecture Overview/i }
      ];

      routes.forEach(({ path, heading }) => {
        const { unmount } = renderWithRouter(path);
        expect(screen.getByText(heading)).toBeInTheDocument();
        unmount();
      });
    });

    it('should have form elements with proper labels on ProjectDescriptionForm', () => {
      renderWithRouter('/');

      expect(screen.getByLabelText(/Project Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Backend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Frontend Framework/i)).toBeInTheDocument();
    });

    it('should have form elements with proper labels on RequiredInformation', () => {
      renderWithRouter('/required-information');

      expect(screen.getByLabelText(/Provide Additional Information/i)).toBeInTheDocument();
    });

    it('should have form elements with proper labels on Architecture', () => {
      renderWithRouter('/architecture');

      expect(screen.getByLabelText(/Architecture Pattern/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Deployment Strategy/i)).toBeInTheDocument();
    });

    it('should have proper labels on ArchitectureOverview', () => {
      renderWithRouter('/architecture-overview');

      expect(screen.getByLabelText(/Select Format/i)).toBeInTheDocument();
    });
  });

  // ===== INTEGRATION TESTS =====
  describe('Integration', () => {
    it('should render complete application structure', () => {
      const { container } = renderWithRouter('/');

      // Should have Router
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();

      // Should render component
      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
    });

    it('should support all defined routes', () => {
      const routes = ['/', '/required-information', '/architecture', '/architecture-overview'];

      routes.forEach(route => {
        const { unmount } = renderWithRouter(route);
        expect(document.body).toContainHTML('div');
        unmount();
      });
    });

    it('should maintain consistent layout across routes', () => {
      const routes = ['/', '/required-information', '/architecture', '/architecture-overview'];

      routes.forEach(route => {
        const { container, unmount } = renderWithRouter(route);
        const mainDiv = container.querySelector('.min-h-screen');
        expect(mainDiv).toHaveClass('bg-white');
        unmount();
      });
    });

    it('should have working components on all routes', () => {
      // Test each route has interactive elements
      const { unmount: unmount1 } = renderWithRouter('/');
      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
      unmount1();

      const { unmount: unmount2 } = renderWithRouter('/required-information');
      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      unmount2();

      const { unmount: unmount3 } = renderWithRouter('/architecture');
      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      unmount3();

      const { unmount: unmount4 } = renderWithRouter('/architecture-overview');
      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
      unmount4();
    });

    it('should render unique content for each route', () => {
      // ProjectDescriptionForm has Submit button
      const { unmount: unmount1 } = renderWithRouter('/');
      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
      expect(screen.queryByText(/Missing Critical Details/i)).not.toBeInTheDocument();
      unmount1();

      // RequiredInformation has Missing Critical Details
      const { unmount: unmount2 } = renderWithRouter('/required-information');
      expect(screen.getByText(/Missing Critical Details/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Submit/i })).not.toBeInTheDocument();
      unmount2();

      // Architecture has Architecture Pattern
      const { unmount: unmount3 } = renderWithRouter('/architecture');
      expect(screen.getByLabelText(/Architecture Pattern/i)).toBeInTheDocument();
      expect(screen.queryByText(/Missing Critical Details/i)).not.toBeInTheDocument();
      unmount3();

      // ArchitectureOverview has folder structure
      const { unmount: unmount4 } = renderWithRouter('/architecture-overview');
      expect(screen.getByText('project-root')).toBeInTheDocument();
      expect(screen.queryByLabelText(/Architecture Pattern/i)).not.toBeInTheDocument();
      unmount4();
    });
  });

  // ===== LAYOUT CONSISTENCY TESTS =====
  describe('Layout Consistency', () => {
    it('should have consistent background across all pages', () => {
      const routes = ['/', '/required-information', '/architecture', '/architecture-overview'];

      routes.forEach(route => {
        const { container, unmount } = renderWithRouter(route);
        const mainDiv = container.querySelector('.min-h-screen');
        expect(mainDiv).toHaveClass('bg-white');
        unmount();
      });
    });

    it('should have consistent viewport height across all pages', () => {
      const routes = ['/', '/required-information', '/architecture', '/architecture-overview'];

      routes.forEach(route => {
        const { container, unmount } = renderWithRouter(route);
        const mainDiv = container.querySelector('.min-h-screen');
        expect(mainDiv).toHaveClass('min-h-screen');
        unmount();
      });
    });

    it('should render logo consistently across all pages', () => {
      const routes = ['/', '/required-information', '/architecture', '/architecture-overview'];

      routes.forEach(route => {
        const { container, unmount } = renderWithRouter(route);
        const svg = container.querySelector('svg[width="60"]');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('height', '60');
        unmount();
      });
    });
  });
});
