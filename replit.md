# MeeChain - AI & GameFi Terminal

## Overview

MeeChain is a Web3 decentralized application (dApp) that combines AI-powered features with GameFi functionality. The platform provides an NFT marketplace, token staking, AI chat assistant, and crypto mining simulation features. It's built on the Oasis Sapphire blockchain (chain ID 23294) with support for smart wallet management and gasless transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful endpoints with Zod validation
- **Build**: esbuild for server bundling, Vite for client

### Blockchain Integration
- **Primary Chain**: Oasis Sapphire Mainnet (chain ID 23294, ROSE token)
- **Wallet Connection**: Wagmi + RainbowKit for traditional wallets
- **Social Login**: Web3Auth for email/social authentication
- **Smart Wallets**: Custom account abstraction interface with local storage persistence
- **Blockchain Client**: Viem for low-level Ethereum operations

### AI Integration
- **Provider**: Google Gemini AI (generative-ai SDK)
- **Use Case**: Chat assistant for ecosystem guidance
- **Client-side**: API key passed via environment variable (VITE_GEMINI_API_KEY)

### Data Storage
- **Primary Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (users and profiles tables)
- **Migrations**: Generated to `./migrations` directory
- **Local State**: Browser localStorage for smart wallet data

### Key Design Patterns
- **Shared Types**: Common schemas and route definitions in `shared/` directory
- **Type-safe Routes**: Zod schemas define API contracts in `shared/routes.ts`
- **Path Aliases**: `@/` for client src, `@shared/` for shared code
- **Component Structure**: Feature components alongside UI primitives

## External Dependencies

### Blockchain Services
- **Oasis Sapphire RPC**: `https://sapphire.oasis.io` (primary blockchain endpoint)
- **Block Explorer**: `https://explorer.oasis.io/mainnet/sapphire`
- **WalletConnect**: Project ID configured for multi-wallet support

### Authentication
- **Web3Auth**: Client ID configured for Sapphire Mainnet social login
- **Supported Methods**: MetaMask, WalletConnect, email/social via Web3Auth

### AI Services
- **Google Gemini**: Requires `VITE_GEMINI_API_KEY` environment variable for chat functionality

### Database
- **PostgreSQL**: Requires `DATABASE_URL` environment variable
- **Connection**: Node-postgres (pg) pool connection

### DNS Management
- **DNSExit API**: Optional DNS update script for custom domain configuration
- **Config File**: `dns-payload.json` for DNS record management

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_GEMINI_API_KEY` - Google Gemini API key (client-side)
- `DNS_API_KEY` - Optional, for DNS updates