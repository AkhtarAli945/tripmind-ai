import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { tripsApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TABS = ['All Trips', 'Upcoming', 'Completed', 'Cancelled'];

const statusColors = {
  upcoming: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  planning: 'bg-yellow-500/20 text-yellow-400',
};

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState('All Trips');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const statusFilter = activeTab === 'All Trips' ? 'all' : activeTab.toLowerCase();

  const { data, isLoading } = useQuery({
    queryKey: ['trips', statusFilter, search],
    queryFn: () => tripsApi.getAll({ status: statusFilter, search }).then(r => r.data),
  });

  const trips = data?.trips || [];

  const TRIP_IMAGES = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&q=80',
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Trips</h1>
        <button onClick={() => navigate('/chat')} className="btn-primary">
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1 mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-primary text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="input-field pl-9"
          placeholder="Search trips..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">No trips found</p>
          <button onClick={() => navigate('/chat')} className="btn-primary mx-auto">Plan a Trip</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, idx) => (
            <div
              key={trip._id}
              className="card p-0 overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/trips/${trip._id}`)}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={TRIP_IMAGES[idx % TRIP_IMAGES.length]}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${statusColors[trip.status] || statusColors.planning}`}>
                  {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{trip.title}</h3>
                    <p className="text-text-muted text-xs mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {trip.destination}
                    </p>
                  </div>
                  <button className="p-1 hover:bg-card-hover rounded-lg" onClick={e => e.stopPropagation()}>
                    <MoreVertical size={14} className="text-text-muted" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {trip.duration || '-'} Days</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {trip.travelers || 1}</span>
                  <span className="flex items-center gap-1"><DollarSign size={10} /> ${trip.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
