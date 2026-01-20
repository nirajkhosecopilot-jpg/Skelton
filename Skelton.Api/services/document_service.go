package services

import (
	"bytes"
	"fmt"
	"strings"
	"time"

	"github.com/jung-kurt/gofpdf"
	"skelton-api/models"
)

// DocumentService handles document generation
type DocumentService struct{}

// NewDocumentService creates a new document service instance
func NewDocumentService() *DocumentService {
	return &DocumentService{}
}

// GeneratePDF generates a PDF document from AI-generated content
func (s *DocumentService) GeneratePDF(content *models.AIGeneratedContent, projectData models.CompleteProjectData) ([]byte, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetAutoPageBreak(true, 15)

	// Add first page
	pdf.AddPage()

	// Title
	pdf.SetFont("Arial", "B", 24)
	pdf.Cell(0, 20, "Technical Specification Document")
	pdf.Ln(25)

	// Project Overview Section
	s.addPDFSection(pdf, "Project Overview", content.TechnicalSpecification.ProjectOverview.Title)
	pdf.SetFont("Arial", "", 12)
	pdf.MultiCell(0, 6, content.TechnicalSpecification.ProjectOverview.Description, "", "", false)
	pdf.Ln(5)

	// Goals
	s.addPDFSubSection(pdf, "Goals:")
	for _, goal := range content.TechnicalSpecification.ProjectOverview.Goals {
		pdf.SetFont("Arial", "", 11)
		pdf.MultiCell(0, 5, "  - "+goal, "", "", false)
	}
	pdf.Ln(5)

	// Scope
	s.addPDFSubSection(pdf, "Scope:")
	for _, scope := range content.TechnicalSpecification.ProjectOverview.Scope {
		pdf.SetFont("Arial", "", 11)
		pdf.MultiCell(0, 5, "  - "+scope, "", "", false)
	}
	pdf.Ln(8)

	// System Architecture Section
	pdf.AddPage()
	s.addPDFSection(pdf, "System Architecture", "")
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 7, "Pattern: "+content.TechnicalSpecification.SystemArchitecture.Pattern)
	pdf.Ln(8)
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5, content.TechnicalSpecification.SystemArchitecture.Description, "", "", false)
	pdf.Ln(5)

	// Components
	s.addPDFSubSection(pdf, "Components:")
	for _, comp := range content.TechnicalSpecification.SystemArchitecture.Components {
		pdf.SetFont("Arial", "B", 11)
		pdf.Cell(0, 6, "  "+comp.Name+" ("+comp.Type+")")
		pdf.Ln(6)
		pdf.SetFont("Arial", "", 10)
		pdf.MultiCell(0, 5, "    "+comp.Description, "", "", false)
		pdf.Ln(3)
	}
	pdf.Ln(5)

	// Technology Stack Section
	pdf.AddPage()
	s.addPDFSection(pdf, "Technology Stack", "")

	// Backend
	s.addTechDetailToPDF(pdf, "Backend", content.TechnicalSpecification.TechnologyStack.Backend)
	// Frontend
	s.addTechDetailToPDF(pdf, "Frontend", content.TechnicalSpecification.TechnologyStack.Frontend)
	// Database
	s.addTechDetailToPDF(pdf, "Database", content.TechnicalSpecification.TechnologyStack.Database)
	// Messaging
	s.addTechDetailToPDF(pdf, "Messaging", content.TechnicalSpecification.TechnologyStack.Messaging)
	// DevOps
	s.addTechDetailToPDF(pdf, "DevOps", content.TechnicalSpecification.TechnologyStack.DevOps)

	// Data Management Section
	pdf.AddPage()
	s.addPDFSection(pdf, "Data Management", "")
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5, "Database Type: "+content.TechnicalSpecification.DataManagement.DatabaseType, "", "", false)
	pdf.MultiCell(0, 5, "Schema Design: "+content.TechnicalSpecification.DataManagement.SchemaDesign, "", "", false)
	pdf.MultiCell(0, 5, "Migrations: "+content.TechnicalSpecification.DataManagement.Migrations, "", "", false)
	pdf.MultiCell(0, 5, "Backup: "+content.TechnicalSpecification.DataManagement.Backup, "", "", false)
	pdf.Ln(5)

	// Security Strategy Section
	pdf.AddPage()
	s.addPDFSection(pdf, "Security Strategy", "")
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5, "Authentication: "+content.TechnicalSpecification.SecurityStrategy.Authentication, "", "", false)
	pdf.MultiCell(0, 5, "Authorization: "+content.TechnicalSpecification.SecurityStrategy.Authorization, "", "", false)
	pdf.MultiCell(0, 5, "Data Encryption: "+content.TechnicalSpecification.SecurityStrategy.DataEncryption, "", "", false)
	pdf.MultiCell(0, 5, "API Protection: "+content.TechnicalSpecification.SecurityStrategy.APIProtection, "", "", false)
	pdf.Ln(5)

	// Deployment Plan Section
	pdf.AddPage()
	s.addPDFSection(pdf, "Deployment Plan", "")
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5, "Strategy: "+content.TechnicalSpecification.DeploymentPlan.Strategy, "", "", false)
	pdf.MultiCell(0, 5, "Infrastructure: "+content.TechnicalSpecification.DeploymentPlan.Infrastructure, "", "", false)
	pdf.MultiCell(0, 5, "CI/CD: "+content.TechnicalSpecification.DeploymentPlan.CI_CD, "", "", false)
	pdf.Ln(5)

	// Testing Strategy Section
	s.addPDFSection(pdf, "Testing Strategy", "")
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(0, 5, "Unit Testing: "+content.TechnicalSpecification.TestingStrategy.UnitTesting, "", "", false)
	pdf.MultiCell(0, 5, "Integration Testing: "+content.TechnicalSpecification.TestingStrategy.IntegrationTesting, "", "", false)
	pdf.MultiCell(0, 5, "E2E Testing: "+content.TechnicalSpecification.TestingStrategy.E2ETesting, "", "", false)
	pdf.Ln(5)

	// Folder Structure Section
	pdf.AddPage()
	s.addPDFSection(pdf, "Project Folder Structure", "")
	pdf.SetFont("Courier", "", 9)
	folderTree := s.buildFolderTree(content.FolderStructure.Tree, 0)
	pdf.MultiCell(0, 4, folderTree, "", "", false)

	// Generate PDF bytes
	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, fmt.Errorf("failed to generate PDF: %w", err)
	}

	return buf.Bytes(), nil
}

