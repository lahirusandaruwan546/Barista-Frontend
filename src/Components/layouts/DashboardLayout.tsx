import React from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Users,
  ShoppingBag,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  X,
  Coffee
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slice/authSlice';

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {path: '/', label: 'Home', icon: <Home className="w-5 h-5" />},
    {path: '/customers', label: 'Customers', icon: <Users className="w-5 h-5" />},
    {path: '/items', label: 'Items', icon: <ShoppingBag className="w-5 h-5" />},
    {path: '/orders', label: 'Orders', icon: <ClipboardList className="w-5 h-5" />},
    {path: '/order-details', label: 'Order Details', icon: <FileText className="w-5 h-5" />},
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#3a1c1c] via-[#6b3d2e] to-[#c78d65] text-[#e0e0e0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-[#3E2D34] shadow-md text-[#C4A287] hover:bg-[#6F4E37] z-50"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#2a1a1f]/90 border-r border-[#3e2d34]/50 backdrop-blur-md shadow-lg shadow-[#c792ea]/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-[#C4A287] flex items-center">
              <Coffee className='w-5 h-5 mr-2' /> BARISTA </h1>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-[#6F4E37] text-[#F5F5F5]'
                      : 'text-[#C4A287] hover:bg-[#3E2D34]'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-[#C4A287] rounded-md hover:bg-[#3E2D34] transition-colors border border-[#3e2d34]/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#2a1a1f]/70 backdrop-blur-sm rounded-tl-2xl border-t border-l border-[#3e2d34]/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
