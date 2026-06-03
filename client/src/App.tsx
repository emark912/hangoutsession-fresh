import { Router, Route } from "wouter";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import HangoutDetail from "./pages/HangoutDetail";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import CreateHangout from "./pages/CreateHangout";
import MyHangouts from "./pages/MyHangouts";
import MyBookings from "./pages/MyBookings";
import Bookings from "./pages/Bookings";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/hangout/:id" component={HangoutDetail} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create-hangout" component={CreateHangout} />
      <Route path="/my-hangouts" component={MyHangouts} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/messaging" component={Messaging} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Router>
  );
}
