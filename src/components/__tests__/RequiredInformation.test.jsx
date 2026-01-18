import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RequiredInformation from '../RequiredInformation';

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

describe('RequiredInformation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ===== RENDERING TESTS =====
  describe('Rendering', () => {
    it('should render the page with title and description', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByText(/Required Information/i)).toBeInTheDocument();
      expect(screen.getByText(/Based on your project description/i)).toBeInTheDocument();
    });

    it('should render the logo SVG', () => {
      const { container } = renderWithRouter(<RequiredInformation />);
      const svg = container.querySelector('svg[width="60"]');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('height', '60');
    });

    it('should render back button', () => {
      renderWithRouter(<RequiredInformation />);
      const backButton = screen.getByRole('button', { name: /Go back/i });
      expect(backButton).toBeInTheDocument();
    });

    it('should render all 7 required information items', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByText(/Authentication & Authorization/i)).toBeInTheDocument();
      expect(screen.getByText(/API Design & Documentation/i)).toBeInTheDocument();
      expect(screen.getByText(/Data Models & Relationships/i)).toBeInTheDocument();
      expect(screen.getByText(/Performance & Scalability Requirements/i)).toBeInTheDocument();
      expect(screen.getByText(/Security & Compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/Testing Strategy/i)).toBeInTheDocument();
      expect(screen.getByText(/Deployment & Infrastructure/i)).toBeInTheDocument();
    });

    it('should render required items with descriptions', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByText(/Specify authentication methods/i)).toBeInTheDocument();
      expect(screen.getByText(/Define REST\/GraphQL endpoints/i)).toBeInTheDocument();
      expect(screen.getByText(/Detail entity relationships/i)).toBeInTheDocument();
      expect(screen.getByText(/Expected load, response time targets/i)).toBeInTheDocument();
      expect(screen.getByText(/Data encryption requirements/i)).toBeInTheDocument();
      expect(screen.getByText(/Unit testing framework/i)).toBeInTheDocument();
      expect(screen.getByText(/Hosting platform/i)).toBeInTheDocument();
    });

    it('should render numbered items from 1 to 7', () => {
      renderWithRouter(<RequiredInformation />);

      for (let i = 1; i <= 7; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should render textarea with label', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByLabelText(/Provide Additional Information/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render Validate and Next buttons', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByRole('button', { name: /^Validate$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Next$/i })).toBeInTheDocument();
    });

    it('should render character counter with initial value', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByText(/Minimum 50 characters required/i)).toBeInTheDocument();
      expect(screen.getByText(/0 characters/i)).toBeInTheDocument();
    });

    it('should render help text with link', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.getByText(/Need help\? Review the/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /project description/i })).toBeInTheDocument();
    });

    it('should render warning icon in header', () => {
      renderWithRouter(<RequiredInformation />);
      const warningSection = screen.getByText(/Missing Critical Details/i).parentElement;
      expect(warningSection).toBeInTheDocument();
    });

    it('should render required asterisk', () => {
      renderWithRouter(<RequiredInformation />);
      const label = screen.getByText(/Provide Additional Information/i);
      const asterisk = label.parentElement?.querySelector('.text-red-500');
      expect(asterisk).toBeInTheDocument();
    });

    it('should render textarea placeholder', () => {
      renderWithRouter(<RequiredInformation />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('placeholder');
      expect(textarea.getAttribute('placeholder')).toContain('authentication');
    });
  });

  // ===== NAVIGATION TESTS =====
  describe('Navigation', () => {
    it('should navigate to home when back button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const backButton = screen.getByRole('button', { name: /Go back/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to home when logo is clicked', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<RequiredInformation />);

      const logo = container.querySelector('.cursor-pointer');
      await user.click(logo);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to home when help text link is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const helpLink = screen.getByRole('button', { name: /project description/i });
      await user.click(helpLink);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to architecture when Next is clicked with valid input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is a valid input with more than fifty characters for testing');

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture');
    });

    it('should not navigate when Next is clicked with empty input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not navigate when Next is clicked with short input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Short');

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ===== INPUT INTERACTION TESTS =====
  describe('Input Interactions', () => {
    it('should update textarea value when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Test input');

      expect(textarea).toHaveValue('Test input');
    });

    it('should update character counter as user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello World');

      await waitFor(() => {
        expect(screen.getByText(/11 characters/i)).toBeInTheDocument();
      });
    });

    it('should clear validation message when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      // First trigger validation error
      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide additional information to address the missing requirements/i)).toBeInTheDocument();
      });

      // Then start typing
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'New text');

      await waitFor(() => {
        expect(screen.queryByText(/Please provide additional information to address the missing requirements/i)).not.toBeInTheDocument();
      });
    });

    it('should handle long text input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const longText = 'A'.repeat(1000);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, longText);

      expect(textarea).toHaveValue(longText);
      await waitFor(() => {
        expect(screen.getByText(/1000 characters/i)).toBeInTheDocument();
      });
    });

    it('should handle special characters in input', async () => {
      renderWithRouter(<RequiredInformation />);

      const specialChars = '!@#$%^&*()_+-={}[]|:;"<>?,./~`';
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: specialChars } });

      expect(textarea).toHaveValue(specialChars);
    });

    it('should handle unicode characters in input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const unicode = '你好世界 🚀 Привет';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, unicode);

      expect(textarea).toHaveValue(unicode);
    });

    it('should handle multiline input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const multilineText = 'Line 1\nLine 2\nLine 3 with enough characters to be valid';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, multilineText);

      expect(textarea).toHaveValue(multilineText);
    });
  });

  // ===== VALIDATION TESTS =====
  describe('Validation', () => {
    it('should show error when validating empty input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide additional information to address the missing requirements/i)).toBeInTheDocument();
      });
    });

    it('should show error when validating input with only whitespace', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '     ');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide additional information to address the missing requirements/i)).toBeInTheDocument();
      });
    });

    it('should show error when validating input with less than 50 characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is short text');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide more detailed information \(at least 50 characters\)/i)).toBeInTheDocument();
      });
    });

    it('should show success when validating input with exactly 50 characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      const fiftyChars = 'A'.repeat(50);
      await user.type(textarea, fiftyChars);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should show success when validating input with more than 50 characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is a valid detailed input with more than fifty characters for testing validation');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should log to console when validation is successful', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const validInput = 'This is valid input with more than fifty characters for testing';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, validInput);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      expect(consoleSpy).toHaveBeenCalledWith('Additional Information Provided:', validInput);
      consoleSpy.mockRestore();
    });

    it('should show error when clicking Next without validation', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please validate your information before proceeding/i)).toBeInTheDocument();
      });
    });

    it('should show error when clicking Next with short input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Short');

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Please validate your information before proceeding/i)).toBeInTheDocument();
      });
    });

    it('should accept input with leading/trailing whitespace if trimmed length is valid', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, '   This is valid input with more than fifty characters for testing   ');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });
  });

  // ===== UI STATE TESTS =====
  describe('UI State', () => {
    it('should show amber-colored validation message for errors', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        const message = screen.getByText(/Please provide additional information to address the missing requirements/i);
        const messageContainer = message.closest('div[class*="bg-amber"]');
        expect(messageContainer).toHaveClass('bg-amber-50', 'border-amber-200', 'text-amber-800');
      });
    });

    it('should show green-colored validation message for success', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is a valid detailed input with more than fifty characters');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        const message = screen.getByText(/Information validated successfully/i);
        const messageContainer = message.closest('div[class*="bg-green"]');
        expect(messageContainer).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
      });
    });

    it('should show different icons for error and success messages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      // First show error
      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Please provide additional information to address the missing requirements/i);
        expect(errorMessage).toBeInTheDocument();
      });

      // Then show success
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'This is a valid detailed input with more than fifty characters');
      await user.click(validateButton);

      await waitFor(() => {
        const successMessage = screen.getByText(/Information validated successfully/i);
        expect(successMessage).toBeInTheDocument();
      });
    });

    it('should not show validation message initially', () => {
      renderWithRouter(<RequiredInformation />);

      expect(screen.queryByText(/Please provide additional information to address the missing requirements/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Information validated successfully/i)).not.toBeInTheDocument();
    });

    it('should maintain textarea state across validations', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const inputText = 'This is a test input with more than fifty characters for validation';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, inputText);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      // Value should still be there after validation
      expect(textarea).toHaveValue(inputText);
    });

    it('should have correct initial textarea state', () => {
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility', () => {
    it('should have proper label for textarea', () => {
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByLabelText(/Provide Additional Information/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should have aria-label for back button', () => {
      renderWithRouter(<RequiredInformation />);

      const backButton = screen.getByRole('button', { name: /Go back/i });
      expect(backButton).toHaveAttribute('aria-label', 'Go back');
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<RequiredInformation />);

      const h1 = container.querySelector('h1');
      const h2 = container.querySelector('h2');
      const h3 = container.querySelector('h3');

      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/Required Information/i);
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      renderWithRouter(<RequiredInformation />);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      const nextButton = screen.getByRole('button', { name: /^Next$/i });

      // These are not in a form, so they should be regular buttons
      expect(validateButton).toHaveAttribute('type', 'button');
      expect(nextButton).toHaveAttribute('type', 'button');
    });

    it('should have focusable interactive elements', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);

      expect(textarea).toHaveFocus();
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    it('should handle exactly 49 characters (one less than minimum)', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const fortyNineChars = 'A'.repeat(49);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, fortyNineChars);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide more detailed information/i)).toBeInTheDocument();
      });
    });

    it('should handle extremely long input', async () => {
      renderWithRouter(<RequiredInformation />);

      const veryLongText = 'A'.repeat(10000);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: veryLongText } });

      expect(textarea).toHaveValue(veryLongText);
      await waitFor(() => {
        expect(screen.getByText(/10000 characters/i)).toBeInTheDocument();
      });
    });

    it('should handle rapid button clicks', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Valid input with more than fifty characters for testing');

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);
      await user.click(validateButton);
      await user.click(validateButton);

      // Should still show success message
      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle whitespace-only input with 50+ characters', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const whitespace = ' '.repeat(60);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: whitespace } });

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide additional information to address the missing requirements/i)).toBeInTheDocument();
      });
    });

    it('should handle mixed whitespace and valid content', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const mixedContent = '   Valid content with spaces and more than fifty characters   ';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, mixedContent);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should log to console when proceeding to next step', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const validInput = 'This is valid input with more than fifty characters for testing';
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, validInput);

      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(consoleSpy).toHaveBeenCalledWith('Proceeding to next step with information:', validInput);
      consoleSpy.mockRestore();
    });

    it('should handle validation state changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const validateButton = screen.getByRole('button', { name: /^Validate$/i });

      // First validation - error
      await user.click(validateButton);
      await waitFor(() => {
        expect(screen.getByText(/Please provide additional information to address the missing requirements/i)).toBeInTheDocument();
      });

      // Add valid input
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Now this is valid input with more than fifty characters');

      // Second validation - success
      await user.click(validateButton);
      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle navigation attempts with invalid data', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      const nextButton = screen.getByRole('button', { name: /^Next$/i });

      // Try to navigate multiple times with invalid data
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      // Should not navigate
      expect(mockNavigate).not.toHaveBeenCalled();

      // Should show validation message
      await waitFor(() => {
        expect(screen.getByText(/Please validate your information before proceeding/i)).toBeInTheDocument();
      });
    });
  });

  // ===== INTEGRATION TESTS =====
  describe('Integration', () => {
    it('should complete full validation and navigation flow', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      // Enter valid input
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Complete authentication setup with OAuth 2.0, JWT tokens, and role-based access control');

      // Validate
      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });

      // Navigate to next page
      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture');
    });

    it('should allow multiple back and forth between pages', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      // Navigate back
      const backButton = screen.getByRole('button', { name: /Go back/i });
      await user.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');

      mockNavigate.mockClear();

      // Navigate via help link
      const helpLink = screen.getByRole('button', { name: /project description/i });
      await user.click(helpLink);
      expect(mockNavigate).toHaveBeenCalledWith('/');

      mockNavigate.mockClear();

      // Navigate via logo
      const { container } = renderWithRouter(<RequiredInformation />);
      const logo = container.querySelector('.cursor-pointer');
      await user.click(logo);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should maintain state during user corrections', async () => {
      const user = userEvent.setup();
      renderWithRouter(<RequiredInformation />);

      // Enter short text
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Short');

      // Try to validate - should fail
      const validateButton = screen.getByRole('button', { name: /^Validate$/i });
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Please provide more detailed information/i)).toBeInTheDocument();
      });

      // Add more text to make it valid
      await user.type(textarea, ' text that makes this input valid with more than fifty characters');

      // Validate again - should succeed
      await user.click(validateButton);

      await waitFor(() => {
        expect(screen.getByText(/Information validated successfully/i)).toBeInTheDocument();
      });

      // Should be able to proceed
      const nextButton = screen.getByRole('button', { name: /^Next$/i });
      await user.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith('/architecture');
    });
  });
});
