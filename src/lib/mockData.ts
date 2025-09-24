import { Property, Review } from './types';

// Extended mock reviews data
export const mockReviews: Review[] = [
  {
    id: 7453,
    type: "guest-to-host",
    status: "published",
    overallRating: 9.2,
    reviewText: "Amazing stay! The property was exactly as described and Shane was very responsive. Would definitely book again.",
    categories: {
      cleanliness: 10,
      communication: 10,
      accuracy: 9,
      location: 8,
      value: 9
    },
    submittedAt: "2024-08-21T22:45:14Z",
    guestName: "John Smith",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    isApproved: true
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    overallRating: 9.0,
    reviewText: "Great location and clean apartment. Check-in was smooth and the host was helpful throughout our stay.",
    categories: {
      cleanliness: 9,
      communication: 8,
      accuracy: 10,
      location: 10,
      value: 8
    },
    submittedAt: "2024-08-15T14:30:22Z",
    guestName: "Emma Wilson",
    listingName: "1B S2 C - 15 Camden Lock",
    channel: "hostaway",
    isApproved: false
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    overallRating: 8.0,
    reviewText: "The apartment was nice but had some cleanliness issues. The location is excellent though.",
    categories: {
      cleanliness: 6,
      communication: 9,
      accuracy: 8,
      location: 10,
      value: 7
    },
    submittedAt: "2024-08-10T09:15:33Z",
    guestName: "Michael Johnson",
    listingName: "3B E1 B - 42 Canary Wharf Tower",
    channel: "hostaway",
    isApproved: false
  },
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    overallRating: 9.8,
    reviewText: "Perfect stay! Everything was spotless and the amenities were great. Highly recommend this property.",
    categories: {
      cleanliness: 10,
      communication: 10,
      accuracy: 10,
      location: 9,
      value: 10
    },
    submittedAt: "2024-08-05T16:20:45Z",
    guestName: "Sarah Davis",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    isApproved: true
  },
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    overallRating: 8.2,
    reviewText: "Good value for money. The apartment was comfortable and the host was easy to communicate with.",
    categories: {
      cleanliness: 8,
      communication: 9,
      accuracy: 8,
      location: 7,
      value: 9
    },
    submittedAt: "2024-07-28T11:45:12Z",
    guestName: "David Brown",
    listingName: "1B S2 C - 15 Camden Lock",
    channel: "hostaway",
    isApproved: true
  },
  // Additional Google Reviews mock data
  {
    id: 8001,
    type: "guest-review",
    status: "published",
    overallRating: 9.5,
    reviewText: "Fantastic property in the heart of London. The host was incredibly welcoming and the space was immaculate.",
    categories: {
      cleanliness: 10,
      communication: 9,
      location: 10,
      value: 9
    },
    submittedAt: "2024-08-18T10:20:15Z",
    guestName: "Lisa Anderson",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    isApproved: true
  },
  {
    id: 8002,
    type: "guest-review",
    status: "published",
    overallRating: 7.5,
    reviewText: "Decent place but the noise from the street was quite bothersome at night. Otherwise good location.",
    categories: {
      cleanliness: 8,
      communication: 8,
      location: 9,
      value: 6
    },
    submittedAt: "2024-08-12T08:30:44Z",
    guestName: "Robert Taylor",
    listingName: "3B E1 B - 42 Canary Wharf Tower",
    channel: "google",
    isApproved: false
  }
];

export const mockProperties: Property[] = [
  {
    id: "prop_1",
    name: "2B N1 A - 29 Shoreditch Heights",
    address: "29 Shoreditch High Street, London, E1 6PQ",
    averageRating: 9.3,
    totalReviews: 12,
    recentReviews: mockReviews.filter(r => r.listingName === "2B N1 A - 29 Shoreditch Heights").slice(0, 3)
  },
  {
    id: "prop_2", 
    name: "1B S2 C - 15 Camden Lock",
    address: "15 Camden Lock Place, London, NW1 8AF",
    averageRating: 8.6,
    totalReviews: 8,
    recentReviews: mockReviews.filter(r => r.listingName === "1B S2 C - 15 Camden Lock").slice(0, 3)
  },
  {
    id: "prop_3",
    name: "3B E1 B - 42 Canary Wharf Tower",
    address: "42 Canary Wharf, London, E14 5AB",
    averageRating: 7.8,
    totalReviews: 6,
    recentReviews: mockReviews.filter(r => r.listingName === "3B E1 B - 42 Canary Wharf Tower").slice(0, 3)
  }
];

// Utility functions for data manipulation
export function getReviewsByProperty(propertyName: string): Review[] {
  return mockReviews.filter(review => review.listingName === propertyName);
}

export function getReviewsByChannel(channel: string): Review[] {
  return mockReviews.filter(review => review.channel === channel);
}

export function getApprovedReviews(): Review[] {
  return mockReviews.filter(review => review.isApproved);
}

export function getPendingReviews(): Review[] {
  return mockReviews.filter(review => !review.isApproved);
}

export function calculatePropertyStats(propertyName: string) {
  const propertyReviews = getReviewsByProperty(propertyName);
  const totalReviews = propertyReviews.length;
  
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      categoryAverages: {}
    };
  }

  const averageRating = propertyReviews.reduce((sum, review) => 
    sum + (review.overallRating || 0), 0) / totalReviews;

  const categoryAverages: { [key: string]: number } = {};
  const categoryCounts: { [key: string]: number } = {};

  propertyReviews.forEach(review => {
    Object.entries(review.categories).forEach(([category, rating]) => {
      if (rating) {
        categoryAverages[category] = (categoryAverages[category] || 0) + rating;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
  });

  Object.keys(categoryAverages).forEach(category => {
    categoryAverages[category] = categoryAverages[category] / categoryCounts[category];
  });

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    categoryAverages
  };
}