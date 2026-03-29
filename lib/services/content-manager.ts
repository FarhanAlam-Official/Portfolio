import { promises as fs } from 'fs'
import path from 'path'
import { PortfolioContentSchema, type PortfolioContent } from '@/lib/schemas/content-schema'
import { ZodError } from 'zod'

export type ContentSection =
  | 'personalInfo'
  | 'experience'
  | 'education'
  | 'skills'
  | 'testimonials'
  | 'certifications'
  | 'awards'
  | 'projects'
  | 'blog'
  | 'stats'
  | 'theme'

export interface UpdateResult {
  success: boolean
  commitSha?: string
  error?: string
  validationErrors?: Array<{
    field: string
    message: string
  }>
}

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')
const BACKUP_FILE_PATH = path.join(process.cwd(), 'data', 'content.backup.json')
const TEMP_FILE_PATH = path.join(process.cwd(), 'data', 'content.temp.json')

/**
 * Content Manager Service
 * Handles file-based content operations with validation, backup, and atomic writes
 */
export class ContentManager {
  /**
   * Read content from file
   * @returns Portfolio content object
   */
  async getContent(): Promise<PortfolioContent> {
    try {
      const fileContent = await fs.readFile(CONTENT_FILE_PATH, 'utf-8')
      const parsedContent = JSON.parse(fileContent)
      
      // Validate content against schema
      const validatedContent = PortfolioContentSchema.parse(parsedContent)
      
      return validatedContent
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('Content file not found. Please run migration script first.')
      }
      
      if (error instanceof ZodError) {
        throw new Error(`Content validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
      }
      
      throw new Error(`Failed to read content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Update entire content with validation and pretty-printing
   * @param content - Complete portfolio content object
   * @returns Update result with success status
   */
  async updateContent(content: PortfolioContent): Promise<UpdateResult> {
    try {
      // Validate content against schema
      const validatedContent = PortfolioContentSchema.parse(content)
      
      // Create backup before updating
      await this.createBackup()
      
      // Write to temp file first (atomic write)
      const prettyContent = JSON.stringify(validatedContent, null, 2)
      await fs.writeFile(TEMP_FILE_PATH, prettyContent, 'utf-8')
      
      // Rename temp file to actual file (atomic operation)
      await fs.rename(TEMP_FILE_PATH, CONTENT_FILE_PATH)
      
      return {
        success: true,
      }
    } catch (error) {
      // Attempt to restore from backup on failure
      try {
        await this.restoreBackup()
      } catch (restoreError) {
        console.error('Failed to restore backup:', restoreError)
      }
      
      if (error instanceof ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Partial update with field preservation
   * @param section - Content section to update
   * @param data - Partial data to merge
   * @returns Update result with success status
   */
  async patchContent(section: ContentSection, data: Partial<any>): Promise<UpdateResult> {
    try {
      // Read current content
      const currentContent = await this.getContent()
      
      // Merge partial update with existing content
      // For array sections (education, experience, etc.), replace entirely instead of spreading
      const currentSection = currentContent[section] as any
      const mergedSection = Array.isArray(currentSection) || Array.isArray(data)
        ? data
        : { ...currentSection, ...data }

      const updatedContent = {
        ...currentContent,
        [section]: mergedSection,
      }
      
      // Validate merged content
      const validatedContent = PortfolioContentSchema.parse(updatedContent)
      
      // Create backup before updating
      await this.createBackup()
      
      // Write to temp file first (atomic write)
      const prettyContent = JSON.stringify(validatedContent, null, 2)
      await fs.writeFile(TEMP_FILE_PATH, prettyContent, 'utf-8')
      
      // Rename temp file to actual file (atomic operation)
      await fs.rename(TEMP_FILE_PATH, CONTENT_FILE_PATH)
      
      return {
        success: true,
      }
    } catch (error) {
      // Attempt to restore from backup on failure
      try {
        await this.restoreBackup()
      } catch (restoreError) {
        console.error('Failed to restore backup:', restoreError)
      }
      
      if (error instanceof ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          validationErrors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Create backup of current content
   */
  async createBackup(): Promise<void> {
    try {
      // Check if content file exists
      await fs.access(CONTENT_FILE_PATH)
      
      // Copy content file to backup location
      await fs.copyFile(CONTENT_FILE_PATH, BACKUP_FILE_PATH)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Content file doesn't exist yet, no backup needed
        return
      }
      
      throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Restore content from backup
   */
  async restoreBackup(): Promise<void> {
    try {
      // Check if backup exists
      await fs.access(BACKUP_FILE_PATH)
      
      // Copy backup file to content location
      await fs.copyFile(BACKUP_FILE_PATH, CONTENT_FILE_PATH)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('Backup file not found')
      }
      
      throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get specific section of content
   * @param section - Content section to retrieve
   * @returns Section data
   */
  async getSection(section: ContentSection): Promise<any> {
    const content = await this.getContent()
    return content[section]
  }
}

// Export singleton instance
export const contentManager = new ContentManager()

// content-manager: deep patch

// refactor: array patch logic
