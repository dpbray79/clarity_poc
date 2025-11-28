# Clarity Coach AI - Pronunciation Assessment POC

An AI-powered pronunciation coaching application built with Next.js, Azure Speech Services, and PostgreSQL.

## Features

- 🎤 **Real-time Pronunciation Assessment**: Record audio and get instant feedback on pronunciation, fluency, and accuracy
- 📊 **Progress Tracking**: Dashboard with statistics from your practice sessions
- 🎯 **Guided Practice**: Coaching module with sample sentences for targeted practice
- 🔊 **Azure Speech Integration**: Powered by Microsoft Azure Cognitive Services
- 💾 **Database Persistence**: PostgreSQL database for storing results and tracking progress

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes, PostgreSQL
- **AI/ML**: Azure Speech Services (Pronunciation Assessment)
- **Deployment**: Azure Static Web Apps

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Azure account with Speech Service resource

## Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/dpbray79/clarity_poc.git
cd clarity_poc
npm install
\`\`\`

### 2. Set Up PostgreSQL Database

\`\`\`bash
# Create database
createdb clarity_poc

# Run schema
psql -d clarity_poc -f sql/schema.sql
\`\`\`

### 3. Configure Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL=postgresql://localhost:5432/clarity_poc

# Azure Speech Service
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_region  # e.g., eastus2

# Auth (optional)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Azure Deployment

### Option 1: Deploy via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Static Web App** resource
3. Connect to your GitHub repository
4. Configure build settings:
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `.next`
5. Add environment variables in Configuration:
   - `AZURE_SPEECH_KEY`
   - `AZURE_SPEECH_REGION`
   - `DATABASE_URL` (use Azure Database for PostgreSQL)

### Option 2: Deploy via Azure CLI

\`\`\`bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Login to Azure
az login

# Deploy
swa deploy --app-location ./ --output-location .next
\`\`\`

## Database Setup for Production

### Azure Database for PostgreSQL

1. Create an Azure Database for PostgreSQL resource
2. Configure firewall rules to allow Azure services
3. Connect and run the schema:

\`\`\`bash
psql -h your-server.postgres.database.azure.com -U your-username -d clarity_poc -f sql/schema.sql
\`\`\`

4. Update \`DATABASE_URL\` in Azure Static Web App configuration

## Project Structure

\`\`\`
clarity_poc/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── speech/analyze/      # Speech analysis API endpoint
│   │   ├── assessment/              # Pronunciation assessment page
│   │   ├── coaching/                # Practice coaching page
│   │   └── dashboard/               # User dashboard
│   ├── components/
│   │   ├── AudioRecorder.tsx        # Audio recording component
│   │   ├── assessment/              # Assessment UI components
│   │   └── coaching/                # Coaching UI components
│   └── lib/
│       ├── azure-speech.ts          # Azure Speech SDK integration
│       └── database.ts              # PostgreSQL connection
├── sql/
│   └── schema.sql                   # Database schema
└── public/                          # Static assets
\`\`\`

## Usage

### 1. Assessment
- Navigate to `/assessment`
- Click the microphone button to record
- Speak clearly and click stop
- View your pronunciation scores

### 2. Coaching
- Navigate to `/coaching`
- Practice with guided sentences
- Get immediate feedback on each attempt

### 3. Dashboard
- Navigate to `/dashboard`
- View your progress statistics
- Track improvement over time

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`DATABASE_URL\` | PostgreSQL connection string | Yes |
| \`AZURE_SPEECH_KEY\` | Azure Speech Service subscription key | Yes |
| \`AZURE_SPEECH_REGION\` | Azure region (e.g., eastus2) | Yes |
| \`NEXTAUTH_SECRET\` | Secret for authentication | No |
| \`NEXTAUTH_URL\` | Application URL | No |

## Security Notes

- Never commit \`.env.local\` to version control
- Use Azure Key Vault for production secrets
- Enable SSL/TLS for database connections in production
- Implement authentication before public deployment

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
