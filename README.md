# Project Description Form - React Application

A React-based web application for collecting project information including backend framework, frontend framework, database preferences, and messaging queue framework selections.

## Features

- **Project Description Input**: Multi-line text area for detailed project descriptions
- **Framework Selection**: Dropdown menus for backend and frontend frameworks
- **Database Selection**: Choose from popular database options
- **Messaging Queue Selection**: Select messaging queue frameworks
- **Form Validation**: Client-side validation ensures all required fields are completed
- **Submission Summary**: Display collected information after form submission
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+ required for Vite)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Skelton
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

#### Running with .NET Aspire (Recommended)

For a better development experience with built-in dashboard, monitoring, and orchestration:

**Prerequisites:**
- .NET 9.0 SDK or later
- Node.js 20.19+ or 22.12+ (required for Vite)

**Quick Start:**
```bash
# Use helper scripts (includes version checks)
./run-aspire.sh    # Linux/macOS
run-aspire.bat     # Windows

# Or run directly
cd Skelton.AppHost
dotnet run
```

This will:
- Start the Aspire Dashboard at `https://localhost:17219`
- Automatically launch the React application
- Provide real-time monitoring, logs, and metrics

**Benefits:**
- Unified dashboard for monitoring
- Built-in observability (logging, tracing, metrics)
- Easy service orchestration
- Cloud-ready deployment support

For detailed Aspire setup and usage, see [ASPIRE.md](./ASPIRE.md).

## Application Structure

```
Skelton/
├── src/                                   # React application source
│   ├── components/
│   │   ├── ProjectDescriptionForm.jsx    # Main form component
│   │   └── ProjectDescriptionForm.css    # Form styling
│   ├── App.jsx                            # Root application component
│   ├── App.css                            # Application styling
│   ├── index.css                          # Global styles
│   └── main.jsx                           # Application entry point
├── Skelton.AppHost/                       # .NET Aspire orchestration
│   ├── Program.cs                         # Aspire configuration
│   ├── Skelton.AppHost.csproj            # AppHost project file
│   ├── Properties/
│   │   └── launchSettings.json           # Launch settings
│   └── appsettings.json                  # App configuration
├── public/                                # Static assets
├── package.json                           # Node.js dependencies
├── Skelton.sln                            # .NET solution file
├── vite.config.js                         # Vite configuration
├── README.md                              # This file
└── ASPIRE.md                              # Aspire documentation
```

## Form Fields

The form collects the following information:

1. **Project Description** (required)
   - Multi-line text area
   - Minimum 10 characters

2. **Backend Framework** (required)
   - Node.js (Express)
   - Node.js (NestJS)
   - Python (Django)
   - Python (FastAPI)
   - Python (Flask)
   - Java (Spring Boot)
   - Ruby on Rails
   - .NET Core
   - Go
   - PHP (Laravel)
   - Other

3. **Frontend Framework** (required)
   - React
   - Vue.js
   - Angular
   - Next.js
   - Svelte
   - Vanilla JavaScript
   - Other

4. **Database Preferred** (required)
   - PostgreSQL
   - MySQL
   - MongoDB
   - SQLite
   - Redis
   - Microsoft SQL Server
   - Oracle
   - Cassandra
   - DynamoDB
   - Other

5. **Messaging Queue Framework** (required)
   - RabbitMQ
   - Apache Kafka
   - Redis (Pub/Sub)
   - AWS SQS
   - Google Cloud Pub/Sub
   - Azure Service Bus
   - Apache ActiveMQ
   - NATS
   - None
   - Other

## Usage

1. Fill in all required fields (marked with *)
2. Click the "Submit" button to validate and submit the form
3. View the submitted information in the summary section below the form
4. Use the "Reset" button to clear the form and start over

## Future Enhancements

This is the first stage of the application. Future enhancements may include:

- Backend API integration for storing form data
- Generation of descriptive prompts for project managers/technical architects
- Export functionality for submitted data
- User authentication and project management
- Historical project tracking

## Technologies Used

- **React 18**: UI library
- **Vite**: Build tool and dev server (requires Node.js 20.19+ or 22.12+)
- **CSS3**: Styling with modern CSS features
- **JavaScript (ES6+)**: Application logic
- **.NET Aspire 9.2**: Orchestration and observability framework via NuGet SDK (optional)

## License

This project is licensed under the MIT License.
