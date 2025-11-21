
import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Pin } from '../types';

interface EditPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: Pin | null;
  onSave: (id: string, title: string) => void;
}

export const EditPinModal: React.FC<EditPinModalProps> = ({ isOpen, onClose, pin, onSave }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
    }
  }, [pin]);

  if (!isOpen || !pin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onSave(pin.id, title);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md flex flex-col relative shadow-2xl overflow-hidden">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        <div className="p-6 text-center border-b border-gray-100">
            <h2 className="text-xl font-bold">Edit Pin</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
            <div className="flex justify-center">
                <img src={pin.imageUrl} alt={pin.title} className="w-32 h-32 object-cover rounded-xl shadow-md" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-medium">Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold border-b border-gray-300 focus:border-primary outline-none py-2 transition-colors"
                />
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!title}
                className="w-full py-3 bg-primary text-white rounded-3xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
                Save Changes
                <CheckCircle size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};
