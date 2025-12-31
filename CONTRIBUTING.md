# Contributing to Cheesebox

Thank you for your interest in contributing to Cheesebox! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/onamfc/private-video-sharing.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes locally
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up your .env file with your credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Code Style

- We use TypeScript for type safety
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Screenshots**: Include screenshots for UI changes
- **Breaking Changes**: Clearly mark any breaking changes

## Commit Message Format

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:

```
feat: add video upload progress bar
fix: resolve CORS errors on video playback
docs: update AWS setup instructions
```

## What We're Looking For

### High Priority

- Bug fixes
- Security improvements
- Performance optimizations
- Documentation improvements
- Test coverage

### Features We'd Love

- Video upload progress indicator
- Batch video operations
- Video thumbnail generation
- Search and filtering
- Admin dashboard
- Video analytics
- Mobile responsive improvements
- Dark mode
- Internationalization (i18n)

### Before Adding Features

- Open an issue first to discuss the feature
- Wait for maintainer feedback
- Ensure it aligns with project goals

## Testing

Currently, we don't have automated tests, but please manually test:

1. Video upload flow
2. Video transcoding status updates
3. Video playback
4. Video sharing
5. Video deletion
6. AWS credentials management

## Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node version)

## Security Issues

Please report security vulnerabilities to the maintainers privately. Do not open public issues for security concerns.

## Questions?

Feel free to open a discussion or issue if you have questions!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
