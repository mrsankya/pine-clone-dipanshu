
import React, { useState } from 'react';
import { X, Trash2, Edit2, Search, Shield } from 'lucide-react';
import { Pin } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pins: Pin[];
  onDelete: (id: string) => void;
  onEdit: (pin: Pin) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, pins, onDelete, onEdit }) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredPins = pins.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.author.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-[70] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Shield size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Manage all content across the platform</p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
         <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search pins by title or author..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
         </div>
         <div className="text-sm text-gray-600 font-medium">
            Total Pins: {pins.length}
         </div>
      </div>

      {/* Content Table */}
      <div className="flex-grow overflow-auto bg-gray-50 p-6">
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredPins.map(pin => (
                        <tr key={pin.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3">
                                <img src={pin.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                            </td>
                            <td className="px-6 py-3">
                                <span className="font-medium text-gray-900">{pin.title}</span>
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${pin.author}&background=random`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-sm text-gray-600">{pin.author}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => onEdit(pin)}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => { if(confirm(`Delete "${pin.title}"? This cannot be undone.`)) onDelete(pin.id); }}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredPins.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                No pins found matching your filter.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
