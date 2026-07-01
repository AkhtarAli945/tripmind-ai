import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, CreditCard, Edit2, Check } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CURRENCIES = ['USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'AED - UAE Dirham', 'PKR - Pakistani Rupee'];
const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish', 'Urdu'];
const BUDGET_RANGES = ['$500 - $1000', '$1000 - $2000', '$2000 - $5000', '$5000+'];
const TRAVEL_STYLES = ['Budget', 'Comfort', 'Luxury', 'Adventure', 'Business'];
const SEAT_PREFS = ['Window', 'Aisle', 'Middle', 'No Preference'];
const HOTEL_PREFS = ['3 Star', '4 Star', '5 Star', 'Boutique', 'Hostel'];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    preferences: {
      currency: user?.preferences?.currency || 'USD - US Dollar',
      language: user?.preferences?.language || 'English',
      budgetRange: user?.preferences?.budgetRange || '$1000 - $2000',
      travelStyle: user?.preferences?.travelStyle || 'Comfort',
      seatPreference: user?.preferences?.seatPreference || 'Window',
      hotelPreference: user?.preferences?.hotelPreference || '4 Star',
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, field, options }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-text-muted text-sm">{label}</span>
      {editing && options ? (
        <select
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary"
          value={form.preferences[field]}
          onChange={e => setForm(p => ({ ...p, preferences: { ...p.preferences, [field]: e.target.value } }))}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <span className="text-white text-sm font-medium">{form.preferences[field]}</span>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
          <h2 className="text-white font-bold text-lg">{user?.name}</h2>
          <p className="text-text-muted text-sm">{user?.email}</p>
          <p className="text-text-muted text-xs mt-1">Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={loading}
            className="btn-primary w-full justify-center mt-4 text-sm"
          >
            {loading ? <LoadingSpinner size="sm" /> : editing ? <><Check size={14} /> Save Profile</> : <><Edit2 size={14} /> Edit Profile</>}
          </button>
          {editing && (
            <button onClick={() => setEditing(false)} className="btn-secondary w-full justify-center mt-2 text-sm">
              Cancel
            </button>
          )}
        </div>

        {/* Preferences */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Preferences</h3>
              {editing && <span className="text-primary text-xs">Editing...</span>}
            </div>
            <Field label="Currency" field="currency" options={CURRENCIES} />
            <Field label="Language" field="language" options={LANGUAGES} />
            <Field label="Budget Range" field="budgetRange" options={BUDGET_RANGES} />
            <Field label="Travel Style" field="travelStyle" options={TRAVEL_STYLES} />
            <Field label="Hotel Preference" field="hotelPreference" options={HOTEL_PREFS} />
            <Field label="Seat Preference" field="seatPreference" options={SEAT_PREFS} />
          </div>

          {/* Payment Methods */}
          <div className="card">
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            {user?.paymentMethods?.length > 0 ? (
              user.paymentMethods.map((pm, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-card-hover rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-primary" />
                    <div>
                      <p className="text-white text-sm">•••• •••• •••• {pm.last4}</p>
                      <p className="text-text-muted text-xs">Expires {pm.expiry}</p>
                    </div>
                  </div>
                  {pm.isDefault && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Default</span>}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CreditCard size={32} className="text-text-muted mx-auto mb-2" />
                <p className="text-text-muted text-sm">No payment methods added</p>
                <button className="btn-primary text-sm mt-3 mx-auto">Add Payment Method</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
