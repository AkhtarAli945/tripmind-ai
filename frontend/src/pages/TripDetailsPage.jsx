import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Share2, MapPin, Users, Calendar, DollarSign, Plane, Hotel, Clock, Check } from 'lucide-react';
import { tripsApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TABS = ['Overview', 'Flights', 'Hotels', 'Itinerary', 'Budget', 'Bookings'];

const BUDGET_COLORS = ['#6C47FF', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const { data, isLoading } = useQuery({
    queryKey: ['trip-details', id],
    queryFn: () => tripsApi.getDetails(id).then(r => r.data),
  });

  if (isLoading) return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;

  const { trip, flights = [], hotels = [], activities = [], itinerary = [], budget } = data || {};

  const budgetChartData = budget ? [
    { name: 'Flights', value: budget.allocation?.flights || 0 },
    { name: 'Hotels', value: budget.allocation?.hotels || 0 },
    { name: 'Activities', value: budget.allocation?.activities || 0 },
    { name: 'Food', value: budget.allocation?.food || 0 },
    { name: 'Transport', value: budget.allocation?.transport || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between sticky top-0 bg-bg z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Chat
        </button>
        <h2 className="text-white font-semibold">{trip?.title} • {trip?.duration} Days</h2>
        <button className="flex items-center gap-2 text-text-muted hover:text-white text-sm transition-colors">
          <Share2 size={16} /> Share Trip
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-4 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Overview */}
        {activeTab === 'Overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Info */}
              <div className="card grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-text-muted text-xs mb-1">Destination</p>
                  <p className="text-white font-semibold flex items-center gap-1"><MapPin size={12} className="text-primary" /> {trip?.destination}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Duration</p>
                  <p className="text-white font-semibold">{trip?.duration} Days</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Travelers</p>
                  <p className="text-white font-semibold flex items-center gap-1"><Users size={12} /> {trip?.travelers} Adults</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Total Budget</p>
                  <p className="text-white font-semibold">${trip?.budget}</p>
                </div>
              </div>

              {/* Best Flights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Best Flights</h3>
                  <button onClick={() => setActiveTab('Flights')} className="text-primary text-sm hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {flights.slice(0, 2).map((f, i) => (
                    <div key={i} className="card flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plane size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{f.airline}</p>
                        <p className="text-text-muted text-xs">{f.departure?.time} → {f.arrival?.time} • {f.duration} • ⭐ {f.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${f.price}</p>
                        <p className="text-text-muted text-xs">Round trip</p>
                      </div>
                      <button className="btn-primary text-xs px-3 py-1.5">Select</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Hotels */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Top Hotels</h3>
                  <button onClick={() => setActiveTab('Hotels')} className="text-primary text-sm hover:underline">View all</button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {hotels.slice(0, 2).map((h, i) => (
                    <div key={i} className="card">
                      <div className="h-28 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                        <Hotel size={32} className="text-primary/50" />
                      </div>
                      <p className="text-white font-semibold text-sm">{h.name}</p>
                      <p className="text-text-muted text-xs mb-2">{h.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 text-xs">⭐ {h.rating} ({h.reviewCount?.toLocaleString()})</span>
                        <span className="text-white font-bold text-sm">${h.pricePerNight}/night</span>
                      </div>
                      <button className="btn-primary w-full justify-center text-xs mt-3 py-2">Select</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Summary Sidebar */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-white font-semibold mb-4">Budget Summary</h3>
                {budgetChartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {budgetChartData.map((_, idx) => (
                          <Cell key={idx} fill={BUDGET_COLORS[idx % BUDGET_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: '#12182B', border: '1px solid #1e2a45', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="text-center mb-4">
                  <p className="text-text-muted text-xs">Total Budget</p>
                  <p className="text-white font-bold text-2xl">${budget?.totalBudget || trip?.budget}</p>
                </div>
                <div className="space-y-2">
                  {budgetChartData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: BUDGET_COLORS[i] }} />
                        <span className="text-text-muted">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">${item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between">
                  <span className="text-text-muted">Remaining</span>
                  <span className="text-green-400 font-bold">${budget?.remaining || 0}</span>
                </div>
              </div>

              {/* Trip Info */}
              <div className="card">
                <h3 className="text-white font-semibold mb-3">Trip Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Destination</span><span className="text-white">{trip?.destination}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Duration</span><span className="text-white">{trip?.duration} Days / {trip?.duration - 1} Nights</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Travelers</span><span className="text-white">{trip?.travelers} Adults</span></div>
                </div>
                <button className="btn-primary w-full justify-center mt-4">Confirm & Book Trip</button>
              </div>
            </div>
          </div>
        )}

        {/* Flights */}
        {activeTab === 'Flights' && (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-xl">Available Flights</h2>
            {flights.map((f, i) => (
              <div key={i} className="card flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Plane size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-bold">{f.airline}</p>
                  <p className="text-text-muted text-xs">{f.flightNumber} • {f.cabinClass}</p>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center">
                    <p className="text-white font-semibold">{f.departure?.time}</p>
                    <p className="text-text-muted text-xs">{f.departure?.code || f.departure?.city}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-text-muted text-xs">{f.duration}</p>
                    <div className="border-t border-border mx-4 my-1" />
                    <p className="text-text-muted text-xs">{f.stopLabel || 'Non-stop'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{f.arrival?.time}</p>
                    <p className="text-text-muted text-xs">{f.arrival?.code || f.arrival?.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">${f.price}</p>
                  <p className="text-text-muted text-xs">⭐ {f.rating}</p>
                </div>
                <button className="btn-primary text-sm">Select</button>
              </div>
            ))}
          </div>
        )}

        {/* Hotels */}
        {activeTab === 'Hotels' && (
          <div className="space-y-4">
            <h2 className="text-white font-bold text-xl">Available Hotels</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((h, i) => (
                <div key={i} className="card p-0 overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <Hotel size={40} className="text-primary/40" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold">{h.name}</h3>
                    <p className="text-text-muted text-sm">{h.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-yellow-400 text-sm">⭐ {h.rating}</span>
                      <span className="text-white font-bold">${h.pricePerNight}/night</span>
                    </div>
                    {h.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {h.amenities.slice(0, 3).map(a => (
                          <span key={a} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    )}
                    <button className="btn-primary w-full justify-center mt-3 text-sm py-2">Select Hotel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {activeTab === 'Itinerary' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl">Day-by-Day Itinerary</h2>
              <button className="btn-secondary text-sm py-2">📄 Download PDF</button>
            </div>
            {/* Day Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6">
              {itinerary.map(day => (
                <button key={day.day} className="shrink-0 px-4 py-2 bg-card border border-border rounded-lg text-sm text-white hover:border-primary transition-colors">
                  Day {day.day}
                </button>
              ))}
            </div>
            <div className="space-y-8">
              {itinerary.map(day => (
                <div key={day.day}>
                  <h3 className="text-white font-bold mb-4">Day {day.day} — {day.theme}</h3>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                    <div className="space-y-4">
                      {day.items?.map((item, i) => (
                        <div key={i} className="flex gap-4 pl-14 relative">
                          <div className="absolute left-4 top-3 w-4 h-4 rounded-full border-2 border-primary bg-bg" />
                          <div className="w-20 shrink-0">
                            <p className="text-primary text-xs font-semibold">{item.time}</p>
                          </div>
                          <div className="card flex-1">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Clock size={16} className="text-primary" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">{item.activity}</p>
                                <p className="text-text-muted text-sm">{item.description}</p>
                                <div className="flex gap-4 mt-2 text-xs text-text-muted">
                                  {item.location && <span>📍 {item.location}</span>}
                                  {item.duration && <span>⏱ {item.duration}</span>}
                                  {item.cost > 0 && <span>💰 ${item.cost}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        {activeTab === 'Budget' && budget && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-white font-bold text-xl mb-6">Budget Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                    {budgetChartData.map((_, idx) => <Cell key={idx} fill={BUDGET_COLORS[idx]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: '#12182B', border: '1px solid #1e2a45', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="text-white font-bold mb-6">Allocation Details</h3>
              <div className="space-y-4">
                {Object.entries(budget.allocation || {}).map(([key, val], i) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-muted capitalize">{key}</span>
                      <span className="text-white font-semibold">${val}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(val / budget.totalBudget) * 100}%`, background: BUDGET_COLORS[i] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                <div>
                  <p className="text-text-muted text-sm">Remaining Budget</p>
                  <p className="text-green-400 font-bold text-xl">${budget.remaining}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-sm">Total Budget</p>
                  <p className="text-white font-bold text-xl">${budget.totalBudget}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