// addPDFSection adds a section header to the PDF
func (s *DocumentService) addPDFSection(pdf *gofpdf.Fpdf, title, subtitle string) {
	pdf.SetFont("Arial", "B", 16)
	pdf.SetTextColor(31, 73, 125)
	pdf.Cell(0, 10, title)
	pdf.Ln(10)
	if subtitle != "" {
		pdf.SetFont("Arial", "B", 14)
		pdf.SetTextColor(0, 0, 0)
		pdf.Cell(0, 8, subtitle)
		pdf.Ln(8)
	}
	pdf.SetTextColor(0, 0, 0)
}

// addPDFSubSection adds a subsection header to the PDF
func (s *DocumentService) addPDFSubSection(pdf *gofpdf.Fpdf, title string) {
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 7, title)
	pdf.Ln(7)
}

// addTechDetailToPDF adds technology detail to PDF
func (s *DocumentService) addTechDetailToPDF(pdf *gofpdf.Fpdf, category string, tech models.TechDetail) {
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 7, category+": "+tech.Name)
	pdf.Ln(7)
	pdf.SetFont("Arial", "", 10)
	if tech.Version != "" {
		pdf.MultiCell(0, 5, "  Version: "+tech.Version, "", "", false)
	}
	pdf.MultiCell(0, 5, "  Purpose: "+tech.Purpose, "", "", false)
	pdf.MultiCell(0, 5, "  Justification: "+tech.Justification, "", "", false)
	pdf.Ln(5)
}

// buildFolderTree builds a text representation of the folder tree
func (s *DocumentService) buildFolderTree(nodes []models.FolderNode, level int) string {
	var sb strings.Builder
	indent := strings.Repeat("  ", level)

	for _, node := range nodes {
		icon := ""
		if node.Type == "folder" {
			icon = "📁 "
		} else {
			icon = "📄 "
		}
		sb.WriteString(fmt.Sprintf("%s%s%s\n", indent, icon, node.Name))
		if len(node.Children) > 0 {
			sb.WriteString(s.buildFolderTree(node.Children, level+1))
		}
	}

	return sb.String()
}

// GenerateDOCX generates a DOCX document from AI-generated content
func (s *DocumentService) GenerateDOCX(content *models.AIGeneratedContent, projectData models.CompleteProjectData) ([]byte, error) {
	// For DOCX, we'll create a simple XML-based document
	// This is a minimal DOCX implementation
	docxContent := s.buildDOCXContent(content, projectData)

	// In a production environment, you would use a proper DOCX library
	// For now, we'll return the content as a simple text-based document
	return []byte(docxContent), nil
}

