import { NextRequest, NextResponse } from "next/server";

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface NormalizedGoogleReview {
  id: string;
  type: string;
  status: string;
  overallRating: number;
  reviewText: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  categories: {};
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  isApproved: boolean;
  googleMetadata: {
    language: string;
    relativeTime: string;
    profilePhoto?: string;
  };
}

// Mock Google Reviews data (since we don't have a real API key for demo)
const mockGoogleReviews: GoogleReview[] = [
  {
    author_name: "Lisa Anderson",
    language: "en",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Fantastic property in the heart of London. The host was incredibly welcoming and the space was immaculate. Perfect location for exploring the city!",
    time: 1692627615,
  },
  {
    author_name: "Robert Taylor",
    language: "en",
    rating: 4,
    relative_time_description: "1 month ago",
    text: "Decent place but the noise from the street was quite bothersome at night. Otherwise good location and clean facilities.",
    time: 1690035615,
  },
];

function normalizeGoogleReview(
  review: GoogleReview,
  placeId: string,
  placeName: string
): NormalizedGoogleReview {
  return {
    id: `google_${placeId}_${review.time}`,
    type: "guest-review",
    status: "published",
    overallRating: review.rating * 2, // Convert 5-star to 10-point scale
    reviewText: review.text,
    categories: {}, // Google Reviews don't provide category breakdowns
    submittedAt: new Date(review.time * 1000).toISOString(),
    guestName: review.author_name,
    listingName: placeName,
    channel: "google",
    isApproved: false, // Default to not approved for manager review
    googleMetadata: {
      language: review.language,
      relativeTime: review.relative_time_description,
      profilePhoto: review.profile_photo_url,
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      {
        success: false,
        error: "placeId parameter is required",
        data: [],
      },
      { status: 400 }
    );
  }

  try {
    // Mock implementation for demo purposes
    const mockPlaceName =
      placeId === "demo_place_1"
        ? "2B N1 A - 29 Shoreditch Heights"
        : "Unknown Property";

    const normalizedReviews = mockGoogleReviews.map((review) =>
      normalizeGoogleReview(review, placeId, mockPlaceName)
    );

    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        source: "google_places_api_mock",
        timestamp: new Date().toISOString(),
        limitations: [
          "Limited to 5 most helpful reviews per place",
          "Reviews are truncated to 300 characters",
          "No category breakdown available",
          "Requires Google Places API key and has usage costs",
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Google reviews",
        data: [],
      },
      { status: 500 }
    );
  }
}
