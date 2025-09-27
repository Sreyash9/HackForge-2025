# FarmConnect - Farmer Marketplace

A modern Progressive Web App (PWA) that connects farmers with buyers, provides real-time market prices, weather information, and agricultural logistics management.

## Features

- 🌾 **Market Prices**: Real-time pricing from nearby markets
- 👥 **Find Buyers**: Connect with verified buyers
- 🧮 **Cost Calculator**: Transport & logistics planning
- 🤖 **AI Assistant**: Smart farming recommendations
- 🌤️ **Weather**: Current weather and forecasts
- 💬 **Chat**: AI-powered chat assistance
- 🗺️ **Buyers Map**: Interactive map to find nearby buyers
- 📊 **Dashboard**: Comprehensive farming dashboard
- 🚚 **Logistics**: Transportation and logistics management
- 🎁 **Rewards**: Farmer rewards program

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Maps**: React Leaflet
- **AI**: OpenAI GPT-4
- **Weather**: WeatherAPI
- **PWA**: Next.js PWA support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- WeatherAPI account (optional)
- OpenAI API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd repo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Weather API (Get from https://www.weatherapi.com/)
   WEATHERAPI_KEY=your_weatherapi_key_here
   
   # OpenAI API (Get from https://platform.openai.com/)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key to the environment variables
   - Set up authentication (email/password or magic links)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── buyers/            # Buyers page
│   ├── calculator/        # Cost calculator
│   ├── chat/              # AI chat
│   ├── dashboard/         # Main dashboard
│   ├── market/            # Market prices
│   ├── weather/           # Weather information
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## API Routes

- `/api/weather` - Weather data from WeatherAPI
- `/api/ai` - OpenAI GPT-4 integration
- `/api/chat` - Chat functionality
- `/api/market` - Market price data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Features in Detail

### Authentication
- Magic link authentication via Supabase
- Development bypass for testing
- Secure session management

### Weather Integration
- Real-time weather data
- Weather alerts and warnings
- Forecast information

### AI Assistant
- GPT-4 powered chat
- Farming advice and recommendations
- Multi-language support (English/Hindi)

### Market Prices
- Real-time market data
- Price trends and analysis
- Location-based pricing

### PWA Features
- Installable on mobile devices
- Offline support
- Push notifications (coming soon)
- App-like experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub or contact the development team.
