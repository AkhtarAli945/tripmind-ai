import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { tripsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TRIP_IMAGES = [
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
  'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=400&q=80',
];

const statusColors = {
  upcoming: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  planning: 'bg-yellow-500/20 text-yellow-400',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['trips-dashboard'],
    queryFn: () => tripsApi.getAll({ limit: 4 }).then(r => r.data),
  });

  const trips = data?.trips || [];
  const total = data?.total || 0;

  const stats = [
    { label: 'Total Trips', value: total, icon: MapPin, color: 'text-primary' },
    { label: 'Upcoming', value: trips.filter(t => t.status === 'upcoming').length, icon: Calendar, color: 'text-blue-400' },
    { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Spent', value: `$${trips.reduce((s, t) => s + (t.budget || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-accent' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
        </div>
        <button onClick={() => navigate('/chat')} className="btn-primary">
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} className={color} />
            </div>
            <p className="text-white font-bold text-2xl">{value}</p>
            <p className="text-text-muted text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-xl">Recent Trips</h2>
          <button onClick={() => navigate('/trips')} className="text-primary text-sm hover:underline">View all</button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : trips.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-text-muted mb-4">No trips yet. Start planning your first trip!</p>
            <button onClick={() => navigate('/chat')} className="btn-primary mx-auto">Plan a Trip</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trips.map((trip, idx) => (
              <div
                key={trip._id}
                onClick={() => navigate(`/trips/${trip._id}`)}
                className="card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={TRIP_IMAGES[idx % TRIP_IMAGES.length]}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[trip.status] || statusColors.planning}`}>
                    {trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-white font-semibold text-sm truncate">{trip.title}</p>
                  <p className="text-text-muted text-xs flex items-center gap-1 mt-1">
                    <MapPin size={10} /> {trip.destination}
                  </p>
                  <p className="text-text-muted text-xs mt-1">{trip.duration || '-'} Days • ${trip.budget}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="mt-8">
        <h2 className="text-white font-bold text-xl mb-4">Quick Trip Ideas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { dest: 'Dubai, UAE 🇦🇪', desc: '5 days from $1500', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
            { dest: 'Istanbul, Turkey 🇹🇷', desc: '7 days from $1200', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
            { dest: 'London, UK 🇬🇧', desc: '5 days from $2000', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
          ].map((idea, i) => (
            <div
              key={i}
              onClick={() => navigate('/chat')}
              className="relative h-40 rounded-xl overflow-hidden cursor-pointer group"
            >
              <img src={idea.img} alt={idea.dest} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold">{idea.dest}</p>
                <p className="text-gray-300 text-sm">{idea.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
