# Claim Tracker Frontend

Frontend web application for the Novel Claim Tracker MVP - a React-based interface for managing UK R&D tax relief claims and projects.

## 📋 Overview

This is a modern React single-page application (SPA) that provides an intuitive interface for:
- Creating and managing R&D tax relief claims
- Managing R&D projects and linking them to claims
- Viewing claim status and history
- Role-based access control (submitter vs. reviewer workflows)
- Real-time updates with optimistic UI patterns

**Key Features:**
- 📝 Create claims with multi-select project assignment
- 📊 View and filter claims by status
- 🔗 Link/unlink projects to/from claims
- ✏️ Update claim status with role-based permissions
- 🎭 User role simulation (submitter/reviewer)
- ⚡ Fast, responsive UI with loading states
- ✅ Comprehensive form validation
- 🎨 Modern, clean design with Tailwind CSS v4

## 🛠️ Technology Stack

- **Framework**: React 19.0.0
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS v4 (CSS-based configuration)
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Validation**: Zod
- **Notifications**: React Hot Toast
- **Testing**: Vitest + React Testing Library
- **Code Quality**: Biome (linting/formatting), Husky (git hooks)

## 📁 Project Structure

```
frontend/
├── public/                       # Static assets
├── src/
│   ├── components/               # React components
│   │   ├── claims/              # Claim-related components
│   │   │   ├── ClaimCard.tsx
│   │   │   ├── ClaimForm.tsx
│   │   │   ├── ClaimList.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── projects/            # Project-related components
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   └── ProjectSelector.tsx
│   │   ├── layout/              # Layout components
│   │   │   └── Header.tsx
│   │   └── common/              # Reusable components
│   │       └── LoadingSpinner.tsx
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Auth context hook
│   │   ├── useClaims.ts         # Claims data hook
│   │   └── useProjects.ts       # Projects data hook
│   ├── pages/                   # Page components
│   │   ├── ClaimsPage.tsx
│   │   └── ProjectsPage.tsx
│   ├── services/                # API services
│   │   └── api.ts               # Axios API client
│   ├── types/                   # TypeScript types
│   │   ├── api.ts               # API response types
│   │   ├── auth.ts              # Auth types
│   │   └── index.ts             # Shared types
│   ├── utils/                   # Utility functions
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── formatting.ts        # Currency/date formatting
│   │   └── validation.ts        # Zod schemas
│   ├── constants/               # Application constants
│   │   └── auth.ts              # Mock users
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
└── test/                        # Test files (co-located with source)
```

## 🚀 Local Development

### Prerequisites

- Node.js v24
- Backend API running (mock server or AWS deployment)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001

# For production deployment
# VITE_API_URL=https://<api-id>.execute-api.eu-west-2.amazonaws.com/prod
```

### Running Development Server

```bash
# Start Vite dev server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

Build output will be in the `dist/` directory.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Test Structure

Tests are co-located with source files in `__tests__` directories:

- `components/**/__tests__/` - Component tests
- `hooks/__tests__/` - Hook tests
- `services/__tests__/` - API service tests
- `utils/__tests__/` - Utility function tests
- `contexts/__tests__/` - Context tests

## 🎨 Code Quality

### Formatting and Linting

```bash
# Check code formatting
npm run format:check

# Auto-fix formatting issues
npm run format:fix

# Check for linting issues
npm run lint:check

# Auto-fix linting issues
npm run lint:fix

# Run TypeScript type checking
npm run type-check

# Run security audit
npm run audit
```

### Pre-commit Hooks

Husky is configured to run linting and type checking before commits. Ensure all checks pass before committing.

## 📱 Features

### Claims Management

**Create Claim:**
- Enter company name
- Set claim period (start/end dates)
- Specify amount in pence (automatically formatted as £)
- Select multiple projects to link
- Form validation with user-friendly error messages

**View Claims:**
- List view with status badges
- Filter by status (All, Draft, Submitted, Approved)
- Auto-refresh on data changes
- Loading states during API calls

**Update Claim Status:**
- Submitters can submit Draft claims
- Reviewers can approve Submitted claims
- Status updates with toast notifications
- Optimistic UI updates

**Link/Unlink Projects:**
- Multi-select dropdown for linking projects
- Visual list of linked projects
- One-click unlinking
- Real-time updates

### Projects Management

