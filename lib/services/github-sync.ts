import { Octokit } from '@octokit/rest';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
}

interface CommitResult {
  success: boolean;
  sha?: string;
  error?: string;
}

interface PendingCommit {
  content: string;
  sections: Set<string>;
  timestamp: Date;
}

class GitHubSyncService {
  private octokit: Octokit;
  private config: GitHubConfig;
  private pendingCommit: PendingCommit | null = null;
  private commitTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (!token || !repo) {
      throw new Error('GitHub configuration missing: GITHUB_TOKEN and GITHUB_REPO are required');
    }

    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      throw new Error('GITHUB_REPO must be in format: owner/repo');
    }

    this.config = {
      token,
      owner,
      repo: repoName,
      branch,
      filePath: 'data/content.json',
    };

    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Verify repository access
   */
  async verifyAccess(): Promise<boolean> {
    try {
      await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return true;
    } catch (error) {
      console.error('GitHub access verification failed:', error);
      return false;
    }
  }

  /**
   * Get current file SHA (required for updates)
   */
  async getFileSHA(path: string = this.config.filePath): Promise<string> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });

      if ('sha' in response.data) {
        return response.data.sha;
      }

      throw new Error('File SHA not found in response');
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error(`File not found: ${path}`);
      }
      throw new Error(`Failed to get file SHA: ${error.message}`);
    }
  }

  /**
   * Commit content changes to GitHub
   * Implements batching: combines updates within 5 minutes into a single commit
   */
  async commitContent(
    content: string,
    changedSection: string
  ): Promise<CommitResult> {
    try {
      // If there's a pending commit, add this update to the batch
      if (this.pendingCommit) {
        this.pendingCommit.content = content;
        this.pendingCommit.sections.add(changedSection);
        
        // Clear existing timer and set a new one
        if (this.commitTimer) {
          clearTimeout(this.commitTimer);
        }
        
        // Schedule commit for end of batch window
        return new Promise((resolve) => {
          this.commitTimer = setTimeout(async () => {
            const result = await this.executePendingCommit();
            resolve(result);
          }, this.BATCH_WINDOW_MS);
        });
      }

      // No pending commit, create a new batch
      this.pendingCommit = {
        content,
        sections: new Set([changedSection]),
        timestamp: new Date(),
      };

      // Schedule commit for end of batch window
      return new Promise((resolve) => {
        this.commitTimer = setTimeout(async () => {
          const result = await this.executePendingCommit();
          resolve(result);
        }, this.BATCH_WINDOW_MS);
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to commit content',
      };
    }
  }

  /**
   * Execute the pending commit immediately (used internally)
   */
  private async executePendingCommit(): Promise<CommitResult> {
    if (!this.pendingCommit) {
      return {
        success: false,
        error: 'No pending commit to execute',
      };
    }

    const { content, sections } = this.pendingCommit;
    const message = this.formatCommitMessage(Array.from(sections));

    // Clear pending commit and timer
    this.pendingCommit = null;
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }

    try {
      // Get current file SHA
      const sha = await this.getFileSHA();

      // Update file via GitHub API
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: this.config.filePath,
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: this.config.branch,
      });

      return {
        success: true,
        sha: response.data.commit.sha,
      };
    } catch (error: any) {
      console.error('GitHub commit failed:', error);
      return {
        success: false,
        error: this.formatGitHubError(error),
      };
    }
  }

  /**
   * Commit content immediately without batching
   * Used when immediate sync is required
   */
  async commitContentImmediate(
    content: string,
    changedSection: string
  ): Promise<CommitResult> {
    const message = this.formatCommitMessage([changedSection]);

    try {
      // Get current file SHA
      const sha = await this.getFileSHA();

      // Update file via GitHub API
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: this.config.filePath,
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: this.config.branch,
      });

      return {
        success: true,
        sha: response.data.commit.sha,
      };
    } catch (error: any) {
      console.error('GitHub commit failed:', error);
      return {
        success: false,
        error: this.formatGitHubError(error),
      };
    }
  }

  /**
   * Format commit message with timestamp and changed sections
   */
  private formatCommitMessage(sections: string[]): string {
    const timestamp = new Date().toISOString();
    const sectionList = sections.join(', ');
    return `chore: update content - [${sectionList}] - ${timestamp}`;
  }

  /**
   * Format GitHub API errors for user-friendly messages
   */
  private formatGitHubError(error: any): string {
    if (error.status === 401) {
      return 'GitHub authentication failed. Please check your GITHUB_TOKEN.';
    }
    if (error.status === 403) {
      return 'GitHub access forbidden. Please check token permissions.';
    }
    if (error.status === 404) {
      return 'GitHub repository or file not found.';
    }
    if (error.status === 409) {
      return 'GitHub conflict detected. The file may have been modified.';
    }
    return error.message || 'GitHub API error occurred';
  }

  /**
   * Flush any pending commits immediately
   * Useful for graceful shutdown or testing
   */
  async flushPendingCommits(): Promise<CommitResult | null> {
    if (!this.pendingCommit) {
      return null;
    }

    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }

    return await this.executePendingCommit();
  }
}

// Export singleton instance
export const githubSync = new GitHubSyncService();

// Export types
export type { CommitResult, GitHubConfig };

// github-sync: remote persist
