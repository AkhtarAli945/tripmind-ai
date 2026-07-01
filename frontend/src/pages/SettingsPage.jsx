import { useState } from 'react';
import { Bell, Shield, Globe, Palette, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-border'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    tripReminders: true,
    priceAlerts: false,
    marketingEmails: false,
    twoFactor: false,
    darkMode: true,
  });

  const set = (key) => (val) => {
    setSettings(p => ({ ...p, [key]: val }));
    toast.success('Setting updated');
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-primary" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Row = ({ label, desc, settingKey }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white text-sm">{label}</p>
        {desc && <p className="text-text-muted text-xs">{desc}</p>}
      </div>
      <Toggle value={settings[settingKey]} onChange={set(settingKey)} />
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="space-y-4">
        <Section icon={Bell} title="Notifications">
          <Row label="Email Notifications" desc="Receive updates via email" settingKey="emailNotifications" />
          <Row label="Trip Reminders" desc="Get reminders before your trip" settingKey="tripReminders" />
          <Row label="Price Alerts" desc="Be notified of price drops" settingKey="priceAlerts" />
          <Row label="Marketing Emails" desc="News and promotions" settingKey="marketingEmails" />
        </Section>
        <Section icon={Shield} title="Security">
          <Row label="Two-Factor Authentication" desc="Extra security for your account" settingKey="twoFactor" />
        </Section>
        <Section icon={Palette} title="Appearance">
          <Row label="Dark Mode" desc="Use dark theme" settingKey="darkMode" />
        </Section>
        <div className="card">
          <h3 className="text-white font-semibold mb-4">Danger Zone</h3>
          <button className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-400/60 px-4 py-2 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
