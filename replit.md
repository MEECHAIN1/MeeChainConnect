# MeeChain Web3 Application

## Overview

MeeChain is a Web3 decentralized application (dApp) built for blockchain interaction. It provides a platform for users to connect wallets, manage profiles, browse an NFT marketplace, and stake tokens. The application features an AI-powered assistant using Google's Gemini API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, Wagmi for blockchain state
- **Styling**: Tailwind CSS with custom theming (dark mode default), shadcn/ui component library
- **Animations**: Framer Motion for UI animations
- **Blockchain**: Wagmi + Viem for Ethereum wallet connection and interaction

The frontend follows a page-based structure under `client/src/pages/` with reusable components in `client/src/components/`. Custom hooks in `client/src/hooks/` handle blockchain interactions, AI chat, and profile management.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL

The server uses a simple storage abstraction layer (`server/storage.ts`) for database operations. Routes are registered in `server/routes.ts` and share type definitions with the frontend through the `shared/` directory.

### Data Storage
- **Database**: PostgreSQL using Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines tables using Drizzle's PostgreSQL adapter
- **Current Tables**: `users` (id, username, password) and `profiles` (id, walletAddress, bio, avatarUrl, bannerUrl)
- **Migrations**: Managed via Drizzle Kit with output to `./migrations`

### Custom Blockchain Configuration
The app defines a custom blockchain called "MeeChain" in `client/src/lib/wagmi.ts`:
- Chain ID: 1337
- Native token: MEE (18 decimals)
- RPC and explorer URLs configurable via environment variables

## External Dependencies

### AI Integration
- **Google Gemini API**: Used for the AI assistant chatbot feature
- API key required via `VITE_GEMINI_API_KEY` environment variable
- Implementation in `client/src/hooks/use-gemini.ts`

### Database
- **PostgreSQL**: Required database backend
- Connection via `DATABASE_URL` environment variable
- Uses `connect-pg-simple` for session storage capability

### Blockchain
- **Custom RPC endpoint**: Configurable via `VITE_RPC_URL`
- **Block explorer**: Configurable via `VITE_EXPLORER_URL`

### Key NPM Packages
- `wagmi` + `viem`: Ethereum blockchain interaction
- `@tanstack/react-query`: Async state management
- `drizzle-orm` + `drizzle-zod`: Database ORM with validation
- `framer-motion`: Animations
- `@google/generative-ai`: Gemini AI integration
- Full shadcn/ui component suite via Radix UI primitives