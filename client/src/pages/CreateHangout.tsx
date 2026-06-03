import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function CreateHangout() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    duration: 1,
    maxGuests: 1,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">Create Your Hangout Session</h1>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded ${s <= step ? "bg-purple-600" : "bg-gray-300"}`} />
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg p-8 mb-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">What's the title of your hangout?</h2>
              <Input placeholder="e.g., Coffee & Conversation" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="mb-6" />
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Describe your hangout</h2>
              <textarea placeholder="Tell guests what to expect..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg mb-6" rows={5} />
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select a category</h2>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg">
                <option>Adventure</option>
                <option>Mentorship</option>
                <option>Food & Dining</option>
                <option>Fitness</option>
              </select>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Set your price</h2>
              <Input type="number" placeholder="Price per guest" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="mb-6" />
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Duration & Capacity</h2>
              <div className="space-y-4">
                <div>
                  <label>Duration (hours)</label>
                  <Input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label>Max Guests</label>
                  <Input type="number" value={formData.maxGuests} onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>
          )}
          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review & Publish</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Price:</strong> ${formData.price}/person</p>
                <p><strong>Duration:</strong> {formData.duration} hours</p>
                <p><strong>Max Guests:</strong> {formData.maxGuests}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 6 && (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {step === 6 && (
            <Button className="bg-purple-600 hover:bg-purple-700">Publish Hangout</Button>
          )}
        </div>
      </div>
    </div>
  );
}
