import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Architecture from '../Architecture';

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

describe('Architecture', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ===== RENDERING TESTS =====
  describe('Rendering', () => {
    it('should render the page with title and description', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByText(/System Architecture/i)).toBeInTheDocument();
      expect(screen.getByText(/Define the architectural patterns/i)).toBeInTheDocument();
    });

    it('should render the logo SVG', () => {
      const { container } = renderWithRouter(<Architecture />);
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('height', '60');
    });

    it('should render back button', () => {
      renderWithRouter(<Architecture />);
      const backButton = screen.getByRole('button', { name: /Go back/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByLabelText(/Architecture Pattern/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Deployment Strategy/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Infrastructure/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Scaling Approach/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Additional Architectural Notes/i)).toBeInTheDocument();
    });

    it('should render Validate and Next buttons', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Next$/i })).toBeInTheDocument();
    });

    it('should render all architecture pattern options', () => {
      renderWithRouter(<Architecture />);

      const expectedPatterns = [
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

      expectedPatterns.forEach(pattern => {
        expect(screen.getByRole('option', { name: pattern })).toBeInTheDocument();
      });
    });

    it('should render all deployment strategy options', () => {
      renderWithRouter(<Architecture />);

      const expectedStrategies = [
        'Blue-Green Deployment',
        'Rolling Deployment',
        'Canary Deployment',
        'Recreate Deployment',
        'A/B Testing',
        'Shadow Deployment',
        'Other'
      ];

      expectedStrategies.forEach(strategy => {
        expect(screen.getByRole('option', { name: strategy })).toBeInTheDocument();
      });
    });

    it('should render all infrastructure options', () => {
      renderWithRouter(<Architecture />);

      const expectedOptions = [
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

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render all scaling approach options', () => {
      renderWithRouter(<Architecture />);

      const expectedOptions = [
        'Horizontal Scaling',
        'Vertical Scaling',
        'Auto-Scaling',
        'Manual Scaling',
        'Elastic Scaling',
        'Load Balancing',
        'Other'
      ];

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render required asterisks for required fields', () => {
      const { container } = renderWithRouter(<Architecture />);
      const asterisks = container.querySelectorAll('.text-red-500');
      expect(asterisks.length).toBeGreaterThanOrEqual(4); // 4 required fields
    });

    it('should render help text with navigation links', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByText(/Need help\? Review the/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /required information/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /project description/i })).toBeInTheDocument();
    });

    it('should not show validation message initially', () => {
      renderWithRouter(<Architecture />);

      expect(screen.queryByText(/validated successfully/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Please fill in all required fields/i)).not.toBeInTheDocument();
    });

    it('should render textarea with placeholder', () => {
      renderWithRouter(<Architecture />);
      const textarea = screen.getByLabelText(/Additional Architectural Notes/i);
      expect(textarea).toHaveAttribute('placeholder');
    });
  });

  // ===== NAVIGATION TESTS =====
  describe('Navigation', () => {
    it('should navigate to required-information when back button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const backButton = screen.getByRole('button', { name: /Go back/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/required-information');
    });

    it('should navigate to home when logo is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<Architecture />);

      const logo = container.querySelector('.cursor-pointer');
      await user.click(logo);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to required-information when help link is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const helpLink = screen.getByRole('button', { name: /required information/i });
      await user.click(helpLink);

      expect(mockNavigate).toHaveBeenCalledWith('/required-information');
    });

    it('should navigate to home when project description link is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const helpLink = screen.getByRole('button', { name: /project description/i });
      await user.click(helpLink);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to architecture-overview when Next is clicked with valid data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Blue-Green Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture-overview');
    });

    it('should not navigate when Next is clicked with empty form', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ===== FORM INTERACTION TESTS =====
  describe('Form Interactions', () => {
    it('should update architecture pattern when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const select = screen.getByLabelText(/Architecture Pattern/i);
      await user.selectOptions(select, 'Microservices');

      expect(select).toHaveValue('Microservices');
    });

    it('should update deployment strategy when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const select = screen.getByLabelText(/Deployment Strategy/i);
      await user.selectOptions(select, 'Canary Deployment');

      expect(select).toHaveValue('Canary Deployment');
    });

    it('should update infrastructure when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const select = screen.getByLabelText(/Infrastructure/i);
      await user.selectOptions(select, 'Cloud-Native (Azure)');

      expect(select).toHaveValue('Cloud-Native (Azure)');
    });

    it('should update scaling approach when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const select = screen.getByLabelText(/Scaling Approach/i);
      await user.selectOptions(select, 'Horizontal Scaling');

      expect(select).toHaveValue('Horizontal Scaling');
    });

    it('should update additional notes when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const textarea = screen.getByLabelText(/Additional Architectural Notes/i);
      await user.type(textarea, 'Additional considerations for the architecture');

      expect(textarea).toHaveValue('Additional considerations for the architecture');
    });

    it('should handle multiple field updates', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Serverless');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Rolling Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Serverless');

      expect(screen.getByLabelText(/Architecture Pattern/i)).toHaveValue('Serverless');
      expect(screen.getByLabelText(/Deployment Strategy/i)).toHaveValue('Rolling Deployment');
      expect(screen.getByLabelText(/Infrastructure/i)).toHaveValue('Serverless');
    });

    it('should clear error when field is updated', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Trigger error
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));
      await waitFor(() => {
        expect(screen.getByText(/Architecture pattern is required/i)).toBeInTheDocument();
      });

      // Update field
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');

      await waitFor(() => {
        expect(screen.queryByText(/Architecture pattern is required/i)).not.toBeInTheDocument();
      });
    });

    it('should clear validation message when field is updated', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Trigger validation error
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));
      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });

      // Update field
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');

      await waitFor(() => {
        expect(screen.queryByText(/Please fill in all required fields/i)).not.toBeInTheDocument();
      });
    });
  });

  // ===== VALIDATION TESTS =====
  describe('Validation', () => {
    it('should show all field errors when validating empty form', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Architecture pattern is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Deployment strategy is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Infrastructure preference is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Scaling approach is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });
    });

    it('should show partial errors when some fields are filled', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Blue-Green Deployment');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.queryByText(/Architecture pattern is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Deployment strategy is required/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Infrastructure preference is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Scaling approach is required/i)).toBeInTheDocument();
      });
    });

    it('should show success message when all required fields are filled', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Canary Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Architecture configuration validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should not require additional notes for validation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Monolithic');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Rolling Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'On-Premises');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Manual Scaling');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should log to console on successful validation', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Event-Driven');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Shadow Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Multi-Cloud');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Elastic Scaling');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      expect(consoleSpy).toHaveBeenCalledWith('Architecture Configuration:', expect.objectContaining({
        pattern: 'Event-Driven',
        deploymentStrategy: 'Shadow Deployment',
        infrastructure: 'Multi-Cloud',
        scalingApproach: 'Elastic Scaling'
      }));
      consoleSpy.mockRestore();
    });

    it('should show error border on invalid fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/Architecture Pattern/i)).toHaveClass('border-red-500');
        expect(screen.getByLabelText(/Deployment Strategy/i)).toHaveClass('border-red-500');
        expect(screen.getByLabelText(/Infrastructure/i)).toHaveClass('border-red-500');
        expect(screen.getByLabelText(/Scaling Approach/i)).toHaveClass('border-red-500');
      });
    });

    it('should show error when clicking Next with empty form', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.click(screen.getByRole('button', { name: /^Next$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Please validate your architecture configuration before proceeding/i)).toBeInTheDocument();
      });
    });

    it('should allow navigation when all required fields are filled', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'CQRS');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'A/B Testing');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Containerized (Kubernetes)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Load Balancing');

      await user.click(screen.getByRole('button', { name: /^Next$/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/architecture-overview');
    });
  });

  // ===== UI STATE TESTS =====
  describe('UI State', () => {
    it('should show amber-colored message for validation errors', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        const messageContainer = screen.getByText(/Please fill in all required fields/i).closest('div');
        expect(messageContainer).toHaveClass('bg-amber-50', 'border-amber-200', 'text-amber-800');
      });
    });

    it('should show green-colored message for validation success', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Blue-Green Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        const messageContainer = screen.getByText(/validated successfully/i).closest('div');
        expect(messageContainer).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
      });
    });

    it('should have correct initial state', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByLabelText(/Architecture Pattern/i)).toHaveValue('');
      expect(screen.getByLabelText(/Deployment Strategy/i)).toHaveValue('');
      expect(screen.getByLabelText(/Infrastructure/i)).toHaveValue('');
      expect(screen.getByLabelText(/Scaling Approach/i)).toHaveValue('');
      expect(screen.getByLabelText(/Additional Architectural Notes/i)).toHaveValue('');
    });

    it('should maintain state during validation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Layered Architecture');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Recreate Deployment');
      await user.type(screen.getByLabelText(/Additional Architectural Notes/i), 'Test notes');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      // Values should still be there
      expect(screen.getByLabelText(/Architecture Pattern/i)).toHaveValue('Layered Architecture');
      expect(screen.getByLabelText(/Deployment Strategy/i)).toHaveValue('Recreate Deployment');
      expect(screen.getByLabelText(/Additional Architectural Notes/i)).toHaveValue('Test notes');
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      renderWithRouter(<Architecture />);

      expect(screen.getByLabelText(/Architecture Pattern/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Deployment Strategy/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Infrastructure/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Scaling Approach/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Additional Architectural Notes/i)).toBeInTheDocument();
    });

    it('should have aria-label for back button', () => {
      renderWithRouter(<Architecture />);

      const backButton = screen.getByRole('button', { name: /Go back/i });
      expect(backButton).toHaveAttribute('aria-label', 'Go back');
    });

    it('should have proper button types', () => {
      renderWithRouter(<Architecture />);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      const nextButton = screen.getByRole('button', { name: /^Next$/i });

      expect(validateButton).toHaveAttribute('type', 'button');
      expect(nextButton).toHaveAttribute('type', 'button');
    });

    it('should have form element', () => {
      const { container } = renderWithRouter(<Architecture />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have focusable elements', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const select = screen.getByLabelText(/Architecture Pattern/i);
      await user.click(select);

      expect(select).toHaveFocus();
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    it('should handle "Other" option selections', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Other');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle rapid field changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const patternSelect = screen.getByLabelText(/Architecture Pattern/i);

      await user.selectOptions(patternSelect, 'Monolithic');
      await user.selectOptions(patternSelect, 'Microservices');
      await user.selectOptions(patternSelect, 'Serverless');

      expect(patternSelect).toHaveValue('Serverless');
    });

    it('should handle long additional notes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const longNotes = 'A'.repeat(5000);
      const textarea = screen.getByLabelText(/Additional Architectural Notes/i);
      await user.type(textarea, longNotes);

      expect(textarea).toHaveValue(longNotes);
    });

    it('should handle special characters in additional notes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const specialChars = '!@#$%^&*()_+-={}[]|:;"<>?,./~`';
      const textarea = screen.getByLabelText(/Additional Architectural Notes/i);
      await user.type(textarea, specialChars);

      expect(textarea).toHaveValue(specialChars);
    });

    it('should log to console when proceeding to next step', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      const data = {
        pattern: 'Hexagonal Architecture',
        deploymentStrategy: 'Blue-Green Deployment',
        infrastructure: 'Cloud-Native (Google Cloud)',
        scalingApproach: 'Auto-Scaling',
        additionalNotes: 'Test notes'
      };

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), data.pattern);
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), data.deploymentStrategy);
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), data.infrastructure);
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), data.scalingApproach);
      await user.type(screen.getByLabelText(/Additional Architectural Notes/i), data.additionalNotes);

      await user.click(screen.getByRole('button', { name: /^Next$/i }));

      expect(consoleSpy).toHaveBeenCalledWith('Proceeding with architecture:', data);
      consoleSpy.mockRestore();
    });

    it('should handle multiple validation attempts', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // First validation - fail
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));
      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });

      // Add some fields
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Canary Deployment');

      // Second validation - still fail
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));
      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });

      // Complete the form
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');

      // Third validation - success
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));
      await waitFor(() => {
        expect(screen.getByText(/validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle navigation without validation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Fill form without validating
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Blue-Green Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');

      // Should be able to proceed directly
      await user.click(screen.getByRole('button', { name: /^Next$/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/architecture-overview');
    });

    it('should include additional notes in console log', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Blue-Green Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');
      await user.type(screen.getByLabelText(/Additional Architectural Notes/i), 'Important notes');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      expect(consoleSpy).toHaveBeenCalledWith('Architecture Configuration:', expect.objectContaining({
        additionalNotes: 'Important notes'
      }));
      consoleSpy.mockRestore();
    });
  });

  // ===== INTEGRATION TESTS =====
  describe('Integration', () => {
    it('should complete full validation and navigation flow', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Fill form
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Microservices');
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Canary Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Cloud-Native (AWS)');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Auto-Scaling');
      await user.type(screen.getByLabelText(/Additional Architectural Notes/i), 'Using API Gateway and Lambda');

      // Validate
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/validated successfully/i)).toBeInTheDocument();
      });

      // Navigate
      await user.click(screen.getByRole('button', { name: /^Next$/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/architecture-overview');
    });

    it('should allow navigation between pages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Navigate back
      const backButton = screen.getByRole('button', { name: /Go back/i });
      await user.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/required-information');

      mockNavigate.mockClear();

      // Navigate via help link
      const helpLink = screen.getByRole('button', { name: /required information/i });
      await user.click(helpLink);
      expect(mockNavigate).toHaveBeenCalledWith('/required-information');
    });

    it('should maintain form state during corrections', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Architecture />);

      // Partially fill and validate
      await user.selectOptions(screen.getByLabelText(/Architecture Pattern/i), 'Event-Driven');
      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
      });

      // Complete and validate again
      await user.selectOptions(screen.getByLabelText(/Deployment Strategy/i), 'Shadow Deployment');
      await user.selectOptions(screen.getByLabelText(/Infrastructure/i), 'Hybrid Cloud');
      await user.selectOptions(screen.getByLabelText(/Scaling Approach/i), 'Elastic Scaling');

      await user.click(screen.getByRole('button', { name: /^Validate$/i }));

      await waitFor(() => {
        expect(screen.getByText(/validated successfully/i)).toBeInTheDocument();
      });

      // Should maintain first selection
      expect(screen.getByLabelText(/Architecture Pattern/i)).toHaveValue('Event-Driven');
    });
  });
});
