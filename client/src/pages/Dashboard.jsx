import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'
import { Code, FileText, Shield, Zap, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [usage, setUsage] = useState({
    plan: 'free',
    reviewsLimit: 0,
    reviewsUsed: 0,
    reviewsRemaining: 0,
    usagePercentage: 0,
    resetDate: null
  })
  const [stats, setStats] = useState({
    totalReviews: 0,
    securityIssues: 0,
    performanceIssues: 0,
    bestPractices: 0
  })
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usageRes, reviewsRes] = await Promise.all([
        axios.get('/api/user/usage'),
        axios.get('/api/review/history?limit=5')
      ])

      const usageData = usageRes.data
      const reviews = reviewsRes.data.reviews || []

      const aggregatedStats = reviews.reduce(
        (acc, review) => ({
          totalReviews: acc.totalReviews + 1,
          securityIssues: acc.securityIssues + (review.securityIssues || 0),
          performanceIssues: acc.performanceIssues + (review.performanceIssues || 0),
          bestPractices: acc.bestPractices + (review.bestPracticeIssues || 0)
        }),
        {
          totalReviews: 0,
          securityIssues: 0,
          performanceIssues: 0,
          bestPractices: 0
        }
      )

      setUsage({
        plan: usageData.plan || 'free',
        reviewsLimit: usageData.reviewsLimit || 0,
        reviewsUsed: usageData.reviewsUsed || 0,
        reviewsRemaining: usageData.reviewsRemaining || 0,
        usagePercentage: usageData.usagePercentage || 0,
        resetDate: usageData.resetDate || null
      })
      setStats(aggregatedStats)
      setRecentReviews(reviews)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const usageSummary = useMemo(() => {
    const resetDateText = usage.resetDate
      ? new Date(usage.resetDate).toLocaleDateString()
      : 'N/A'

    return {
      planName: usage.plan ? usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1) : 'Free',
      resetDateText
    }
  }, [usage])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Developer'}!
        </h1>
        <p className="mt-2 text-gray-600">
          {usage.reviewsRemaining} of {usage.reviewsLimit} reviews remaining on your{' '}
          {usageSummary.planName} plan.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          You’ve used {usage.reviewsUsed} review{usage.reviewsUsed === 1 ? '' : 's'} this cycle
          ({usage.usagePercentage}% of quota). Usage resets on {usageSummary.resetDateText}.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Usage</h2>
            <p className="text-sm text-gray-600">
              Track how many AI reviews you’ve used this billing cycle.
            </p>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {usage.reviewsUsed}/{usage.reviewsLimit}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-blue-600 rounded-full transition-all"
            style={{ width: `${Math.min(usage.usagePercentage || 0, 100)}%` }}
          />
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          <span>{usage.reviewsRemaining} reviews remaining</span>
          <Link to="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
            Upgrade plan
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Recent Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Security Issues</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.securityIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Performance Issues</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.performanceIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Best Practices</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.bestPractices}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            <Link
              to="/review"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              New Review
            </Link>
          </div>
        </div>

        {recentReviews.length === 0 ? (
          <div className="p-12 text-center">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No reviews yet</p>
            <Link to="/review" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              Create your first review
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentReviews.map((review) => (
              <Link
                key={review.id}
                to={`/history/${review.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{review.fileName || 'Code Review'}</p>
                    <p className="text-sm text-gray-600">
                      {review.language} • {review.issuesFound} issues found
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        review.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : review.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {review.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <div className="px-6 py-4 bg-gray-50">
              <Link to="/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View full review history
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-xl font-semibold mb-2">Need more review capacity?</h3>
        <p className="mb-4 text-blue-100">
          Upgrade for more monthly reviews, richer analysis, and advanced team features.
        </p>
        <Link
          to="/pricing"
          className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          View Pricing
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
