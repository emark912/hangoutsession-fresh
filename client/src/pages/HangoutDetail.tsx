import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, Clock, Users, Star } from "lucide-react";

export default function HangoutDetail() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/browse">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop" alt="Hangout" className="w-full h-96 object-cover rounded-lg mb-8" />
        <h1 className="text-4xl font-bold mb-4">Coffee & Conversation</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span>New York, NY</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>2 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Max 4 guests</span>
          </div>
        </div>
        <p className="text-gray-600 mb-8">Join me for a casual coffee chat. Perfect for networking, making new friends, or just having a great conversation.</p>
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-lg mb-2">$25 per person</h3>
          <Link href="/booking">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 py-3">Request to Book</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
