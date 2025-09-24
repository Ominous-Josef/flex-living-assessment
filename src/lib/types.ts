export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface Review {
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
  isApproved: boolean;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalReviews: number;
  recentReviews: Review[];
}

export interface DashboardFilters {
  propertyId?: string;
  rating?: string;
  category?: string;
  channel?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  approvalStatus?: 'all' | 'approved' | 'pending';
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  categoryAverages: {
    [category: string]: number;
  };
  trendsData: {
    date: string;
    rating: number;
    count: number;
  }[];
}