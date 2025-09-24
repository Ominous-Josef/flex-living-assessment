import { Config } from "@/lib/config";
import axios from "axios";
import { NextResponse } from "next/server";

// Types for Hostaway API response
interface ReviewCategory {
  category: string;
  rating: number;
}

interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

// Normalized review interface for our frontend
export interface NormalizedReview {
  id: number;
  type: string;
  status: string;
  overallRating: number | null;
  reviewText: string;
  categories: {
    cleanliness?: number;
    communication?: number;
    respect_house_rules?: number;
    accuracy?: number;
    location?: number;
    value?: number;
  };
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  isApproved: boolean; // For manager approval system
}

// Mock data to supplement the sandbox API (which likely returns no reviews)
const mockReviews: HostawayReview[] = [
  {
    id: 7453,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "Amazing stay! The property was exactly as described and Shane was very responsive. Would definitely book again.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "accuracy", rating: 9 },
      { category: "location", rating: 8 },
      { category: "value", rating: 9 },
    ],
    submittedAt: "2024-08-21 22:45:14",
    guestName: "John Smith",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "Great location and clean apartment. Check-in was smooth and the host was helpful throughout our stay.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 8 },
      { category: "accuracy", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 8 },
    ],
    submittedAt: "2024-08-15 14:30:22",
    guestName: "Emma Wilson",
    listingName: "1B S2 C - 15 Camden Lock",
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "The apartment was nice but had some cleanliness issues. The location is excellent though.",
    reviewCategory: [
      { category: "cleanliness", rating: 6 },
      { category: "communication", rating: 9 },
      { category: "accuracy", rating: 8 },
      { category: "location", rating: 10 },
      { category: "value", rating: 7 },
    ],
    submittedAt: "2024-08-10 09:15:33",
    guestName: "Michael Johnson",
    listingName: "3B E1 B - 42 Canary Wharf Tower",
  },
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "Perfect stay! Everything was spotless and the amenities were great. Highly recommend this property.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "accuracy", rating: 10 },
      { category: "location", rating: 9 },
      { category: "value", rating: 10 },
    ],
    submittedAt: "2024-08-05 16:20:45",
    guestName: "Sarah Davis",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview:
      "Good value for money. The apartment was comfortable and the host was easy to communicate with.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "communication", rating: 9 },
      { category: "accuracy", rating: 8 },
      { category: "location", rating: 7 },
      { category: "value", rating: 9 },
    ],
    submittedAt: "2024-07-28 11:45:12",
    guestName: "David Brown",
    listingName: "1B S2 C - 15 Camden Lock",
  },
];

function normalizeReview(review: HostawayReview): NormalizedReview {
  // Calculate average rating from categories
  const categoryRatings = review.reviewCategory.reduce((acc, cat) => {
    acc[cat.category] = cat.rating;
    return acc;
  }, {} as Record<string, number>);

  const avgRating =
    review.reviewCategory.length > 0
      ? review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0) /
        review.reviewCategory.length
      : null;

  return {
    id: review.id,
    type: review.type,
    status: review.status,
    overallRating: avgRating,
    reviewText: review.publicReview,
    categories: categoryRatings,
    submittedAt: review.submittedAt,
    guestName: review.guestName,
    listingName: review.listingName,
    channel: "hostaway",
    isApproved: false, // Default to not approved for manager review
  };
}

export async function GET() {
  try {
    const accountId = Config.ACCOUNT_ID;
    const apiKey = Config.API_KEY;

    // Try to fetch from Hostaway API first
    let hostawayReviews: HostawayReview[] = [];

    try {
      const response = await axios.get(`https://api.hostaway.com/v1/reviews`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          accountId: accountId,
        },
      });

      if (response.data && response.data.result) {
        hostawayReviews = response.data.result;
      }
    } catch {
      console.log("Hostaway API returned no data or error, using mock data");
    }

    // If no reviews from API (expected in sandbox), use mock data
    const reviewsToProcess =
      hostawayReviews.length > 0 ? hostawayReviews : mockReviews;

    // Normalize the reviews
    const normalizedReviews = reviewsToProcess.map(normalizeReview);

    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      meta: {
        total: normalizedReviews.length,
        source: hostawayReviews.length > 0 ? "hostaway" : "mock",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        data: [],
      },
      { status: 500 }
    );
  }
}
