import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCode2,
  RefreshCw,
  Shield,
  Trash2,
  AlertTriangle,
  Zap,
} from 'lucide-react'

const POLL_INTERVAL_MS = 3000

const statusStyles = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
}

const severityStyles = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  info: 'bg-gray-100 text-gray-700 border-gray-200',
}

const typeStyles = {
  security: 'bg-red-50 text-red-700 border-red-200',
  performance: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  best_practice: 'bg-blue-50 text-blue-700 border-blue-200',
  general: 'bg-gray-50 text-gray-700 border-gray-200',
}

function formatDateTime(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function formatSeconds(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  return `${Number(value).toFixed(1)}s`
}

function normalizeIssues(result) {
  if (Array.isArray(result)) return result
  return []
}

function getStatusStyle(status) {
  return statusStyles[status] || statusStyles.pending
}

function getSeverityStyle(severity) {
  return severityStyles[severity] || severityStyles.info
}

function getTypeStyle(type) {
  return typeStyles[type] || typeStyles.general
}

function getTypeLabel(type) {
  switch (type) {
    case 'security':
      return 'Security'
    case 'performance':
      return 'Performance'
    case 'best_practice':
      return 'Best Practice'
    default:
      return 'General'
  }
}

function getSeverityLabel(severity) {
  switch (severity) {
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    default:
      return 'Info'
  }
}

const ReviewDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchReview = async ({ silent = false } = {}) => {
    if (!id) return

    if (silent) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const response = await axios.get(`/api/review/${id}`)
      setReview(response.data)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load review')
      if (!silent) {
        navigate('/history')
      }
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchReview()
  }, [id])

  useEffect(() => {
    if (!review || !['processing', 'pending'].includes(review.status)) {
      return undefined
    }

    const timer = window.setInterval(() => {
      fetchReview({ silent: true })
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [review?.status, id])

  const issues = useMemo(() => normalizeIssues(review?.result), [review?.result])

  const groupedCounts = useMemo(() => {
    return issues.reduce(
      (acc, issue) => {
        const type = issue?.type || 'general'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {
        security: 0,
        performance: 0,
        best_practice: 0,
        general: 0,
      }
    )
  }, [issues])

  const handleDelete = async () => {
    if (!review) return

    const confirmed = window.confirm('Are you sure you want to delete this review?')
    if (!confirmed) return

    setDeleting(true)
    try {
      await axios.delete(`/api/review/${id}`)
      toast.success('Review deleted successfully')
      navigate('/history')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete review')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review not found</h1>
          <p className="text-gray-600 mb-6">
            The review you are looking for does not exist or is no longer available.
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {review.fileName || 'Code Review'}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyle(
                review.status
              )}`}
            >
              {review.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              {review.language || 'Unknown language'}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="w-4 h-4" />
              Created {formatDateTime(review.createdAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Updated {formatDateTime(review.updatedAt)}
            </span>
          </div>

          {(review.repository || review.branch) && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              {review.repository && <span>Repository: {review.repository}</span>}
              {review.branch && <span>Branch: {review.branch}</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fetchReview({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Issues Found</p>
              <p className="text-2xl font-semibold text-gray-900">{review.issuesFound ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Security</p>
              <p className="text-2xl font-semibold text-gray-900">
                {review.securityIssues ?? groupedCounts.security ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <Zap className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {review.performanceIssues ?? groupedCounts.performance ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatSeconds(review.processingTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {review.status === 'processing' && (
        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-5">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-yellow-700 mt-0.5 animate-spin" />
            <div>
              <h2 className="font-semibold text-yellow-900">Review is still processing</h2>
              <p className="text-sm text-yellow-800 mt-1">
                This page refreshes automatically every few seconds while analysis is running.
              </p>
            </div>
          </div>
        </div>
      )}

      {review.status === 'failed' && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-700 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-900">Review failed</h2>
              <p className="text-sm text-red-800 mt-1">
                {review.errorMessage || 'The review could not be completed.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">
                {review.summary || 'No summary is available yet.'}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Issues</h2>
              <span className="text-sm text-gray-500">{issues.length} total</span>
            </div>

            {issues.length === 0 ? (
              <div className="p-6 text-gray-600">
                {review.status === 'completed'
                  ? 'No structured issues were returned for this review.'
                  : 'Issues will appear here after the review finishes.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {issues.map((issue, index) => (
                  <div key={`${issue.type || 'general'}-${issue.line || 'na'}-${index}`} className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getTypeStyle(
                          issue.type
                        )}`}
                      >
                        {getTypeLabel(issue.type)}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getSeverityStyle(
                          issue.severity
                        )}`}
                      >
                        {getSeverityLabel(issue.severity)}
                      </span>
                      {issue.line && (
                        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                          Line {issue.line}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-800 whitespace-pre-wrap leading-7">
                      {issue.description || 'No description provided.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Submitted Code</h2>
            </div>
            <div className="p-0">
              <pre className="overflow-x-auto bg-gray-950 text-gray-100 text-sm p-6 rounded-b-lg whitespace-pre-wrap break-words">
                <code>{review.codeContent || ''}</code>
              </pre>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Review Metadata</h2>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Review ID</span>
                <span className="text-gray-900 font-medium">{review.id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <span className="text-gray-900 font-medium capitalize">{review.status}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Language</span>
                <span className="text-gray-900 font-medium">{review.language || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">File Name</span>
                <span className="text-gray-900 font-medium text-right">
                  {review.fileName || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Repository</span>
                <span className="text-gray-900 font-medium text-right">
                  {review.repository || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Branch</span>
                <span className="text-gray-900 font-medium text-right">
                  {review.branch || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900 font-medium text-right">
                  {formatDateTime(review.createdAt)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-900 font-medium text-right">
                  {formatDateTime(review.updatedAt)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Issue Breakdown</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Security</span>
                <span className="font-semibold text-red-600">
                  {review.securityIssues ?? groupedCounts.security ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Performance</span>
                <span className="font-semibold text-yellow-600">
                  {review.performanceIssues ?? groupedCounts.performance ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Best Practices</span>
                <span className="font-semibold text-blue-600">
                  {review.bestPracticeIssues ?? groupedCounts.best_practice ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">General</span>
                <span className="font-semibold text-gray-700">
                  {groupedCounts.general ?? 0}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Review the highest-severity findings first.</li>
              <li>• Fix issues with explicit line references before broader refactors.</li>
              <li>• Re-run analysis after major changes to compare results.</li>
              <li>• Use the review history page to track recent submissions.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetail
