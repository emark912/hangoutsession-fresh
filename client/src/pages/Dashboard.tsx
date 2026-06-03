import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { DollarSign, Calendar, Star, Plus } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <Button variant="ghost" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>

        {/* Onboarding Checklist */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Get Started</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked className="w-5 h-5" />
              <span>✓ Email verified</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5" />
              <span>Upload profile photo</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5" />
              <span>Complete profile</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5" />
              <Link href="/create-hangout">
                <span className="text-purple-600 hover:underline cursor-pointer">Create your first hangout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Upcoming Bookings</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Star className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Average Rating</p>
                <p className="text-2xl font-bold">—</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link href="/create-hangout">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Hangout
              </Button>
            </Link>
            <Link href="/my-hangouts">
              <Button variant="outline">My Hangouts</Button>
            </Link>
            <Link href="/my-bookings">
              <Button variant="outline">My Bookings</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
