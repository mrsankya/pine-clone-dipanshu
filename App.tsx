
import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MasonryGrid } from './components/MasonryGrid';
import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { EditPinModal } from './components/EditPinModal';
import { usePins } from './hooks/usePins';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { Pin } from './types';

function App() {
  const { pins, loading: pinsLoading, addPin, deletePin, updatePin, likePin, isBackendAvailable } = usePins();
  const { user, login, register, logout } = useAuth(isBackendAvailable);
  const { notifications, unreadCount, markAllAsRead } = useNotifications(user, isBackendAvailable);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingPin, setEditingPin] = useState<Pin | null>(null);

  const filteredPins = useMemo(() => {
    return pins.filter(pin => 
      pin.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pin.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pins, searchTerm]);

  const handleCreateClick = () => {
    if (user) {
      setIsUploadOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleEditClick = (pin: Pin) => {
      setEditingPin(pin);
  };

  const handleSaveEdit = (id: string, title: string) => {
      if (user) {
          updatePin(id, title, user);
      }
  };

  const handleDelete = (id: string) => {
      if (user) {
          deletePin(id, user);
      }
  };

  const handleLike = (id: string) => {
    if (user) {
      likePin(id, user);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onOpenUpload={handleCreateClick}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={logout}
        onOpenAdmin={() => setIsAdminOpen(true)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={markAllAsRead}
      />

      <main className="pt-24 pb-10">
        {isBackendAvailable ? (
             <div className="text-center mb-4 text-xs text-green-600 bg-green-50 py-1">
                • Connected to Local Server •
             </div>
        ) : (
            <div className="text-center mb-4 text-xs text-gray-400 bg-gray-50 py-1">
                • Offline Mode (Local Storage) •
             </div>
        )}
        
        {pinsLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <MasonryGrid 
            pins={filteredPins} 
            user={user}
            onDelete={handleDelete}
            onEdit={handleEditClick}
            onLike={handleLike}
          />
        )}
      </main>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUpload={(title, file) => user && addPin(title, file, user)}
        user={user}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={login}
        onRegister={register}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pins={pins}
        onDelete={handleDelete}
        onEdit={handleEditClick}
      />

      <EditPinModal 
        isOpen={!!editingPin}
        onClose={() => setEditingPin(null)}
        pin={editingPin}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default App;
