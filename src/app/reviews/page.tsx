"use client";

import { Badge } from '@/components/ui/badge';
import { mockReviews } from '@/lib/mockData';
import { CheckCircle, Clock, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
  id: number;
  type: string;
  status: string;
  overallRating: number | null;
  reviewText: string;
  categories: { [key: string]: number };
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  isApproved: boolean;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews from both APIs
        const [hostawayResponse, googleResponse] = await Promise.all([
          fetch('/api/reviews/hostaway'),
          fetch('/api/reviews/google?placeId=demo_place_1')
        ]);

        const hostawayData = await hostawayResponse.json();
        const googleData = await googleResponse.json();

        if (hostawayData.success && googleData.success) {
          const allReviews = [...hostawayData.data, ...googleData.data];
          setReviews(allReviews);
        } else {
          // Fallback to mock data if API fails
          setReviews(mockReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
        // Fallback to mock data on error
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const pendingReviews = reviews.filter(r => !r.isApproved)
  const approvedReviews = reviews.filter(r => r.isApproved)

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
        <p className="text-gray-600">Review and approve guest feedback for public display</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
              <p className="text-2xl font-semibold text-gray-900">{pendingReviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-semibold text-gray-900">{approvedReviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg. Rating</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length).toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Pending Approval</h2>
            <Badge variant="secondary">{pendingReviews.length} reviews</Badge>
          </div>
          <p className="text-gray-600 mt-1">Reviews waiting for your approval to appear on property pages</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pendingReviews.slice(0, 5).map(review => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                    <Badge variant={review.channel === 'hostaway' ? 'default' : 'secondary'}>
                      {review.channel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{review.listingName}</p>
                  {renderStars(review.overallRating)}
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                    Approve
                  </button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{review.reviewText}</p>
              
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <span key={category} className="bg-gray-100 px-2 py-1 rounded">
                    {category.replace('_', ' ')}: {rating}/10
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}