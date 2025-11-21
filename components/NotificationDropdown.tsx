
import React from 'react';
import { Notification } from '../types';
import { Heart } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, notifications, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Updates</h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
                No new notifications
            </div>
        ) : (
            notifications.map(note => (
                <div key={note.id} className={`p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!note.isRead ? 'bg-red-50/30' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img 
                           src={`https://ui-avatars.com/api/?name=${note.senderName}&background=random`} 
                           alt={note.senderName} 
                           className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm text-gray-900">
                            <span className="font-bold">{note.senderName}</span> {note.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                        <img src={note.pinImage} alt="pin" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-red-500 p-0.5 rounded-tl-md">
                            <Heart size={8} className="text-white fill-current" />
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
