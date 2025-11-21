import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (username: string, email: string, password: string) => Promise<boolean>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    if (isLogin) {
      success = await onLogin(email, password);
    } else {
      success = await onRegister(username, email, password);
    }

    if (success) {
      onClose();
      // Reset fields
      setEmail('');
      setPassword('');
      setUsername('');
    } else {
      setError(isLogin ? 'Invalid credentials' : 'Registration failed (Email might be taken)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-[484px] min-h-[400px] flex flex-col relative shadow-2xl overflow-hidden p-8">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
            <div className="text-primary mb-4">
                <svg height="40" width="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.567-.992 3.995-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-800">{isLogin ? 'Welcome to PinClone' : 'Join PinClone'}</h1>
            <p className="mt-2 text-gray-600">Find new ideas to try</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {!isLogin && (
                <div>
                    <label className="text-xs ml-2 text-gray-500">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>
            )}
            
            <div>
                <label className="text-xs ml-2 text-gray-500">Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
            </div>
            
            <div>
                <label className="text-xs ml-2 text-gray-500">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
            </div>

            <button 
                type="submit"
                className="mt-4 bg-primary text-white rounded-full py-3 font-bold hover:bg-red-700 transition-colors"
            >
                {isLogin ? 'Log in' : 'Continue'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-900">
            {isLogin ? "Not on PinClone yet? " : "Already a member? "}
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-bold hover:underline"
            >
                {isLogin ? 'Sign up' : 'Log in'}
            </button>
        </div>
      </div>
    </div>
  );
};