// import { NavLink, useNavigate } from 'react-router-dom';
// import { MessageSquare, LayoutDashboard, Map, BookOpen, User, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const navItems = [
//   { to: '/chat', icon: MessageSquare, label: 'Chat' },
//   { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { to: '/trips', icon: Map, label: 'My Trips' },
//   { to: '/bookings', icon: BookOpen, label: 'Bookings' },
//   { to: '/profile', icon: User, label: 'Profile' },
//   { to: '/settings', icon: Settings, label: 'Settings' },
// ];

// export default function Sidebar() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/');
//   };

//   return (
//     <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 shrink-0">
//       {/* Logo */}
//       <div className="p-5 border-b border-border">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-sm">T</span>
//           </div>
//           <span className="text-white font-bold text-lg">TripMind AI</span>
//         </div>
//       </div>

//       {/* New Trip Button */}
//       <div className="p-4">
//         <button
//           onClick={() => navigate('/chat')}
//           className="w-full btn-primary justify-center text-sm"
//         >
//           <Plus size={16} />
//           New Trip
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
//         {navItems.map(({ to, icon: Icon, label }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? 'active' : ''}`
//             }
//           >
//             <Icon size={18} />
//             <span className="text-sm font-medium">{label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Bottom */}
//       <div className="p-3 border-t border-border space-y-1">
//         <button className="sidebar-link w-full">
//           <HelpCircle size={18} />
//           <span className="text-sm font-medium">Help Center</span>
//         </button>
//         <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
//           <LogOut size={18} />
//           <span className="text-sm font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }




import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Map, BookOpen, User, Settings, HelpCircle, LogOut, Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/bookings', icon: BookOpen, label: 'Bookings' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border
          flex flex-col shrink-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-bold text-lg">TripMind AI</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-text-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => { navigate('/chat'); handleNavClick(); }}
            className="w-full btn-primary justify-center text-sm"
          >
            <Plus size={16} />
            New Trip
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <button className="sidebar-link w-full">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Help Center</span>
          </button>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}