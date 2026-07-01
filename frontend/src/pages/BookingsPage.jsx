import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const MOCK_BOOKINGS = [
  { id: 1, type: 'flight', title: 'Emirates EK607', detail: 'KHI → DXB • 9:30 AM', status: 'confirmed', price: 450, date: '10 Jul 2025' },
  { id: 2, type: 'hotel', title: 'Marina View Hotel', detail: '5 Nights • Dubai Marina', status: 'confirmed', price: 600, date: '10-14 Jul 2025' },
  { id: 3, type: 'flight', title: 'Qatar Airways QR584', detail: 'KHI → IST • 10:15 AM', status: 'pending', price: 520, date: '22 Aug 2025' },
  { id: 4, type: 'hotel', title: 'Hilton Istanbul', detail: '7 Nights • City Center', status: 'pending', price: 840, date: '22-29 Aug 2025' },
];

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Confirmed' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Cancelled' },
};

export default function BookingsPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>
      <div className="space-y-4">
        {MOCK_BOOKINGS.map(booking => {
          const status = statusConfig[booking.status];
          const StatusIcon = status.icon;
          return (
            <div key={booking.id} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.type === 'flight' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                {booking.type === 'flight' ? <Plane size={20} className="text-blue-400" /> : <Hotel size={20} className="text-purple-400" />}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{booking.title}</p>
                <p className="text-text-muted text-sm">{booking.detail}</p>
                <p className="text-text-muted text-xs mt-0.5 flex items-center gap-1"><Calendar size={10} /> {booking.date}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">${booking.price}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${status.bg} ${status.color}`}>
                  <StatusIcon size={10} /> {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
