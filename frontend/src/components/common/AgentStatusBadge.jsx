import { Check, Loader2, Clock } from 'lucide-react';

const agentColors = {
  supervisor: 'from-purple-500 to-purple-700',
  flight: 'from-blue-500 to-blue-700',
  hotel: 'from-green-500 to-green-700',
  itinerary: 'from-yellow-500 to-yellow-700',
  budget: 'from-orange-500 to-orange-700',
  activity: 'from-pink-500 to-pink-700',
  localGuide: 'from-teal-500 to-teal-700',
  finalPlanner: 'from-indigo-500 to-indigo-700',
};

const agentInitials = {
  supervisor: 'SV', flight: 'FA', hotel: 'HA', itinerary: 'IA',
  budget: 'BA', activity: 'AC', localGuide: 'LG', finalPlanner: 'FP',
};

export default function AgentStatusBadge({ agent, name, task, status }) {
  const gradient = agentColors[agent] || 'from-gray-500 to-gray-700';
  const initials = agentInitials[agent] || '??';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
      status === 'completed' ? 'border-green-500/30 bg-green-500/5' :
      status === 'running' ? 'border-primary/30 bg-primary/5' :
      'border-border bg-transparent opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
        <span className="text-white text-xs font-bold">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{name}</p>
        <p className="text-text-muted text-xs truncate">{task}</p>
      </div>
      <div className="shrink-0">
        {status === 'completed' ? <Check size={14} className="text-green-400" /> :
         status === 'running' ? <Loader2 size={14} className="text-primary animate-spin" /> :
         <Clock size={14} className="text-text-muted" />}
      </div>
    </div>
  );
}
