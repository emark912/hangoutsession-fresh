import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Bookings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/browse">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">Booking Confirmation</h1>
        <div className="bg-white rounded-lg p-8">
          <p className="text-green-600 font-bold mb-4">✓ Your booking has been confirmed!</p>
          <p className="text-gray-600 mb-8">You will receive a confirmation email shortly. Check your dashboard for more details.</p>
          <Link href="/my-bookings">
            <Button className="bg-purple-600 hover:bg-purple-700">View My Bookings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
