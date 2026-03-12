import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Zap,
  Code2,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Sparkles
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Security-first analysis',
      description:
        'Surface risky patterns like injection flaws, insecure auth flows, exposed secrets, and unsafe input handling.'
    },
    {
      icon: Zap,
      title: 'Performance insights',
      description:
        'Spot inefficient loops, heavy queries, unnecessary renders, and other bottlenecks before they hit production.'
    },
    {
      icon: Code2,
      title: 'Maintainability review',
      description:
        'Get actionable feedback on readability, structure, duplication, naming, and long-term code health.'
    },
    {
      icon: GitBranch,
      title: 'Workflow-ready',
      description:
        'Review pasted snippets today, then expand into repository-connected and team-based review workflows.'
    }
  ]

  const benefits = [
    'AI-assisted review summaries with issue grouping',
    'Support for common backend and frontend languages',
    'Actionable suggestions instead of vague feedback',
    'Fast browser-based review experience with Monaco editor',
    'History tracking for previous analyses',
    'Built for solo developers, teams, and internal tools'
  ]

  const highlights = [
    {
      icon: Gauge,
      label: 'Faster triage',
      value: 'Prioritize issues quickly'
    },
    {
      icon: Sparkles,
      label: 'Clearer feedback',
      value: 'Readable summaries and next steps'
    },
    {
      icon: CheckCircle2,
      label: 'Practical output',
      value: 'Focused on real code changes'
    }
  ]

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-blue-100 mb-6">
              CodeReview · AI-powered code analysis
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Review code with
              <span className="block text-blue-300">clarity, speed, and confidence</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-10">
              CodeReview helps you catch security risks, performance issues, and
              maintainability problems before they slow your team down.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center gap-2"
              >
                Start free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                View pricing
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-14 text-left">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm p-5"
                >
                  <item.icon className="w-6 h-6 text-blue-300 mb-3" />
                  <p className="text-sm text-blue-200">{item.label}</p>
                  <p className="text-lg font-semibold text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for practical engineering review
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use CodeReview to speed up manual review, improve consistency, and
              surface issues that are easy to miss during day-to-day development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-5" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-7">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Designed to help you move from code submission to decision
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="font-mono text-sm bg-slate-950 text-green-400 p-4 rounded-lg mb-4 overflow-x-auto">
                <pre>{`// Submit code for review
const response = await fetch('/api/review/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: sourceCode,
    language: 'javascript',
    fileName: 'api/auth.js'
  })
})`}</pre>
              </div>
              <p className="text-sm text-gray-600">
                Start with the web UI, then extend into deeper review workflows as your
                team grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to improve your review process?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Create an account and start reviewing code with clearer signals and faster
            feedback.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Create your account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-3">&copy; {new Date().getFullYear()} CodeReview. All rights reserved.</p>
            <p className="text-sm">AI-powered code analysis for modern development teams.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
