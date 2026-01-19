package models

import (
	"strings"
	"time"
)

// ProjectDescription represents the incoming project description from the React UI
type ProjectDescription struct {
	Name              string   `json:"name"`
	Description       string   `json:"description"`
	Type              string   `json:"type"`
	TechnologyStack   []string `json:"technologyStack"`
	DatabaseType      string   `json:"databaseType"`
	AuthRequired      bool     `json:"authRequired"`
	DeploymentPlatform string  `json:"deploymentPlatform"`
	Features          []string `json:"features"`
	TeamSize          int      `json:"teamSize"`
	Timeline          string   `json:"timeline"`
}

// MissingInformation represents the response containing missing or additional required information
type MissingInformation struct {
	Status            string              `json:"status"`
	Message           string              `json:"message"`
	MissingFields     []MissingField      `json:"missingFields"`
	Recommendations   []string            `json:"recommendations"`
	EstimatedEffort   string              `json:"estimatedEffort"`
	SuggestedTools    []string            `json:"suggestedTools"`
	SecurityConsiderations []string       `json:"securityConsiderations"`
	Timestamp         time.Time           `json:"timestamp"`
}

// MissingField represents a single missing or incomplete field
type MissingField struct {
	Field       string   `json:"field"`
	Reason      string   `json:"reason"`
	Suggestions []string `json:"suggestions"`
	Required    bool     `json:"required"`
}

// ValidateProjectDescription validates the incoming project description
// and returns a list of missing or incomplete information
func (p *ProjectDescription) Validate() MissingInformation {
	missingInfo := MissingInformation{
		Status:          "success",
		Message:         "Project description validated successfully",
		MissingFields:   []MissingField{},
		Recommendations: []string{},
		SuggestedTools:  []string{},
		SecurityConsiderations: []string{},
		Timestamp:       time.Now(),
	}

	// Validate required fields
	if strings.TrimSpace(p.Name) == "" {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "name",
			Reason:      "Project name is required",
			Suggestions: []string{"Provide a descriptive project name"},
			Required:    true,
		})
	}

	if strings.TrimSpace(p.Description) == "" {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "description",
			Reason:      "Project description is required",
			Suggestions: []string{"Provide a clear description of the project goals and scope"},
			Required:    true,
		})
	}

	if strings.TrimSpace(p.Type) == "" {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "type",
			Reason:      "Project type is required",
			Suggestions: []string{"web", "mobile", "desktop", "api", "microservice"},
			Required:    true,
		})
	}

	if len(p.TechnologyStack) == 0 {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "technologyStack",
			Reason:      "At least one technology must be specified",
			Suggestions: []string{"React", "Node.js", "Go", "Python", ".NET", "Java"},
			Required:    true,
		})
	}

	// Validate conditional fields
	if p.Type == "web" || p.Type == "mobile" || p.Type == "api" {
		if strings.TrimSpace(p.DatabaseType) == "" {
			missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
				Field:       "databaseType",
				Reason:      "Database type is recommended for this project type",
				Suggestions: []string{"PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis"},
				Required:    false,
			})
		}
	}

	if strings.TrimSpace(p.DeploymentPlatform) == "" {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "deploymentPlatform",
			Reason:      "Deployment platform information helps in architecture planning",
			Suggestions: []string{"AWS", "Azure", "GCP", "Docker", "Kubernetes", "On-Premise"},
			Required:    false,
		})
	}

	if len(p.Features) == 0 {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "features",
			Reason:      "Feature list helps in planning and estimation",
			Suggestions: []string{"User authentication", "Data visualization", "File uploads", "Real-time updates"},
			Required:    false,
		})
	}

	if p.TeamSize == 0 {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "teamSize",
			Reason:      "Team size information helps in planning collaboration tools",
			Suggestions: []string{"1-3", "4-10", "10+"},
			Required:    false,
		})
	}

	if strings.TrimSpace(p.Timeline) == "" {
		missingInfo.MissingFields = append(missingInfo.MissingFields, MissingField{
			Field:       "timeline",
			Reason:      "Timeline information helps in project planning",
			Suggestions: []string{"1-3 months", "3-6 months", "6-12 months", "12+ months"},
			Required:    false,
		})
	}

	// Generate recommendations based on provided information
	missingInfo.Recommendations = p.generateRecommendations()

	// Generate suggested tools
	missingInfo.SuggestedTools = p.generateSuggestedTools()

	// Generate security considerations
	missingInfo.SecurityConsiderations = p.generateSecurityConsiderations()

	// Generate estimated effort
	missingInfo.EstimatedEffort = p.estimateEffort()

	// Update status if there are missing required fields
	if len(missingInfo.MissingFields) > 0 {
		hasRequired := false
		for _, field := range missingInfo.MissingFields {
			if field.Required {
				hasRequired = true
				break
			}
		}
		if hasRequired {
			missingInfo.Status = "incomplete"
			missingInfo.Message = "Some required information is missing"
		} else {
			missingInfo.Status = "partial"
			missingInfo.Message = "Project description is valid but some optional information would be helpful"
		}
	}

	return missingInfo
}

func (p *ProjectDescription) generateRecommendations() []string {
	recommendations := []string{}

	// Recommendations based on project type
	switch strings.ToLower(p.Type) {
	case "web":
		recommendations = append(recommendations, "Consider implementing responsive design for mobile compatibility")
		recommendations = append(recommendations, "Plan for SEO optimization if public-facing")
	case "mobile":
		recommendations = append(recommendations, "Consider cross-platform frameworks like React Native or Flutter")
		recommendations = append(recommendations, "Plan for app store deployment requirements")
	case "api", "microservice":
		recommendations = append(recommendations, "Implement API versioning strategy")
		recommendations = append(recommendations, "Consider API documentation tools like Swagger/OpenAPI")
	}

	// Authentication recommendations
	if p.AuthRequired {
		recommendations = append(recommendations, "Implement OAuth2/OpenID Connect for secure authentication")
		recommendations = append(recommendations, "Consider multi-factor authentication for enhanced security")
	}

	// Database recommendations
	if strings.Contains(strings.ToLower(p.DatabaseType), "sql") {
		recommendations = append(recommendations, "Plan for database migrations and version control")
	}

	return recommendations
}

func (p *ProjectDescription) generateSuggestedTools() []string {
	tools := []string{}

	// Version control
	tools = append(tools, "Git for version control")

	// CI/CD
	if p.DeploymentPlatform != "" {
		tools = append(tools, "GitHub Actions or GitLab CI for CI/CD pipelines")
	}

	// Monitoring
	tools = append(tools, "Application monitoring and logging solution")

	// Testing
	tools = append(tools, "Automated testing framework appropriate for your tech stack")

	// Project management
	if p.TeamSize > 1 {
		tools = append(tools, "Project management tool (Jira, Trello, or Linear)")
		tools = append(tools, "Communication platform (Slack or Microsoft Teams)")
	}

	return tools
}

func (p *ProjectDescription) generateSecurityConsiderations() []string {
	considerations := []string{}

	if p.AuthRequired {
		considerations = append(considerations, "Implement secure password hashing (bcrypt, Argon2)")
		considerations = append(considerations, "Use HTTPS for all communication")
		considerations = append(considerations, "Implement rate limiting to prevent brute force attacks")
	}

	if p.DatabaseType != "" {
		considerations = append(considerations, "Protect against SQL injection with parameterized queries")
		considerations = append(considerations, "Implement database access controls and encryption at rest")
	}

	if p.Type == "web" || p.Type == "api" {
		considerations = append(considerations, "Implement CORS policies")
		considerations = append(considerations, "Protect against XSS and CSRF attacks")
		considerations = append(considerations, "Implement input validation and sanitization")
	}

	considerations = append(considerations, "Regular security audits and dependency updates")
	considerations = append(considerations, "Implement proper error handling without exposing sensitive information")

	return considerations
}

func (p *ProjectDescription) estimateEffort() string {
	baseEffort := 0

	// Base effort by project type
	switch strings.ToLower(p.Type) {
	case "api", "microservice":
		baseEffort = 2
	case "web":
		baseEffort = 4
	case "mobile":
		baseEffort = 6
	case "desktop":
		baseEffort = 5
	default:
		baseEffort = 3
	}

	// Add effort for features
	baseEffort += len(p.Features)

	// Add effort for authentication
	if p.AuthRequired {
		baseEffort += 2
	}

	// Add effort for database
	if p.DatabaseType != "" {
		baseEffort += 1
	}

	// Adjust by team size
	if p.TeamSize > 5 {
		baseEffort = int(float64(baseEffort) * 0.8)
	} else if p.TeamSize > 0 && p.TeamSize <= 2 {
		baseEffort = int(float64(baseEffort) * 1.2)
	}

	// Convert to weeks
	weeks := baseEffort * 2

	if weeks <= 4 {
		return "1-4 weeks"
	} else if weeks <= 12 {
		return "1-3 months"
	} else if weeks <= 24 {
		return "3-6 months"
	} else {
		return "6+ months"
	}
}
