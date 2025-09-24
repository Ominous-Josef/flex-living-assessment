"use client";

import { mockProperties, mockReviews } from "@/lib/mockData";
import { DashboardFilters, Property, Review } from "@/lib/types";
import {
  Building,
  CheckCircle,
  Clock,
  Filter,
  Star,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

interface DashboardProps {
  reviews?: Review[];
  properties?: Property[];
}

export default function Dashboard({
  reviews = mockReviews,
  properties = mockProperties,
}: DashboardProps) {
  const [filters, setFilters] = useState<DashboardFilters>({
    approvalStatus: "all",
  });

  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  // Filter reviews based on current filters
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (
        selectedProperty !== "all" &&
        review.listingName !== selectedProperty
      ) {
        return false;
      }

      if (filters.approvalStatus === "approved" && !review.isApproved) {
        return false;
      }

      if (filters.approvalStatus === "pending" && review.isApproved) {
        return false;
      }

      return true;
    });
  }, [reviews, selectedProperty, filters]);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const totalReviews = filteredReviews.length;
    const approvedReviews = filteredReviews.filter((r) => r.isApproved).length;
    const pendingReviews = totalReviews - approvedReviews;
    const averageRating =
      totalReviews > 0
        ? filteredReviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) /
          totalReviews
        : 0;

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }, [filteredReviews]);

  const handleApprovalToggle = (reviewId: number) => {
    // In a real app, this would make an API call
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex !== -1) {
      reviews[reviewIndex].isApproved = !reviews[reviewIndex].isApproved;
      // Force re-render (in real app, you'd use proper state management)
      setFilters({ ...filters });
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
          />
        );
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reviews Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and monitor property reviews across all channels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Reviews
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Average Rating
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.averageRating}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.approvedReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats.pendingReviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.name}>
                {property.name}
              </option>
            ))}
          </select>

          <select
            value={filters.approvalStatus}
            onChange={(e) =>
              setFilters({
                ...filters,
                approvalStatus: e.target.value as
                  | "all"
                  | "approved"
                  | "pending",
              })
            }
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => {
          const propertyReviews = reviews.filter(
            (r) => r.listingName === property.name
          );
          const avgRating =
            propertyReviews.length > 0
              ? propertyReviews.reduce(
                  (sum, r) => sum + (r.overallRating || 0),
                  0
                ) / propertyReviews.length
              : 0;

          return (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-500">{property.address}</p>
                </div>
                <Building className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between mb-4">
                {renderStars(avgRating)}
                <span className="text-sm text-gray-500">
                  {propertyReviews.length} reviews
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Approved:</span>
                  <span className="font-medium text-green-600">
                    {propertyReviews.filter((r) => r.isApproved).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Pending:</span>
                  <span className="font-medium text-orange-600">
                    {propertyReviews.filter((r) => !r.isApproved).length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          <p className="text-gray-600">
            Manage individual reviews and their approval status
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.guestName}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.channel === "hostaway"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {review.channel}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    {review.listingName}
                  </p>
                  {renderStars(review.overallRating)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprovalToggle(review.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      review.isApproved
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {review.isApproved
                      ? "Remove from Site"
                      : "Approve for Site"}
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.reviewText}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <div key={category} className="flex items-center gap-1">
                    <span className="capitalize">
                      {category.replace("_", " ")}:
                    </span>
                    <span className="font-medium">{rating}/10</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(review.submittedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
