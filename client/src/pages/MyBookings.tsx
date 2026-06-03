import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">No bookings yet.</p>
        </div>
      </div>
    </div>
  );
}
