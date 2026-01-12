# Tech Stack

Technologies powering Cheesebox.

## Frontend

**Next.js 14**
- App Router with React Server Components
- Server Actions for form handling
- Streaming SSR for fast page loads
- Automatic code splitting

**React 18**
- Hooks-based components
- Context API for global state
- Suspense boundaries
- Error boundaries

**TypeScript**
- End-to-end type safety
- Strict mode enabled
- Shared types between frontend/backend

**Tailwind CSS**
- Utility-first styling
- Custom theme system
- Dark mode support
- Responsive design

## Backend

**Next.js API Routes**
- Serverless edge functions
- Automatic deployment
- Built-in middleware support

**NextAuth.js**
- Authentication provider
- Session management
- OAuth integration
- JWT tokens

**Prisma ORM**
- Type-safe database queries
- Automatic migrations
- Schema generation
- Connection pooling

**AWS SDK v3**
- S3 client for storage
- MediaConvert for transcoding
- Presigned URL generation

## Database

**PostgreSQL**
- Hosted on Vercel
- Automatic backups
- Connection pooling
- Full-text search ready

## Infrastructure

**Vercel**
- Edge network deployment
- Automatic HTTPS
- Preview deployments
- Analytics

**AWS**
- S3: Object storage
- MediaConvert: Video transcoding
- CloudFormation: Infrastructure as Code

**Upstash Redis**
- Serverless Redis
- Rate limiting
- CSRF token storage
- Session caching

## Email

**Resend**
- Transactional emails
- React Email templates
- Delivery tracking
- Webhook support

## Development Tools

**ESLint**
- Code linting
- Consistent style
- Error prevention

**Prettier**
- Code formatting
- Auto-formatting on save

**TypeScript Compiler**
- Type checking
- Build-time errors

**Jest**
- Unit testing
- Integration testing
- Security testing

## Deployment

**Git**
- Version control
- GitHub/GitLab integration

**CI/CD**
- Automatic deployments
- Preview branches
- Rollback support

## Monitoring

**Vercel Analytics**
- Page views
- Performance metrics
- Error tracking

**Vercel Logs**
- Function logs
- Error logs
- Request logs

## Mobile (React Native)

**Expo**
- Cross-platform development
- OTA updates
- Native modules

**React Native**
- iOS and Android apps
- Shared codebase with web

## Why These Choices?

- **Next.js**: Best-in-class React framework, excellent DX
- **Vercel**: Seamless Next.js deployment, global edge network
- **PostgreSQL**: Reliable, feature-rich, great Prisma support
- **AWS**: Industry standard, user data ownership
- **TypeScript**: Prevents bugs, improves DX
- **Tailwind**: Rapid styling, small bundle size
