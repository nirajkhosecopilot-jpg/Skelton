import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProjectDescriptionForm from '../ProjectDescriptionForm';

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

describe('ProjectDescriptionForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ===== RENDERING TESTS =====
  describe('Rendering', () => {
    it('should render the form with all required fields', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      expect(screen.getByText(/Project Description Form/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Project Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Backend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Frontend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Database Preferred/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Messaging Queue Framework/i)).toBeInTheDocument();
    });

    it('should render the logo SVG', () => {
      const { container } = renderWithRouter(<ProjectDescriptionForm />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '60');
      expect(svg).toHaveAttribute('height', '60');
    });

    it('should render submit and reset buttons', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    });

    it('should render all backend framework options', () => {
      renderWithRouter(<ProjectDescriptionForm />);
      const backendSelect = screen.getByLabelText(/Backend Framework/i);

      const expectedOptions = [
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

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render all frontend framework options', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      const expectedOptions = [
        'React',
        'Vue.js',
        'Angular',
        'Next.js',
        'Svelte',
        'Vanilla JavaScript',
        'Other'
      ];

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render all database options', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      const expectedOptions = [
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

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should render all messaging queue options', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      const expectedOptions = [
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

      expectedOptions.forEach(option => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('should not show submission summary initially', () => {
      renderWithRouter(<ProjectDescriptionForm />);
      expect(screen.queryByText(/Submitted Information/i)).not.toBeInTheDocument();
    });
  });

  // ===== FORM INTERACTION TESTS =====
  describe('Form Interactions', () => {
    it('should update project description when user types', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const textarea = screen.getByLabelText(/Project Description/i);
      await user.type(textarea, 'This is a test project description');

      expect(textarea).toHaveValue('This is a test project description');
    });

    it('should update backend framework when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const select = screen.getByLabelText(/Backend Framework/i);
      await user.selectOptions(select, 'Node.js (Express)');

      expect(select).toHaveValue('Node.js (Express)');
    });

    it('should update frontend framework when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const select = screen.getByLabelText(/Frontend Framework/i);
      await user.selectOptions(select, 'React');

      expect(select).toHaveValue('React');
    });

    it('should update database when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const select = screen.getByLabelText(/Database Preferred/i);
      await user.selectOptions(select, 'PostgreSQL');

      expect(select).toHaveValue('PostgreSQL');
    });

    it('should update messaging queue when selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const select = screen.getByLabelText(/Messaging Queue Framework/i);
      await user.selectOptions(select, 'RabbitMQ');

      expect(select).toHaveValue('RabbitMQ');
    });

    it('should handle multiple field updates', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'Test description');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Python (Django)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'Vue.js');

      expect(screen.getByLabelText(/Project Description/i)).toHaveValue('Test description');
      expect(screen.getByLabelText(/Backend Framework/i)).toHaveValue('Python (Django)');
      expect(screen.getByLabelText(/Frontend Framework/i)).toHaveValue('Vue.js');
    });
  });

  // ===== VALIDATION TESTS =====
  describe('Form Validation', () => {
    it('should show error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Backend framework is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Frontend framework is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Database preference is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Messaging queue framework is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when project description is too short', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'Short');
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/Project description must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when project description is only whitespace', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), '     ');
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing in project description', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      // First, trigger an error
      await user.click(screen.getByRole('button', { name: /Submit/i }));
      await waitFor(() => {
        expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
      });

      // Then start typing
      await user.type(screen.getByLabelText(/Project Description/i), 'New text');

      await waitFor(() => {
        expect(screen.queryByText(/Project description is required/i)).not.toBeInTheDocument();
      });
    });

    it('should clear error when user selects a backend framework', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      // Trigger error
      await user.click(screen.getByRole('button', { name: /Submit/i }));
      await waitFor(() => {
        expect(screen.getByText(/Backend framework is required/i)).toBeInTheDocument();
      });

      // Select option
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');

      await waitFor(() => {
        expect(screen.queryByText(/Backend framework is required/i)).not.toBeInTheDocument();
      });
    });

    it('should show border error style on invalid fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        const textarea = screen.getByLabelText(/Project Description/i);
        expect(textarea).toHaveClass('border-red-500');
      });
    });

    it('should accept minimum valid project description length', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), '1234567890'); // Exactly 10 chars
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'PostgreSQL');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'RabbitMQ');

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/required-information');
      });
    });
  });

  // ===== FORM SUBMISSION TESTS =====
  describe('Form Submission', () => {
    it('should navigate to required-information on valid submission', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'This is a valid project description with enough characters');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'PostgreSQL');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'RabbitMQ');

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/required-information');
      });
    });

    it('should not navigate when form is invalid', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('should log form data to console on submission', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const formData = {
        projectDescription: 'Test project description with enough characters',
        backendFramework: 'Python (FastAPI)',
        frontendFramework: 'Vue.js',
        database: 'MongoDB',
        messagingQueue: 'Apache Kafka'
      };

      await user.type(screen.getByLabelText(/Project Description/i), formData.projectDescription);
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), formData.backendFramework);
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), formData.frontendFramework);
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), formData.database);
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), formData.messagingQueue);

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      expect(consoleSpy).toHaveBeenCalledWith('Project Information Submitted:', formData);
      consoleSpy.mockRestore();
    });

    it('should submit with "Other" options selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'Test with other options selected');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'Other');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'Other');

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/required-information');
      });
    });

    it('should submit with "None" messaging queue option', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'Test with no messaging queue');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Go');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'Svelte');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'Redis');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'None');

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/required-information');
      });
    });
  });

  // ===== RESET FUNCTIONALITY TESTS =====
  describe('Reset Functionality', () => {
    it('should clear all fields when reset button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      // Fill form
      await user.type(screen.getByLabelText(/Project Description/i), 'Test description');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'PostgreSQL');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'RabbitMQ');

      // Click reset
      await user.click(screen.getByRole('button', { name: /Reset/i }));

      // Verify all fields are cleared
      expect(screen.getByLabelText(/Project Description/i)).toHaveValue('');
      expect(screen.getByLabelText(/Backend Framework/i)).toHaveValue('');
      expect(screen.getByLabelText(/Frontend Framework/i)).toHaveValue('');
      expect(screen.getByLabelText(/Database Preferred/i)).toHaveValue('');
      expect(screen.getByLabelText(/Messaging Queue Framework/i)).toHaveValue('');
    });

    it('should clear errors when reset button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      // Trigger errors
      await user.click(screen.getByRole('button', { name: /Submit/i }));
      await waitFor(() => {
        expect(screen.getByText(/Project description is required/i)).toBeInTheDocument();
      });

      // Click reset
      await user.click(screen.getByRole('button', { name: /Reset/i }));

      // Errors should be cleared
      expect(screen.queryByText(/Project description is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Backend framework is required/i)).not.toBeInTheDocument();
    });

    it('should not trigger form submission when reset is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.click(screen.getByRole('button', { name: /Reset/i }));

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility', () => {
    it('should have proper labels for all form inputs', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      expect(screen.getByLabelText(/Project Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Backend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Frontend Framework/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Database Preferred/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Messaging Queue Framework/i)).toBeInTheDocument();
    });

    it('should mark all fields as required with asterisk', () => {
      const { container } = renderWithRouter(<ProjectDescriptionForm />);
      const asterisks = container.querySelectorAll('.text-red-500');
      expect(asterisks.length).toBe(5); // 5 required fields
    });

    it('should have proper button roles', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      const resetButton = screen.getByRole('button', { name: /Reset/i });

      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(resetButton).toHaveAttribute('type', 'button');
    });

    it('should have proper form element', () => {
      const { container } = renderWithRouter(<ProjectDescriptionForm />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have placeholder text for project description', () => {
      renderWithRouter(<ProjectDescriptionForm />);
      const textarea = screen.getByLabelText(/Project Description/i);
      expect(textarea).toHaveAttribute('placeholder', 'Describe your project in detail...');
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    it('should handle very long project description', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const longDescription = 'A'.repeat(5000);
      await user.type(screen.getByLabelText(/Project Description/i), longDescription);

      expect(screen.getByLabelText(/Project Description/i)).toHaveValue(longDescription);
    });

    it('should handle special characters in project description', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const specialChars = '!@#$%^&*()_+-={}[]|:;"<>?,./~`';
      await user.type(screen.getByLabelText(/Project Description/i), specialChars);

      expect(screen.getByLabelText(/Project Description/i)).toHaveValue(specialChars);
    });

    it('should handle unicode characters in project description', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const unicode = '你好世界 🚀 Привет мир';
      await user.type(screen.getByLabelText(/Project Description/i), unicode);

      expect(screen.getByLabelText(/Project Description/i)).toHaveValue(unicode);
    });

    it('should handle rapid form field changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const backendSelect = screen.getByLabelText(/Backend Framework/i);

      await user.selectOptions(backendSelect, 'Node.js (Express)');
      await user.selectOptions(backendSelect, 'Python (Django)');
      await user.selectOptions(backendSelect, 'Java (Spring Boot)');

      expect(backendSelect).toHaveValue('Java (Spring Boot)');
    });

    it('should handle form submission with extra whitespace in description', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), '   Valid description with spaces   ');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'PostgreSQL');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'RabbitMQ');

      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/required-information');
      });
    });

    it('should handle multiple submissions', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      // Fill form
      await user.type(screen.getByLabelText(/Project Description/i), 'Valid description for testing');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');
      await user.selectOptions(screen.getByLabelText(/Database Preferred/i), 'PostgreSQL');
      await user.selectOptions(screen.getByLabelText(/Messaging Queue Framework/i), 'RabbitMQ');

      // Submit multiple times
      await user.click(screen.getByRole('button', { name: /Submit/i }));
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ===== UI STATE TESTS =====
  describe('UI State', () => {
    it('should have correct initial state', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      expect(screen.getByLabelText(/Project Description/i)).toHaveValue('');
      expect(screen.getByLabelText(/Backend Framework/i)).toHaveValue('');
      expect(screen.getByLabelText(/Frontend Framework/i)).toHaveValue('');
      expect(screen.getByLabelText(/Database Preferred/i)).toHaveValue('');
      expect(screen.getByLabelText(/Messaging Queue Framework/i)).toHaveValue('');
    });

    it('should apply focus styles to inputs', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      const textarea = screen.getByLabelText(/Project Description/i);
      await user.click(textarea);

      expect(textarea).toHaveFocus();
    });

    it('should show default placeholder options in selects', () => {
      renderWithRouter(<ProjectDescriptionForm />);

      expect(screen.getByRole('option', { name: /Select a backend framework.../i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Select a frontend framework.../i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Select a database.../i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Select a messaging queue framework.../i })).toBeInTheDocument();
    });

    it('should maintain form state during user interaction', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProjectDescriptionForm />);

      await user.type(screen.getByLabelText(/Project Description/i), 'Test');
      await user.selectOptions(screen.getByLabelText(/Backend Framework/i), 'Node.js (Express)');

      // Interact with another field
      await user.selectOptions(screen.getByLabelText(/Frontend Framework/i), 'React');

      // Original values should still be there
      expect(screen.getByLabelText(/Project Description/i)).toHaveValue('Test');
      expect(screen.getByLabelText(/Backend Framework/i)).toHaveValue('Node.js (Express)');
    });
  });
});
