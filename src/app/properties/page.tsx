"use client";

import { Building2, MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Property {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalReviews: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch reviews from both APIs to calculate property stats
        const [hostawayResponse, googleResponse] = await Promise.all([
          fetch('/api/reviews/hostaway'),
          fetch('/api/reviews/google?placeId=demo_place_1')
        ]);

        const hostawayData = await hostawayResponse.json();
        const googleData = await googleResponse.json();

        if (hostawayData.success && googleData.success) {
          const allReviews = [...hostawayData.data, ...googleData.data];
          
          // Group reviews by property and calculate stats
          const propertyStats = new Map<string, { totalReviews: number; totalRating: number; name: string; address: string; }>();
          
          allReviews.forEach((review: any) => {
            const propertyName = review.listingName;
            if (!propertyStats.has(propertyName)) {
              propertyStats.set(propertyName, {
                totalReviews: 0,
                totalRating: 0,
                name: propertyName,
                address: getAddressForProperty(propertyName)
              });
            }
            
            const stats = propertyStats.get(propertyName)!;
            stats.totalReviews++;
            stats.totalRating += review.overallRating || 0;
          });

          // Convert to properties array
          const propertiesData: Property[] = Array.from(propertyStats.entries()).map(([name, stats], index) => ({
            id: `prop_${index + 1}`,
            name: stats.name,
            address: stats.address,
            totalReviews: stats.totalReviews,
            averageRating: stats.totalReviews > 0 ? Number((stats.totalRating / stats.totalReviews).toFixed(1)) : 0
          }));

          setProperties(propertiesData);
        } else {
          // Fallback to mock data if API fails
          // setProperties(mockProperties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
        // Fallback to mock data on error
        // setProperties(mockProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getAddressForProperty = (propertyName: string): string => {
    const addressMap: { [key: string]: string } = {
      "2B N1 A - 29 Shoreditch Heights": "29 Shoreditch High Street, London, E1 6PQ",
      "1B S2 C - 15 Camden Lock": "15 Camden Lock Place, London, NW1 8AF",
      "3B E1 B - 42 Canary Wharf Tower": "42 Canary Wharf, London, E14 5AB"
    };
    return addressMap[propertyName] || "London, UK";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
        <p className="text-gray-600">
          Manage your property portfolio and view individual property details
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Add New Property
        </h3>
        <p className="text-blue-700 mb-4">
          Expand your portfolio by adding a new property to the platform.
        </p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="w-full h-60 overflow-hidden">
              <Image
                src={"/apartment-image.jpeg"}
                alt="Apartment Image"
                width={500}
                height={300}
                className="size-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{property.averageRating}</span>
                  <span className="text-gray-500 text-sm">
                    ({property.totalReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">4 Guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">2 Bedrooms</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
