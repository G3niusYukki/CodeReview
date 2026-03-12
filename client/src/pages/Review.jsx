import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, Github, Play, Info, CheckCircle2 } from 'lucide-react'

const LANGUAGE_OPTIONS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css'
]

const EXTENSION_LANGUAGE_MAP = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  cs: 'csharp',
  cpp: 'cpp',
  cxx: 'cpp',
  cc: 'cpp',
  go: 'go',
  rs: 'rust',
  rb: 'ruby',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
  html: 'html',
  css: 'css'
}

const Review = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('paste')
  const [selectedFileName, setSelectedFileName] = useState('')
  const navigate = useNavigate()

  const canSubmit = useMemo(() => code.trim().length > 0 && !loading, [code, loading])

  const detectLanguageFromFileName = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return EXTENSION_LANGUAGE_MAP[extension] || 'javascript'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedCode = code.trim()
    if (!trimmedCode) {
      toast.error('Please enter some code to review')
      return
    }

    setLoading(true)

    try {
      const fileName = selectedFileName || `snippet.${language}`

      const response = await axios.post('/api/review/analyze', {
        code: trimmedCode,
        language,
        fileName
      })

      toast.success('Review started successfully')
      navigate(`/history/${response.data.reviewId}`)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to start review'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (loadEvent) => {
      const fileContent = loadEvent.target?.result
      const nextCode = typeof fileContent === 'string' ? fileContent : ''

      setCode(nextCode)
      setSelectedFileName(file.name)
      setLanguage(detectLanguageFromFileName(file.name))
      toast.success(`Loaded ${file.name}`)
    }

    reader.onerror = () => {
      toast.error('Failed to read the selected file')
    }

    reader.readAsText(file)
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Code Review</h1>
        <p className="mt-2 text-gray-600">
          Submit code snippets or files for AI-powered review and issue detection.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-6 py-3">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleModeChange('paste')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                mode === 'paste'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Paste Code
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                mode === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('github')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                mode === 'github'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Github className="w-4 h-4 inline mr-2" />
              GitHub
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {LANGUAGE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'upload' && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Code File
                </label>
                <input
                  type="file"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.cpp,.cxx,.cc,.go,.rs,.rb,.php,.swift,.kt,.scala,.html,.css"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFileName && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selected file: {selectedFileName}</span>
                  </div>
                )}
              </div>
            )}

            {mode === 'github' && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="text-sm font-semibold text-blue-900">
                      GitHub connection available on your account settings flow
                    </h2>
                    <p className="mt-1 text-sm text-blue-800">
                      The backend already includes GitHub-related endpoints, but the
                      repository picker flow is not fully wired into this screen yet.
                      For now, use paste or upload to start a review.
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
                      If you want GitHub import here, the next step is to add a connected
                      repository browser and file selector on top of the existing API routes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Editor
                  height="420px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                <span>
                  {selectedFileName
                    ? `Reviewing content from ${selectedFileName}`
                    : 'Paste code directly or upload a local file.'}
                </span>
                <span>{code.trim().length} characters</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                {loading ? 'Starting Review...' : 'Start Review'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          What will be analyzed?
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Security vulnerabilities and potentially risky code paths</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Performance bottlenecks and optimization opportunities</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Code quality, readability, and best-practice issues</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Potential bugs, edge cases, and maintainability concerns</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Review
