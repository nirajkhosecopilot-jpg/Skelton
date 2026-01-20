package models

import "time"

// CompleteProjectData represents all information collected from the user across all pages
type CompleteProjectData struct {
	// Page 1 - Project Description Form
	ProjectDescription string `json:"projectDescription"`
	BackendFramework   string `json:"backendFramework"`
	FrontendFramework  string `json:"frontendFramework"`
	DatabasePreference string `json:"databasePreference"`
	MessagingQueue     string `json:"messagingQueue"`
	Mode               string `json:"mode"` // "online" or "offline"

	// Page 2 - Required Information
	AdditionalInfo string `json:"additionalInfo"`

	// Page 3 - Architecture
	ArchitecturePattern string `json:"architecturePattern"`
	DeploymentStrategy  string `json:"deploymentStrategy"`
	Infrastructure      string `json:"infrastructure"`
	ScalingApproach     string `json:"scalingApproach"`
	ArchitecturalNotes  string `json:"architecturalNotes"`
}

// AIGeneratedContent represents the response from AI LLM
type AIGeneratedContent struct {
	Status                 string                 `json:"status"`
	Message                string                 `json:"message"`
	FolderStructure        FolderStructure        `json:"folderStructure"`
	TechnicalSpecification TechnicalSpecification `json:"technicalSpecification"`
	Timestamp              time.Time              `json:"timestamp"`
}

// FolderStructure represents the project folder structure
type FolderStructure struct {
	RootFolder string         `json:"rootFolder"`
	Tree       []FolderNode   `json:"tree"`
	Metadata   map[string]any `json:"metadata"`
}

// FolderNode represents a node in the folder tree
type FolderNode struct {
	Name        string       `json:"name"`
	Type        string       `json:"type"` // "folder" or "file"
	Description string       `json:"description"`
	Children    []FolderNode `json:"children,omitempty"`
	Path        string       `json:"path"`
}

// TechnicalSpecification represents the complete technical specification document
type TechnicalSpecification struct {
	ProjectOverview     ProjectOverview       `json:"projectOverview"`
	SystemArchitecture  SystemArchitecture    `json:"systemArchitecture"`
	TechnologyStack     TechnologyStackDetail `json:"technologyStack"`
	DataManagement      DataManagement        `json:"dataManagement"`
	SecurityStrategy    SecurityStrategy      `json:"securityStrategy"`
	DeploymentPlan      DeploymentPlan        `json:"deploymentPlan"`
	DevelopmentGuidelines DevelopmentGuidelines `json:"developmentGuidelines"`
	TestingStrategy     TestingStrategy       `json:"testingStrategy"`
	MonitoringAndLogging MonitoringAndLogging  `json:"monitoringAndLogging"`
}

// ProjectOverview contains high-level project information
type ProjectOverview struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Goals       []string `json:"goals"`
	Scope       []string `json:"scope"`
	Stakeholders []string `json:"stakeholders"`
}

// SystemArchitecture describes the system architecture
type SystemArchitecture struct {
	Pattern      string                  `json:"pattern"`
	Description  string                  `json:"description"`
	Components   []ArchitectureComponent `json:"components"`
	DataFlow     string                  `json:"dataFlow"`
	Integrations []string                `json:"integrations"`
}

// ArchitectureComponent represents a component in the architecture
type ArchitectureComponent struct {
	Name         string   `json:"name"`
	Type         string   `json:"type"`
	Description  string   `json:"description"`
	Dependencies []string `json:"dependencies"`
}

// TechnologyStackDetail provides detailed technology stack information
type TechnologyStackDetail struct {
	Backend    TechDetail `json:"backend"`
	Frontend   TechDetail `json:"frontend"`
	Database   TechDetail `json:"database"`
	Messaging  TechDetail `json:"messaging"`
	DevOps     TechDetail `json:"devOps"`
	Additional []TechDetail `json:"additional"`
}

// TechDetail describes a technology choice
type TechDetail struct {
	Name          string   `json:"name"`
	Version       string   `json:"version"`
	Purpose       string   `json:"purpose"`
	Justification string   `json:"justification"`
	Alternatives  []string `json:"alternatives"`
}

// DataManagement describes data management strategy
type DataManagement struct {
	DatabaseType   string            `json:"databaseType"`
	SchemaDesign   string            `json:"schemaDesign"`
	Migrations     string            `json:"migrations"`
	Backup         string            `json:"backup"`
	DataRetention  string            `json:"dataRetention"`
	Entities       []DataEntity      `json:"entities"`
}

// DataEntity represents a data entity
type DataEntity struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Fields      []string `json:"fields"`
	Relationships []string `json:"relationships"`
}

// SecurityStrategy describes security approach
type SecurityStrategy struct {
	Authentication  string   `json:"authentication"`
	Authorization   string   `json:"authorization"`
	DataEncryption  string   `json:"dataEncryption"`
	APIProtection   string   `json:"apiProtection"`
	Vulnerabilities []string `json:"vulnerabilities"`
	Compliance      []string `json:"compliance"`
}

// DeploymentPlan describes deployment strategy
type DeploymentPlan struct {
	Strategy     string              `json:"strategy"`
	Infrastructure string            `json:"infrastructure"`
	Environments []Environment       `json:"environments"`
	CI_CD        string              `json:"ciCd"`
	Rollback     string              `json:"rollback"`
}

// Environment represents a deployment environment
type Environment struct {
	Name        string `json:"name"`
	Purpose     string `json:"purpose"`
	URL         string `json:"url,omitempty"`
	Configuration string `json:"configuration"`
}

// DevelopmentGuidelines provides development best practices
type DevelopmentGuidelines struct {
	CodingStandards    []string `json:"codingStandards"`
	VersionControl     string   `json:"versionControl"`
	BranchingStrategy  string   `json:"branchingStrategy"`
	CodeReview         string   `json:"codeReview"`
	Documentation      string   `json:"documentation"`
}

// TestingStrategy describes testing approach
type TestingStrategy struct {
	UnitTesting        string `json:"unitTesting"`
	IntegrationTesting string `json:"integrationTesting"`
	E2ETesting         string `json:"e2eTesting"`
	LoadTesting        string `json:"loadTesting"`
	SecurityTesting    string `json:"securityTesting"`
	TestCoverage       string `json:"testCoverage"`
}

// MonitoringAndLogging describes monitoring strategy
type MonitoringAndLogging struct {
	LoggingFramework  string   `json:"loggingFramework"`
	MonitoringTools   []string `json:"monitoringTools"`
	Metrics           []string `json:"metrics"`
	Alerting          string   `json:"alerting"`
	PerformanceKPIs   []string `json:"performanceKPIs"`
}

// DocumentResponse represents a downloadable document
type DocumentResponse struct {
	Format    string    `json:"format"` // "pdf", "docx", "jpg"
	Content   []byte    `json:"-"`
	FileName  string    `json:"fileName"`
	MimeType  string    `json:"mimeType"`
	Size      int64     `json:"size"`
	Timestamp time.Time `json:"timestamp"`
}
