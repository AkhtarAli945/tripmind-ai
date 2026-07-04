// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';

// export default function AppLayout() {
//   return (
//     <div className="flex min-h-screen bg-bg">
//       <Sidebar />
//       <main className="flex-1 overflow-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }




import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border sticky top-0 bg-card z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-bold">TripMind AI</span>
        </div>

        <main className="flex-1 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}