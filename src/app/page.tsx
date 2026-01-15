import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">CareerBuilder</span>
          </div>
          <Link href="/login">
            <Button>Recruiter Login</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Beautiful Careers Pages
            <span className="text-blue-600"> in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create branded careers pages that tell your company&apos;s story and help candidates discover their next opportunity.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Button>
            </Link>
            <Link href="/techcorp/careers">
              <Button size="lg" variant="outline">
                View Demo Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Brand Customization</h3>
            <p className="text-gray-600">
              Match your careers page to your brand with custom colors, logos, and themes.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Drag & Drop Editor</h3>
            <p className="text-gray-600">
              Easily add and reorder sections like About Us, Benefits, and Culture Videos.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Job Listings</h3>
            <p className="text-gray-600">
              Candidates can browse, filter, and search open positions with ease.
            </p>
          </div>
        </div>

        {/* Demo Companies */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Explore Demo Companies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/techcorp/careers"
              className="p-6 bg-white rounded-xl border hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  TC
                </div>
                <div>
                  <h3 className="font-semibold">TechCorp</h3>
                  <p className="text-sm text-gray-500">50+ open positions</p>
                </div>
              </div>
            </Link>
            <Link
              href="/acme-inc/careers"
              className="p-6 bg-white rounded-xl border hover:border-red-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold">Acme Inc</h3>
                  <p className="text-sm text-gray-500">50+ open positions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-gray-500 text-sm">
          <p>Careers Page Builder - Built for WhiteCarrot Assignment</p>
        </div>
      </footer>
    </div>
  );
}
