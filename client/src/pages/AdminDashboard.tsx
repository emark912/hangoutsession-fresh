import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-gray-600 text-sm">Flagged Content</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-gray-600 text-sm">Platform Revenue</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Moderation Tools</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">Manage Users</Button>
            <Button variant="outline" className="w-full justify-start">Review Hangouts</Button>
            <Button variant="outline" className="w-full justify-start">Handle Disputes</Button>
            <Button variant="outline" className="w-full justify-start">View Reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