// buildDOCXContent builds the DOCX content as XML
func (s *DocumentService) buildDOCXContent(content *models.AIGeneratedContent, projectData models.CompleteProjectData) string {
	var sb strings.Builder

	sb.WriteString("TECHNICAL SPECIFICATION DOCUMENT\n\n")
	sb.WriteString("=" + strings.Repeat("=", 50) + "\n\n")

	// Project Overview
	sb.WriteString("PROJECT OVERVIEW\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Title: " + content.TechnicalSpecification.ProjectOverview.Title + "\n\n")
	sb.WriteString("Description: " + content.TechnicalSpecification.ProjectOverview.Description + "\n\n")

	sb.WriteString("Goals:\n")
	for _, goal := range content.TechnicalSpecification.ProjectOverview.Goals {
		sb.WriteString("  - " + goal + "\n")
	}
	sb.WriteString("\n")

	sb.WriteString("Scope:\n")
	for _, scope := range content.TechnicalSpecification.ProjectOverview.Scope {
		sb.WriteString("  - " + scope + "\n")
	}
	sb.WriteString("\n\n")

	// System Architecture
	sb.WriteString("SYSTEM ARCHITECTURE\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Pattern: " + content.TechnicalSpecification.SystemArchitecture.Pattern + "\n\n")
	sb.WriteString(content.TechnicalSpecification.SystemArchitecture.Description + "\n\n")

	sb.WriteString("Components:\n")
	for _, comp := range content.TechnicalSpecification.SystemArchitecture.Components {
		sb.WriteString(fmt.Sprintf("  %s (%s)\n", comp.Name, comp.Type))
		sb.WriteString("    " + comp.Description + "\n\n")
	}

	// Technology Stack
	sb.WriteString("TECHNOLOGY STACK\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	s.addTechDetailToDOCX(&sb, "Backend", content.TechnicalSpecification.TechnologyStack.Backend)
	s.addTechDetailToDOCX(&sb, "Frontend", content.TechnicalSpecification.TechnologyStack.Frontend)
	s.addTechDetailToDOCX(&sb, "Database", content.TechnicalSpecification.TechnologyStack.Database)
	s.addTechDetailToDOCX(&sb, "Messaging", content.TechnicalSpecification.TechnologyStack.Messaging)
	s.addTechDetailToDOCX(&sb, "DevOps", content.TechnicalSpecification.TechnologyStack.DevOps)

	// Data Management
	sb.WriteString("DATA MANAGEMENT\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Database Type: " + content.TechnicalSpecification.DataManagement.DatabaseType + "\n")
	sb.WriteString("Schema Design: " + content.TechnicalSpecification.DataManagement.SchemaDesign + "\n")
	sb.WriteString("Migrations: " + content.TechnicalSpecification.DataManagement.Migrations + "\n")
	sb.WriteString("Backup: " + content.TechnicalSpecification.DataManagement.Backup + "\n\n")

	// Security Strategy
	sb.WriteString("SECURITY STRATEGY\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Authentication: " + content.TechnicalSpecification.SecurityStrategy.Authentication + "\n")
	sb.WriteString("Authorization: " + content.TechnicalSpecification.SecurityStrategy.Authorization + "\n")
	sb.WriteString("Data Encryption: " + content.TechnicalSpecification.SecurityStrategy.DataEncryption + "\n")
	sb.WriteString("API Protection: " + content.TechnicalSpecification.SecurityStrategy.APIProtection + "\n\n")

	// Deployment Plan
	sb.WriteString("DEPLOYMENT PLAN\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Strategy: " + content.TechnicalSpecification.DeploymentPlan.Strategy + "\n")
	sb.WriteString("Infrastructure: " + content.TechnicalSpecification.DeploymentPlan.Infrastructure + "\n")
	sb.WriteString("CI/CD: " + content.TechnicalSpecification.DeploymentPlan.CI_CD + "\n\n")

	// Testing Strategy
	sb.WriteString("TESTING STRATEGY\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString("Unit Testing: " + content.TechnicalSpecification.TestingStrategy.UnitTesting + "\n")
	sb.WriteString("Integration Testing: " + content.TechnicalSpecification.TestingStrategy.IntegrationTesting + "\n")
	sb.WriteString("E2E Testing: " + content.TechnicalSpecification.TestingStrategy.E2ETesting + "\n\n")

	// Folder Structure
	sb.WriteString("PROJECT FOLDER STRUCTURE\n")
	sb.WriteString("-" + strings.Repeat("-", 50) + "\n\n")
	sb.WriteString(s.buildFolderTree(content.FolderStructure.Tree, 0))

	sb.WriteString("\n\nGenerated on: " + time.Now().Format("2006-01-02 15:04:05"))

	return sb.String()
}

// addTechDetailToDOCX adds technology detail to DOCX content
func (s *DocumentService) addTechDetailToDOCX(sb *strings.Builder, category string, tech models.TechDetail) {
	sb.WriteString(category + ": " + tech.Name + "\n")
	if tech.Version != "" {
		sb.WriteString("  Version: " + tech.Version + "\n")
	}
	sb.WriteString("  Purpose: " + tech.Purpose + "\n")
	sb.WriteString("  Justification: " + tech.Justification + "\n\n")
}
