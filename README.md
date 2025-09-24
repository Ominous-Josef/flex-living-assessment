# Flex Living Reviews Dashboard

## Overview

The Flex Living Reviews Dashboard is a comprehensive solution for managing and displaying property reviews from multiple channels. It provides property managers with tools to monitor performance, approve reviews for public display, and maintain high-quality guest experiences.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Axios** - HTTP client for external API calls

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

## Key Features

### 1. Multi-Channel Review Integration
- **Hostaway API Integration**: Fetches reviews from Hostaway platform
- **Google Reviews Support**: Framework for Google Places API integration
- **Normalized Data Structure**: Consistent format across all review sources

### 2. Manager Dashboard
- **Property Performance Overview**: Visual cards showing key metrics
- **Review Filtering**: Filter by property, approval status, channel
- **Approval System**: One-click review approval/disapproval
- **Real-time Statistics**: Dynamic calculation of ratings and counts

### 3. Public Review Display
- **Property Details Pages**: Professional property showcase
- **Approved Reviews Only**: Only manager-approved reviews are displayed
- **Category Ratings**: Detailed breakdown of review categories
- **Responsive Design**: Mobile-friendly layout

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── reviews/
│   │       ├── hostaway/
│   │       │   └── route.ts          # Hostaway API integration
│   │       └── google/
│   │           └── route.ts          # Google Reviews API (demo)
│   ├── property/
│   │   └── [id]/
│   │       └── page.tsx              # Property details page
│   └── page.tsx                      # Main dashboard page
├── components/
│   ├── Dashboard.tsx                 # Main dashboard component
│   └── ui/
│       └── skeleton.tsx              # Loading states
└── lib/
    ├── types.ts                      # TypeScript interfaces
    ├── mockData.ts                   # Sample review data
    └── utils.ts                      # Utility functions
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flex-living-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables
For production deployment, you may want to add:
```env
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148
GOOGLE_PLACES_API_KEY=your_api_key_here
```

## API Routes

### GET /api/reviews/hostaway
Fetches and normalizes reviews from Hostaway API.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 7453,
      "type": "guest-to-host",
      "overallRating": 9.2,
      "reviewText": "Amazing stay!...",
      "categories": {
        "cleanliness": 10,
        "communication": 10
      },
      "guestName": "John Smith",
      "listingName": "2B N1 A - 29 Shoreditch Heights",
      "channel": "hostaway",
      "isApproved": false
    }
  ],
  "meta": {
    "total": 5,
    "source": "mock",
    "timestamp": "2024-08-21T22:45:14Z"
  }
}
```

### GET /api/reviews/google?placeId={id}
Demonstrates Google Places API integration for reviews.

**Note**: This is a mock implementation due to API limitations (see Google Reviews findings below).

## Google Reviews Integration Findings

### Feasibility Assessment: LIMITED

#### Key Limitations Discovered

1. **Review Volume Restrictions**
   - Maximum 5 most helpful reviews per place
   - Reviews truncated to 300 characters
   - No access to full review history

2. **Cost and Complexity**
   - Pay-per-request pricing model
   - Rate limiting can affect real-time applications
   - Requires Google Cloud project setup and billing

3. **Data Limitations**
   - No category breakdowns (cleanliness, communication, etc.)
   - Limited metadata compared to booking platforms
   - Reviews not specific to short-term rental context

#### Recommendation

**Primary Strategy**: Focus on booking platform APIs (Hostaway, Airbnb, Booking.com)
- These provide richer, more relevant review data
- Better category breakdowns and detailed ratings
- More suitable for short-term rental context

**Supplementary Use**: Google Reviews as additional data source
- Use for properties with strong Google My Business presence
- Implement robust caching to minimize API costs
- Consider for reputation monitoring rather than primary display

## Testing the Application

### Dashboard Features
1. **Visit** [http://localhost:3001](http://localhost:3001)
2. **View Statistics**: Check property performance cards
3. **Filter Reviews**: Use dropdown filters for properties and approval status
4. **Approve Reviews**: Click approval buttons to toggle review status
5. **Navigate to Properties**: Use the quick links in the header

### Property Pages
1. **Click property links** from dashboard
2. **View approved reviews** in the dedicated reviews section
3. **Test responsive design** by resizing browser window
4. **Check review categories** and rating breakdowns

### API Endpoints
1. **Hostaway API**: Visit [http://localhost:3001/api/reviews/hostaway](http://localhost:3001/api/reviews/hostaway)
2. **Google API**: Visit [http://localhost:3001/api/reviews/google?placeId=demo_place_1](http://localhost:3001/api/reviews/google?placeId=demo_place_1)

---

**Built with ❤️ for Flex Living**  
*Assessment completed September 2025*
