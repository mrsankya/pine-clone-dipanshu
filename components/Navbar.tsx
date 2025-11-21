
import React, { useState } from 'react';
import { Search, Bell, MessageCircle, ChevronDown, Upload, Menu, LogOut, Shield } from 'lucide-react';
import { User, Notification } from '../types';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenUpload: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  onOpenUpload, 
  user, 
  onLoginClick, 
  onLogout,
  onOpenAdmin,
  notifications,
  unreadCount,
  onMarkRead
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleNotifClick = () => {
      setIsNotifOpen(!isNotifOpen);
      if (!isNotifOpen) {
          onMarkRead();
      }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4 max-w-[2000px] mx-auto">
        
        {/* Logo & Primary Nav */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer text-primary">
             <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.567-.992 3.995-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
             </svg>
          </div>
          <button className="hidden md:block px-4 py-3 bg-black text-white rounded-3xl font-semibold text-base">Home</button>
          <button onClick={onOpenUpload} className="hidden md:block px-4 py-3 font-semibold text-base hover:bg-gray-100 rounded-3xl transition-colors">Create</button>
          
          {user?.role === 'admin' && (
            <button onClick={onOpenAdmin} className="hidden md:flex items-center gap-1 px-4 py-3 font-semibold text-base text-red-600 bg-red-50 hover:bg-red-100 rounded-3xl transition-colors border border-red-200">
               <Shield size={18} />
               Admin Panel
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-grow relative group mx-2 md:mx-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gray-900">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary hover:bg-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none rounded-3xl py-3 pl-10 pr-4 transition-all text-base"
          />
        </div>

        {/* Right Icons / Auth */}
        <div className="flex items-center gap-2 flex-shrink-0 text-gray-500">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                <div className="relative">
                    <button 
                        onClick={handleNotifClick}
                        className="p-3 hover:bg-gray-100 rounded-full relative"
                    >
                        <Bell size={24} className={isNotifOpen ? 'fill-current text-black' : ''} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <NotificationDropdown 
                        isOpen={isNotifOpen} 
                        notifications={notifications} 
                        onClose={() => setIsNotifOpen(false)} 
                    />
                </div>

                <button className="p-3 hover:bg-gray-100 rounded-full">
                  <MessageCircle size={24} />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1 hover:bg-gray-100 rounded-full flex items-center gap-1"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={20} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl rounded-xl p-2 border border-gray-100 flex flex-col">
                      <div className="p-2 border-b border-gray-100 mb-1">
                        <p className="font-semibold text-sm text-gray-900">Currently in</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-gray-700">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                             <p className="text-sm font-bold truncate">{user.username}</p>
                             <p className="text-xs text-gray-500 truncate">{user.email}</p>
                             {user.role === 'admin' && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Admin</span>
                             )}
                          </div>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <button onClick={() => { onOpenAdmin(); setIsProfileMenuOpen(false); }} className="text-left px-2 py-3 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-2 text-red-600">
                            <Shield size={16} /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={onLogout} className="text-left px-2 py-3 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-2">
                         <LogOut size={16} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
               <button onClick={onLoginClick} className="px-4 py-2 bg-primary text-white rounded-3xl font-bold hover:bg-red-700 transition-colors">Log in</button>
               <button onClick={onLoginClick} className="px-4 py-2 bg-gray-100 text-black rounded-3xl font-bold hover:bg-gray-200 transition-colors">Sign up</button>
            </div>
          )}

           {/* Mobile Menu Toggle */}
           <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
           <button className="px-4 py-3 bg-black text-white rounded-2xl font-semibold text-base text-left">Home</button>
           <button onClick={() => {onOpenUpload(); setIsMenuOpen(false);}} className="px-4 py-3 bg-secondary text-black rounded-2xl font-semibold text-base flex items-center gap-2">
             <Upload size={18} /> Create Pin
           </button>
           
           {user && (
             <button onClick={() => {handleNotifClick(); setIsMenuOpen(false);}} className="px-4 py-3 bg-white hover:bg-gray-100 text-black rounded-2xl font-semibold text-base flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <Bell size={18} /> Notifications
                </div>
                {unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount} new
                    </span>
                )}
             </button>
           )}

           {user?.role === 'admin' && (
             <button onClick={() => {onOpenAdmin(); setIsMenuOpen(false);}} className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-semibold text-base flex items-center gap-2">
               <Shield size={18} /> Admin Panel
             </button>
           )}

           {!user ? (
             <button onClick={() => {onLoginClick(); setIsMenuOpen(false);}} className="px-4 py-3 bg-primary text-white rounded-2xl font-semibold text-base text-left mt-2">Log in / Sign up</button>
           ) : (
             <button onClick={() => {onLogout(); setIsMenuOpen(false);}} className="px-4 py-3 bg-gray-100 text-black rounded-2xl font-semibold text-base text-left mt-2 flex items-center gap-2">
                <LogOut size={18} /> Log out ({user.username})
             </button>
           )}
        </div>
      )}
    </nav>
  );
};
