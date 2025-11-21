
import React, { useState } from 'react';
import { Upload, MoreHorizontal, Share2, Trash2, Edit2, Heart } from 'lucide-react';
import { Pin, User } from '../types';

interface PinCardProps {
  pin: Pin;
  user: User | null;
  onDelete: (id: string) => void;
  onEdit: (pin: Pin) => void;
  onLike: (id: string) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, user, onDelete, onEdit, onLike }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Permissions
  const isOwner = user?.id === pin.userId;
  const isAdmin = user?.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const isLiked = user && pin.likedBy?.includes(user.id);

  return (
    <div 
      className="relative mb-4 break-inside-avoid group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden cursor-zoom-in">
        <img 
          src={pin.imageUrl} 
          alt={pin.title} 
          className="w-full object-cover transform transition-transform duration-200" 
          style={{ minHeight: '150px' }}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex flex-col justify-between p-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between items-start">
                <span className="text-white font-medium text-sm truncate max-w-[120px] drop-shadow-md">{pin.title}</span>
                {/* Action Buttons for Admins/Owners */}
                {canEdit && (
                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(pin); }}
                            className="bg-white/90 text-black p-2 rounded-full hover:bg-white transition-colors"
                            title="Edit Pin"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); if(confirm('Delete this pin?')) onDelete(pin.id); }}
                            className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-white transition-colors"
                            title="Delete Pin"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex justify-end gap-2">
                <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Share2 size={16} />
                </button>
                <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
      </div>
      
      <div className="mt-2 px-1">
         <div className="flex justify-between items-start">
            <p className="font-semibold text-sm text-gray-900 leading-tight flex-grow">{pin.title}</p>
            <button 
                onClick={() => onLike(pin.id)} 
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                {pin.likedBy?.length || 0}
            </button>
         </div>
         <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${pin.author}&background=random`} alt={pin.author} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-gray-600">{pin.author}</p>
         </div>
      </div>
    </div>
  );
};
