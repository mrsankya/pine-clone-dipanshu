
import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => void;
  user: User | null;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, user }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && file) {
      onUpload(title, file);
      // Reset
      setTitle('');
      setFile(null);
      setPreview(null);
      onClose();
    }
  };

  const authorName = user ? user.username : 'You';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl min-h-[500px] flex flex-col relative shadow-2xl overflow-hidden">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        <div className="p-6 text-center border-b border-gray-100">
            <h2 className="text-xl font-bold">Create Pin</h2>
        </div>

        <div className="flex-grow flex flex-col md:flex-row">
            {/* Image Upload Section */}
            <div className="w-full md:w-1/2 p-6 flex flex-col">
                <div 
                    className={`flex-grow rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 cursor-pointer transition-colors relative overflow-hidden ${isDragging ? 'border-primary bg-red-50' : 'border-gray-300'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UploadCloud className="text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-2">Recommendation: Use high-quality .jpg less than 20MB</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a title"
                        className="text-3xl font-bold placeholder:text-gray-300 border-b border-gray-300 focus:border-primary outline-none py-2 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3 mt-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="font-bold text-gray-600">{authorInitial}</span>
                        </div>
                        <span className="font-semibold text-sm">{authorName}</span>
                     </div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleSubmit}
                        disabled={!title || !file}
                        className="w-full py-3 bg-primary text-white rounded-3xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {title && file ? 'Save Pin' : 'Fill details to save'}
                        {title && file && <CheckCircle size={20} />}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
