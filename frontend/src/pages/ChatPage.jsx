import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Plus, MessageSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { chatApi } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import AgentStatusBadge from '../components/common/AgentStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AGENTS = [
  { key: 'supervisor', name: 'Supervisor Agent', task: 'Planning trip...' },
  { key: 'flight', name: 'Flight Agent', task: 'Searching flights...' },
  { key: 'hotel', name: 'Hotel Agent', task: 'Finding hotels...' },
  { key: 'itinerary', name: 'Itinerary Agent', task: 'Creating itinerary...' },
  { key: 'budget', name: 'Budget Agent', task: 'Optimizing budget...' },
  { key: 'activity', name: 'Activity Agent', task: 'Discovering activities...' },
  { key: 'localGuide', name: 'Local Guide Agent', task: 'Gathering local tips...' },
  { key: 'finalPlanner', name: 'Final Agent', task: 'Preparing final plan...' },
];

const SUGGESTIONS = [
  'Plan a 5-day trip to Dubai from Karachi in July with a budget of $1500',
  'Plan a 7-day honeymoon in Paris for 2 people with $3000 budget',
  'Plan a 10-day backpacking trip through Southeast Asia for $800',
  'Plan a 3-day business trip to London with $2000 budget',
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [agentStatuses, setAgentStatuses] = useState({});
  const [isAgentsRunning, setIsAgentsRunning] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleAgentUpdate = useCallback((data) => {
    setAgentStatuses(prev => ({
      ...prev,
      [data.agent]: { status: data.status, name: data.name, task: data.task },
    }));
  }, []);

  const handleAgentComplete = useCallback((data) => {
    setIsAgentsRunning(false);
    setLoading(false);
    if (data.tripId) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: data.summary || 'Your trip has been planned successfully!',
        tripId: data.tripId,
      }]);
    }
  }, []);

  const handleAgentError = useCallback((data) => {
    setIsAgentsRunning(false);
    setLoading(false);
    toast.error('Agent error: ' + data.error);
  }, []);

  useSocket(sessionId, {
    'agent:update': handleAgentUpdate,
    'agent:complete': handleAgentComplete,
    'agent:error': handleAgentError,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setIsAgentsRunning(true);
    setAgentStatuses({});

    try {
      await chatApi.sendMessage({ message: text, sessionId });
    } catch (err) {
      setLoading(false);
      setIsAgentsRunning(false);
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-white font-semibold">AI Travel Planner</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-card rounded-lg transition-colors">
              <MessageSquare size={18} className="text-text-muted" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✈️</span>
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Where do you want to go?</h2>
              <p className="text-text-muted mb-8">Ask our AI agents to plan your perfect trip</p>
              <div className="grid gap-2 max-w-lg mx-auto">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm bg-card border border-border rounded-lg p-3 hover:border-primary/50 text-text-muted hover:text-white transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
              )}
              <div className={`max-w-lg rounded-xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-card border border-border text-white'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.tripId && (
                  <button
                    onClick={() => navigate(`/trips/${msg.tripId}`)}
                    className="mt-3 text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Full Trip Details →
                  </button>
                )}
              </div>
            </div>
          ))}

          {isAgentsRunning && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-text-muted text-sm">AI Agents are working...</span>
                </div>
                <div className="space-y-1.5">
                  {AGENTS.map(agent => {
                    const status = agentStatuses[agent.key];
                    return (
                      <div key={agent.key} className={`flex items-center gap-2 text-xs ${status ? 'text-white' : 'text-text-muted opacity-40'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${status?.status === 'completed' ? 'bg-green-400' : status ? 'bg-primary animate-pulse' : 'bg-gray-600'}`} />
                        <span>{agent.name}</span>
                        <span className="ml-auto text-text-muted">{status?.task || agent.task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-3 bg-card border border-border rounded-xl p-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your trip..."
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-text-muted resize-none focus:outline-none"
              style={{ maxHeight: '120px' }}
            />
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-card-hover rounded-lg transition-colors text-text-muted hover:text-white">
                <Mic size={18} />
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Pipeline Sidebar */}
      <div className="w-72 border-l border-border p-4 overflow-y-auto hidden lg:block">
        <h3 className="text-white font-semibold mb-4">Agent Pipeline</h3>
        <div className="space-y-2">
          {AGENTS.map(agent => {
            const status = agentStatuses[agent.key];
            return (
              <AgentStatusBadge
                key={agent.key}
                agent={agent.key}
                name={agent.name}
                task={status?.task || agent.task}
                status={status?.status || 'pending'}
              />
            );
          })}
        </div>
        {Object.keys(agentStatuses).length === 0 && (
          <p className="text-text-muted text-xs mt-4 text-center">Agents will activate when you start planning</p>
        )}
      </div>
    </div>
  );
}