**Create Project:**
- Enter project name
- Add detailed description
- Form validation
- Immediate feedback on success/error

**View Projects:**
- List view with project cards
- Shows linked claims for each project
- Edit existing projects
- Delete projects (with confirmation)

### Authentication

**User Simulation:**
- Switch between users via header dropdown
- Two predefined users:
  - Alice (Submitter) - Can submit Draft claims
  - Bob (Reviewer) - Can approve Submitted claims
- User preference persisted in localStorage
- Role-based UI element visibility

## 🏗️ Architecture

### State Management

- **Local State**: React useState for component-local state
- **Context**: AuthContext for global user state
- **Data Fetching**: Custom hooks (useClaims, useProjects) wrapping Axios calls
- **Forms**: Controlled components with Zod validation

### API Integration

All API calls go through `src/services/api.ts`:

```typescript
// Example: Using the claims API
import { claimsApi } from '../services/api';

const claims = await claimsApi.list();
const claim = await claimsApi.create({
  companyName: "Acme Corp",
  claimPeriod: { startDate: "2024-01-01", endDate: "2024-12-31" },
  amount: 50000,
  projectIds: ["project-1"]
});
```

**Features:**
- Axios interceptors for authentication headers
- Centralized error handling
- Request/response type safety
- Automatic JSON parsing

### Custom Hooks

**useClaims:**
```typescript
const { claims, loading, error, fetchClaims, updateClaimStatus } = useClaims();
```

**useProjects:**
```typescript
const { projects, loading, error, fetchProjects } = useProjects();
```

**useAuth:**
```typescript
const { currentUser, isSubmitter, isReviewer, setCurrentUser } = useAuth();
```

### Validation

All forms use Zod schemas from `src/utils/validation.ts`:

```typescript
import { CreateClaimFormSchema } from '../utils/validation';

const result = CreateClaimFormSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  console.error(result.error.issues);
}
```

### Error Handling

Errors are handled consistently across the app:

```typescript
import { handleApiError } from '../utils/errorHandler';

try {
  await claimsApi.create(data);
  toast.success("Claim created!");
} catch (error) {
  const message = handleApiError(error);
  toast.error(message);
}
```

## 🎨 Styling

### Tailwind CSS v4

This project uses the latest Tailwind CSS v4 with CSS-based configuration:

```css
/* src/index.css */
@import "tailwindcss";
```

### Design System

**Colors:**
- Primary: Blue (`blue-600`, `blue-700`)
- Success: Green (`green-600`)
- Warning: Yellow (`yellow-600`)
- Danger: Red (`red-600`)
- Neutral: Gray (`gray-100` to `gray-900`)

**Status Badges:**
- Draft: Gray
- Submitted: Blue
- Approved: Green

## 🔐 Authentication & Authorization

Currently implemented as UI-only simulation:

**Mock Users:**
```typescript
{
  "user-1": { userId: "user-1", name: "Alice", role: "submitter" },
  "user-2": { userId: "user-2", name: "Bob", role: "reviewer" }
}
```

**Role-Based Access:**
- Submitters see "Submit" button on Draft claims
- Reviewers see "Approve" button on Submitted claims
- API receives `X-User-Id` header for filtering

**Future Enhancements:**
- AWS Cognito integration
- JWT token validation
- Protected routes
- Role-based API enforcement

## 🚀 Deployment

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set the following in your deployment platform:

```
VITE_API_URL=https://<your-api-id>.execute-api.eu-west-2.amazonaws.com/prod
```

## 🗺️ Potential Future Enhancements

### 1. Full Authentication
- AWS Cognito integration
- Login/logout flows
- JWT token management
- Protected routes with React Router

### 2. Enhanced Features
- Claim comments/notes
- File uploads for supporting documents
- Advanced filtering and search
- Pagination for large datasets
- Sorting by multiple fields

### 3. Improved UX
- Keyboard shortcuts
- Bulk operations
- Export to CSV/PDF
- Print-friendly views
- Offline support (PWA)

### 4. Performance
- Code splitting with React.lazy
- React Query for advanced caching
- Virtual scrolling for large lists
- Image optimization
- Bundle size optimization

### 5. Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

### 6. DevOps
- CI/CD with GitHub Actions
- Automated visual regression testing
- Lighthouse CI for performance monitoring
- Sentry for error tracking
