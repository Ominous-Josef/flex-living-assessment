import { Badge } from '@/components/ui/badge'
import { BarChart3, Building2, Star, TrendingUp, Users } from 'lucide-react'

export default function AnalyticsPage() {
  const mockAnalytics = {
    totalRating: 8.7,
    ratingTrend: '+0.3',
    totalReviews: 47,
    reviewsTrend: '+12',
    responseRate: '98%',
    avgResponseTime: '2.4h'
  }

  const propertyPerformance = [
    { name: 'Shoreditch Heights', rating: 9.3, reviews: 18, trend: 'up' },
    { name: 'Camden Lock', rating: 8.6, reviews: 15, trend: 'up' },
    { name: 'Canary Wharf', rating: 7.8, reviews: 14, trend: 'down' }
  ]

  const categoryRatings = [
    { category: 'Cleanliness', score: 9.1, change: '+0.2' },
    { category: 'Communication', score: 9.3, change: '+0.1' },
    { category: 'Location', score: 8.9, change: '+0.4' },
    { category: 'Value', score: 8.2, change: '-0.1' },
    { category: 'Accuracy', score: 8.8, change: '+0.3' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Performance</h1>
        <p className="text-gray-600">Track your property performance and guest satisfaction metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              {mockAnalytics.ratingTrend}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Overall Rating</h3>
          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.totalRating}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              {mockAnalytics.reviewsTrend}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.totalReviews}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="secondary">Excellent</Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.responseRate}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <Badge variant="secondary">Fast</Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
          <p className="text-2xl font-semibold text-gray-900">{mockAnalytics.avgResponseTime}</p>
        </div>
      </div>

      {/* Property Performance */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Property Performance</h2>
          <p className="text-gray-600">Compare ratings and review volume across properties</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{property.name}</h4>
                    <p className="text-sm text-gray-500">{property.reviews} reviews</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{property.rating}</span>
                    </div>
                  </div>
                  <TrendingUp className={`w-4 h-4 ${
                    property.trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Category Performance</h2>
          <p className="text-gray-600">Detailed breakdown of guest satisfaction by category</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryRatings.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{item.score}</span>
                    <Badge variant={item.change.startsWith('+') ? 'default' : 'secondary'} className={
                      item.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }>
                      {item.change}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(item.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📈 Key Insights</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Shoreditch Heights is your top-performing property</li>
            <li>• Communication scores have improved across all properties</li>
            <li>• Location ratings show the strongest upward trend</li>
            <li>• Consider focusing on value perception at Canary Wharf</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Recommendations</h3>
          <ul className="space-y-2 text-green-800">
            <li>• Maintain current cleaning standards - scores are excellent</li>
            <li>• Share Shoreditch Heights best practices with other properties</li>
            <li>• Consider guest welcome packages to improve value perception</li>
            <li>• Continue quick response times - guests notice!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}