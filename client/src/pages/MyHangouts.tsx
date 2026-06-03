import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyHangouts() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">My Hangout Sessions</h1>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any hangout sessions yet.</p>
          <Link href="/create-hangout">
            <Button className="bg-purple-600 hover:bg-purple-700">Create Your First Hangout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
