"use client"

import { mockProperties, mockReviews } from '@/lib/mockData';
import { Bath, Bed, Car, CheckCircle, Coffee, MapPin, Star, Users, Wifi } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  // Find property by ID (in real app, this would be an API call)
  const property = mockProperties.find(p => p.id === propertyId);
  const approvedReviews = mockReviews.filter(review => 
    review.listingName === property?.name && review.isApproved
  );

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found</div>;
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
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
    
    return <div className="flex items-center">{stars}</div>;
  };

  const amenities = [
    { icon: Wifi, name: 'Free WiFi' },
    { icon: Car, name: 'Parking' },
    { icon: Coffee, name: 'Kitchen' },
    { icon: Bath, name: 'Private Bathroom' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 -m-6 mb-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center px-6">
          <div className="text-white max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-5 h-5" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Overview</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">2 Bedrooms</div>
                      <div className="text-sm text-gray-500">Comfortable sleeping</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">1 Bathroom</div>
                      <div className="text-sm text-gray-500">Modern facilities</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">4 Guests</div>
                      <div className="text-sm text-gray-500">Maximum occupancy</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <amenity.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Guest Reviews Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Verified reviews only</span>
                </div>
              </div>
              
              {approvedReviews.length > 0 ? (
                <div className="space-y-6">
                  {approvedReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.channel === 'hostaway' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              Verified Guest
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStars(review.overallRating)}
                            <span className="text-sm text-gray-600 ml-2">
                              {review.overallRating}/10
                            </span>
                          </div>
                        </div>
                        <time className="text-sm text-gray-500">
                          {new Date(review.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>
                      
                      {/* Category ratings */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {Object.entries(review.categories).map(([category, rating]) => (
                          <div key={category} className="text-sm">
                            <div className="text-gray-600 capitalize mb-1">
                              {category.replace('_', ' ')}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(rating || 0) * 10}%` }}
                                />
                              </div>
                              <span className="text-gray-900 font-medium">{rating}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to share your experience!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">£120/night</div>
                  <div className="text-sm text-gray-600">avg. price</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {renderStars(property.averageRating)}
                  </div>
                  <div className="text-sm text-gray-600">{property.totalReviews} reviews</div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                Check Availability
              </button>
              
              <div className="text-center text-sm text-gray-600">
                You won&apos;t be charged yet
              </div>

              {/* Property Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Property Highlights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guest Rating</span>
                    <span className="font-semibold">{property.averageRating}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-semibold">{property.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-semibold">
                      {Math.round((approvedReviews.length / property.totalReviews) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }