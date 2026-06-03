import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Tell us about yourself" rows={4} />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
