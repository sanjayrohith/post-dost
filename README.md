# PostDost AI

🚀 AI-Powered Social Media Posts for Local Indian Businesses

## Description

PostDost AI is a Next.js application that leverages Google's Genkit AI framework to generate culturally-aware social media posts with images specifically tailored for local Indian businesses. The application provides an intuitive interface for businesses to create engaging content that resonates with their local audience.

## Features

- ✨ **AI-Powered Content Generation**: Uses Google Gemini AI to create culturally relevant posts
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🔄 **Real-time Generation**: Fast content creation with instant previews
- 🎯 **Local Business Focus**: Tailored for Indian market and cultural context

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Google Genkit with Gemini AI
- **Styling**: Tailwind CSS + shadcn/ui
- **Form Management**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanjayrohith/post-dost.git
cd post-dost
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Add your Google AI API key to `.env.local`:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── ai/                 # AI-related functionality
│   ├── genkit.ts      # Genkit configuration
│   └── flows/         # AI workflows
├── app/               # Next.js app router pages
├── components/        # React components
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the [GitHub repository](https://github.com/sanjayrohith/post-dost/issues).