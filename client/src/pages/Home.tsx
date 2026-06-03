import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, ChevronRight, Calendar, Share2, DollarSign } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hangouts, setHangouts] = useState<any[]>([]);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
      title: "Coffee & Conversation",
      host: "Sarah",
      price: "$25/person",
      rating: "4.9 ⭐",
    },
    {
      image: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=1200&h=600&fit=crop",
      title: "Fitness Training",
      host: "Mike",
      price: "$40/person",
      rating: "4.8 ⭐",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/assets/hangout-logo.webp" alt="HangoutSession" className="w-10 h-10" />
            <span className="font-bold text-xl text-gray-900">HangoutSession</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/browse">
                  <Button variant="ghost">Browse</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-5xl font-bold mb-4">Get Paid to Host Hangout Sessions</h1>
            <p className="text-xl mb-8">Just be yourself — Get Booked to hangout face to face</p>
            <div className="flex gap-4 justify-center">
              <Link href="/browse">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">Browse Experiences</Button>
              </Link>
              <Link href={isAuthenticated ? "/create-hangout" : "/signup"}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                  Host Hangouts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Hangouts</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-96 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                <h3 className="text-2xl font-bold">{slides[currentSlide].title}</h3>
                <p className="text-lg">{slides[currentSlide].host} • {slides[currentSlide].price}</p>
                <p className="text-sm">{slides[currentSlide].rating}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create Hangout Sessions</h3>
              <p className="text-gray-600">Host unique in-person experiences and set your own price</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Promote Your Hangout Link</h3>
              <p className="text-gray-600">Share your personal link and get direct bookings</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Paid!</h3>
              <p className="text-gray-600">Earn 80% of every booking, platform takes 20%</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg mb-8">Join thousands of hosts earning money by being themselves</p>
          <Link href={isAuthenticated ? "/create-hangout" : "/signup"}>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Create Your First Hangout
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 HangoutSession. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
