/**
 * Environment variable validation utility
 * Validates required environment variables on application startup
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'ADMIN_EMAIL',
  'JWT_SECRET',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'GITHUB_TOKEN',
  'GITHUB_REPO',
  'GITHUB_BRANCH',
] as const;

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate GitHub repository format (owner/repo)
 */
function isValidGitHubRepo(repo: string): boolean {
  const repoRegex = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  return repoRegex.test(repo);
}

/**
 * Validate JWT secret strength
 */
function isValidJWTSecret(secret: string): boolean {
  return secret.length >= 32;
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if all required variables are present
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];

    if (!value || value.trim() === '') {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // If any required variables are missing, return early
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Validate ADMIN_EMAIL format
  const adminEmail = process.env.ADMIN_EMAIL!;
  if (!isValidEmail(adminEmail)) {
    errors.push('ADMIN_EMAIL must be a valid email address');
  }

  // Validate JWT_SECRET length
  const jwtSecret = process.env.JWT_SECRET!;
  if (!isValidJWTSecret(jwtSecret)) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate GMAIL_USER format
  const gmailUser = process.env.GMAIL_USER!;
  if (!isValidEmail(gmailUser)) {
    errors.push('GMAIL_USER must be a valid email address');
  }

  // Validate GMAIL_APP_PASSWORD length
  const gmailPassword = process.env.GMAIL_APP_PASSWORD!;
  if (gmailPassword.length < 16) {
    warnings.push('GMAIL_APP_PASSWORD should be a 16-character app password from Google');
  }

  // Validate GITHUB_TOKEN format
  const githubToken = process.env.GITHUB_TOKEN!;
  if (!githubToken.startsWith('ghp_') && !githubToken.startsWith('github_pat_')) {
    warnings.push('GITHUB_TOKEN should start with "ghp_" or "github_pat_" for personal access tokens');
  }

  // Validate GITHUB_REPO format
  const githubRepo = process.env.GITHUB_REPO!;
  if (!isValidGitHubRepo(githubRepo)) {
    errors.push('GITHUB_REPO must be in format: owner/repository');
  }

  // Validate GITHUB_BRANCH is not empty
  const githubBranch = process.env.GITHUB_BRANCH!;
  if (githubBranch.trim() === '') {
    errors.push('GITHUB_BRANCH cannot be empty');
  }

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (!nodeEnv) {
    warnings.push('NODE_ENV is not set, defaulting to development mode');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log validation results
 */
export function logValidationResults(result: ValidationResult): void {
  if (result.valid) {
    console.log('[Environment] ✓ All required environment variables are valid');
    
    if (result.warnings.length > 0) {
      console.warn('[Environment] Warnings:');
      result.warnings.forEach(warning => {
        console.warn(`  - ${warning}`);
      });
    }
  } else {
    console.error('[Environment] ✗ Environment validation failed');
    console.error('[Environment] Errors:');
    result.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    
    if (result.warnings.length > 0) {
      console.warn('[Environment] Warnings:');
      result.warnings.forEach(warning => {
        console.warn(`  - ${warning}`);
      });
    }
  }
}

/**
 * Validate environment and throw error if invalid
 * Use this at application startup
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  logValidationResults(result);

  if (!result.valid) {
    throw new Error(
      `Environment validation failed:\n${result.errors.join('\n')}\n\n` +
      'Please check your .env file and ensure all required variables are set correctly.'
    );
  }
}

/**
 * Check if a specific environment variable is set
 */
export function isEnvVarSet(varName: string): boolean {
  const value = process.env[varName];
  return value !== undefined && value.trim() !== '';
}

/**
 * Get environment variable with validation
 */
export function getRequiredEnvVar(varName: string): string {
  const value = process.env[varName];
  
  if (!value || value.trim() === '') {
    throw new Error(`Required environment variable ${varName} is not set`);
  }
  
  return value;
}

/**
 * Get environment variable with default value
 */
export function getEnvVar(varName: string, defaultValue: string): string {
  const value = process.env[varName];
  return value && value.trim() !== '' ? value : defaultValue;
}
