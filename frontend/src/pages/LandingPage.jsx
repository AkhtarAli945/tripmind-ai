import { useNavigate } from "react-router-dom";
import {
  Brain,
  Plane,
  Hotel,
  Calendar,
  DollarSign,
  MapPin,
  Play,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Agent System",
    desc: "Multi-agent AI works for the best plan",
  },
  {
    icon: DollarSign,
    title: "Best Deals",
    desc: "Real-time search for the best prices",
  },
  {
    icon: Calendar,
    title: "Smart Itinerary",
    desc: "Personalized plan for your journey",
  },
  {
    icon: MapPin,
    title: "Budget Optimizer",
    desc: "Stay on budget and travel more",
  },
];

const agents = [
  {
    name: "Supervisor Agent",
    desc: "Understands your request and coordinates all agents",
  },
  {
    name: "Flight Agent",
    desc: "Searches and compares flights across airlines",
  },
  { name: "Hotel Agent", desc: "Finds the best hotels for your stay" },
  { name: "Itinerary Agent", desc: "Creates a day-by-day travel plan" },
  { name: "Budget Agent", desc: "Allocates your budget efficiently" },
  {
    name: "Activity Agent",
    desc: "Discovers local attractions and experiences",
  },
  { name: "Local Guide Agent", desc: "Provides insider tips and safety info" },
  {
    name: "Final Planner Agent",
    desc: "Merges everything into your travel package",
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    trips: 2,
    features: ["2 trips/month", "Basic agents", "Email support"],
  },
  {
    name: "Pro",
    price: 19,
    trips: 20,
    features: [
      "20 trips/month",
      "All 8 agents",
      "PDF export",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Business",
    price: 49,
    trips: -1,
    features: ["Unlimited trips", "All agents", "Team access", "24/7 support"],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Navbar */}
      <nav className="border-b border-border sticky top-0 bg-bg/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-bold text-xl">TripMind AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How-it works", "Pricing", "Blog"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-text-muted hover:text-white transition-colors text-sm"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-text-muted hover:text-white text-sm transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary text-sm py-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
              <Brain size={14} />
              Powered by GPT-4o Multi-Agent AI
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              AI Travel Planner
              <br />
              <span className="text-primary">For Perfect Trips</span>
            </h1>
            <p className="text-text-muted text-xl mb-8 leading-relaxed">
              Our AI agents plan your flights, hotels, itinerary and budget in
              seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary text-base px-8 py-3"
              >
                Start Planning <ArrowRight size={18} />
              </button>
              <button className="btn-secondary text-base px-8 py-3">
                <Play size={18} /> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="card p-0 overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 to-accent/10 p-8">
                <div className="bg-card rounded-xl p-4 mb-4 border border-border">
                  <p className="text-text-muted text-xs mb-1">User</p>
                  <p className="text-white text-sm">
                    "Plan a 5-day trip to Dubai from Karachi in July with a
                    budget of $1500"
                  </p>
                </div>
                <div className="space-y-2">
                  {agents.slice(0, 4).map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-card/50 rounded-lg p-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white text-xs">{a.name}</span>
                      <span className="text-text-muted text-xs ml-auto">
                        ✓ Done
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-card grid grid-cols-3 gap-3">
                <div className="text-center">
                  <Plane size={20} className="text-primary mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">
                    Book Flights
                  </p>
                </div>
                <div className="text-center">
                  <Hotel size={20} className="text-accent mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">
                    Find Hotels
                  </p>
                </div>
                <div className="text-center">
                  <MapPin size={20} className="text-green-400 mx-auto mb-1" />
                  <p className="text-white text-xs font-semibold">
                    Smart Itinerary
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            Our multi-agent AI system handles every aspect of your travel
            planning
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-text-muted text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Meet Our AI Agents
          </h2>
          <p className="text-text-muted text-center mb-12">
            8 specialized agents working together for your perfect trip
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="card hover:border-primary/50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">
                  {agent.name}
                </h3>
                <p className="text-text-muted text-xs">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-text-muted text-center mb-12">
            Start for free, upgrade when you need more
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${plan.popular ? "border-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-text-muted">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-text-muted"
                    >
                      <Check size={14} className="text-green-400 shrink-0" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/register")}
                  className={
                    plan.popular
                      ? "btn-primary w-full justify-center"
                      : "btn-secondary w-full justify-center"
                  }
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Plan Your{" "}
            <span className="text-primary">Perfect Trip?</span>
          </h2>
          <p className="text-text-muted text-lg mb-8">
            Join thousands of travelers using AI to plan smarter trips
          </p>
          <button
            onClick={() => navigate("/register")}
            className="btn-primary text-lg px-10 py-4 mx-auto"
          >
            Start Planning Free <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            Latest Travel Articles
          </h2>

          <p className="text-text-muted text-center mb-12">
            Tips, guides and AI-powered travel insights.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card hover:border-primary transition">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
                alt="Travel"
                className="rounded-lg mb-4 h-48 w-full object-cover"
              />

              <h3 className="text-xl font-semibold mb-2">
                8 AI Tips for Better Travel Planning
              </h3>

              <p className="text-text-muted mb-4">
                Discover how AI can save time, reduce travel costs, and create
                personalized itineraries.
              </p>

              <button className="text-primary font-semibold">
                Read More →
              </button>
            </div>

            <div className="card hover:border-primary transition">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
                alt="Beach"
                className="rounded-lg mb-4 h-48 w-full object-cover"
              />

              <h3 className="text-xl font-semibold mb-2">
                Best Budget Destinations in 2026
              </h3>

              <p className="text-text-muted mb-4">
                Explore beautiful destinations without breaking your budget.
              </p>

              <button className="text-primary font-semibold">
                Read More →
              </button>
            </div>

            <div className="card hover:border-primary transition">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
                alt="Adventure"
                className="rounded-lg mb-4 h-48 w-full object-cover"
              />

              <h3 className="text-xl font-semibold mb-2">
                Why Multi-Agent AI is the Future of Travel
              </h3>

              <p className="text-text-muted mb-4">
                Learn how multiple AI agents work together to build perfect
                trips.
              </p>

              <button className="text-primary font-semibold">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm">
          © 2026 TripMind AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
