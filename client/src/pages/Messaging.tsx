import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Messaging() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
            <p className="font-bold">No conversations yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
