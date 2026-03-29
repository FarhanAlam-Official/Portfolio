# Database-Free CMS Admin Panel

A secure, file-based Content Management System for your Next.js portfolio website. No database required!

## Features

- 🔐 **OTP-Based Authentication** - Secure email-based one-time password login
- 📁 **File-Based Storage** - All content stored in JSON format
- 🔄 **GitHub Sync** - Automatic deployment triggers via GitHub commits
- 🎨 **Modern UI** - Clean, intuitive dashboard built with React and Tailwind CSS
- ✅ **Type-Safe** - Full TypeScript support with Zod validation
- 🚀 **Zero Database** - No database setup or maintenance required

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following variables:

#### Admin Authentication
```env
ADMIN_EMAIL=your-admin@example.com
```

#### JWT Secret
Generate a secure random key (minimum 32 characters):
```bash
openssl rand -base64 32
```
Then add it to your `.env`:
```env
JWT_SECRET=your-generated-secret-key-here
```

#### Gmail SMTP Configuration

1. Enable 2-Step Verification on your Google Account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Navigate to: 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Add credentials to `.env`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

**Note:** Use the 16-character app password, NOT your regular Gmail password.

#### GitHub Integration

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic) with `repo` scope
3. Add to `.env`:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=username/repository-name
GITHUB_BRANCH=main
```

### 3. Migrate Content

Run the migration script to convert your existing TypeScript data to JSON:

```bash
npm run migrate
```

This will create `data/content.json` from your `lib/data.ts` and `lib/projects-data.ts` files.

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000/login](http://localhost:3000/login) to access the admin panel.

## Usage

### Logging In

1. Navigate to `/login`
2. Enter your admin email (must match `ADMIN_EMAIL` in `.env`)
3. Check your email for the 6-digit OTP code
4. Enter the OTP to access the dashboard

### Managing Content

#### Personal Information
- Update your name, title, bio, and contact details
- Manage highlights and interests
- Edit social media links

#### Projects
- Add new projects with images, descriptions, and tags
- Edit existing projects
- Delete projects with confirmation
- Toggle featured status
- Reorder projects (drag-and-drop coming soon)

#### Experience, Skills, Testimonials
- Placeholder pages are available
- Full editors coming in future updates
- Currently editable via `data/content.json`

### Content Sync

All content changes are automatically:
1. Validated against the schema
2. Saved to `data/content.json`
3. Committed to GitHub
4. Trigger redeployment on Vercel/Netlify

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use different secrets for development and production
- ✅ Rotate secrets periodically
- ✅ Use platform-specific secret management (e.g., Vercel Environment Variables)

### JWT Secret
- ✅ Minimum 32 characters
- ✅ Randomly generated
- ✅ Never exposed in logs or responses

### Session Management
- ✅ HTTP-only cookies (not accessible via JavaScript)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=Strict (CSRF protection)
- ✅ 7-day expiration with warning at 1 hour remaining

### OTP Security
- ✅ 6-digit numeric code
- ✅ 10-minute expiration
- ✅ Single-use only
- ✅ Rate limiting (3 requests per hour)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically redeploy when content is updated via the CMS.

### Other Platforms

The CMS works with any Next.js-compatible hosting platform:
- Netlify
- AWS Amplify
- Railway
- Render

Just ensure environment variables are configured correctly.

## File Structure

```
project-root/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── dashboard/             # Admin dashboard
│   │   ├── personal-info/     # Personal info editor
│   │   ├── projects/          # Projects management
│   │   ├── experience/        # Experience editor
│   │   ├── skills/            # Skills editor
│   │   └── testimonials/      # Testimonials editor
│   └── api/
│       ├── auth/              # Authentication endpoints
│       └── content/           # Content management endpoints
├── lib/
│   ├── services/              # Backend services
│   │   ├── otp-service.ts     # OTP generation & verification
│   │   ├── session-manager.ts # JWT session management
│   │   ├── content-manager.ts # Content CRUD operations
│   │   └── github-sync.ts     # GitHub API integration
│   ├── schemas/               # Zod validation schemas
│   └── utils/                 # Utility functions
├── data/
│   └── content.json           # Main content store
├── scripts/
│   └── migrate-content.ts     # Migration script
└── middleware.ts              # Route protection
```

## API Routes

### Authentication
- `POST /api/auth/request-otp` - Request OTP code
- `POST /api/auth/verify-otp` - Verify OTP and create session
- `POST /api/auth/logout` - Clear session and logout

### Content Management
- `GET /api/content/get` - Get all content or specific section
- `POST /api/content/update` - Update content section
- `GET /api/content/projects` - List all projects
- `POST /api/content/projects` - Create new project
- `PUT /api/content/projects/[id]` - Update project
- `DELETE /api/content/projects/[id]` - Delete project

## Troubleshooting

### OTP Email Not Received
- Check spam/junk folder
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
- Ensure you're using an app password, not your regular password
- Check Gmail SMTP is not blocked by firewall

### GitHub Sync Failing
- Verify `GITHUB_TOKEN` has `repo` scope
- Check `GITHUB_REPO` format is `owner/repo`
- Ensure repository exists and token has access
- Check GitHub API rate limits

### Session Expired Immediately
- Verify `JWT_SECRET` is at least 32 characters
- Check system time is correct
- Ensure cookies are enabled in browser

### Content Validation Errors
- Run `npm run migrate` to regenerate content.json
- Check console for specific validation errors
- Ensure all required fields are present

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Contributing

This CMS is part of a portfolio template. Feel free to customize it for your needs!

## License

MIT License - feel free to use this in your own projects.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review environment variable configuration
3. Check browser console for errors
4. Verify all dependencies are installed

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

<!-- docs: CMS architecture -->
