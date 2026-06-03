import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, Star } from "lucide-react";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Mock hangouts data
  const hangouts = [
    {
      id: "1",
      title: "Coffee & Conversation",
      host: "Sarah",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      price: 25,
      duration: 2,
      location: "New York, NY",
      rating: 4.9,
      reviews: 48,
    },
    {
      id: "2",
      title: "Fitness Training",
      host: "Mike",
      image: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=300&fit=crop",
      price: 40,
      duration: 1,
      location: "Los Angeles, CA",
      rating: 4.8,
      reviews: 32,
    },
    {
      id: "3",
      title: "Photography Walk",
      host: "Alex",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      price: 35,
      duration: 3,
      location: "San Francisco, CA",
      rating: 4.7,
      reviews: 25,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Browse Hangout Sessions</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search hangouts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              <option value="adventure">Adventure</option>
              <option value="mentorship">Mentorship</option>
              <option value="food">Food & Dining</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg h-fit">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Price Range</label>
                <div className="mt-2 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    ${minPrice} - ${maxPrice}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Ratings</option>
                  <option>4.5+</option>
                  <option>4.0+</option>
                  <option>3.5+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hangouts Grid */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hangouts.map((hangout) => (
                <Link key={hangout.id} href={`/hangout/${hangout.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <img src={hangout.image} alt={hangout.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{hangout.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">by {hangout.host}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {hangout.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {hangout.duration} hours
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {hangout.rating} ({hangout.reviews} reviews)
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-purple-600">${hangout.price}</span>
                        <Button className="bg-purple-600 hover:bg-purple-700">Book</Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
