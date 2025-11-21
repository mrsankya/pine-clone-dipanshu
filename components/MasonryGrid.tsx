
import React from 'react';
import { Pin, User } from '../types';
import { PinCard } from './PinCard';

interface MasonryGridProps {
  pins: Pin[];
  user: User | null;
  onDelete: (id: string) => void;
  onEdit: (pin: Pin) => void;
  onLike: (id: string) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ pins, user, onDelete, onEdit, onLike }) => {
  if (pins.length === 0) {
     return (
       <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-xl font-semibold">No pins found</p>
          <p className="text-sm">Try searching for something else or add a new pin.</p>
       </div>
     )
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mx-auto max-w-[2000px] px-4">
      {pins.map((pin) => (
        <PinCard 
            key={pin.id} 
            pin={pin} 
            user={user}
            onDelete={onDelete}
            onEdit={onEdit}
            onLike={onLike}
        />
      ))}
    </div>
  );
};
