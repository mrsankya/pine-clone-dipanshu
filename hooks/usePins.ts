
import { useState, useEffect, useCallback } from 'react';
import { Pin, User } from '../types';
import { INITIAL_PINS, API_URL } from '../constants';

export const usePins = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // Check if backend is alive
  const checkBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) {
        setIsBackendAvailable(true);
        return true;
      }
    } catch (e) {
      console.log("Backend not detected, falling back to local storage mode.");
    }
    return false;
  };

  const fetchPins = useCallback(async () => {
    setLoading(true);
    const backendOnline = await checkBackend();

    if (backendOnline) {
      try {
        const res = await fetch(`${API_URL}/pins`);
        const data = await res.json();
        setPins(data);
      } catch (error) {
        console.error("Failed to fetch from backend:", error);
      }
    } else {
      // Load from local storage or use initial
      const stored = localStorage.getItem('pinclone_pins');
      if (stored) {
        setPins(JSON.parse(stored));
      } else {
        setPins(INITIAL_PINS);
        localStorage.setItem('pinclone_pins', JSON.stringify(INITIAL_PINS));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const addPin = async (title: string, file: File, user: User) => {
    const tempId = Date.now().toString();

    if (isBackendAvailable) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', file);
      formData.append('author', user.username);
      
      try {
        const res = await fetch(`${API_URL}/pins`, {
          method: 'POST',
          headers: {
            'x-user-id': user.id,
            'x-user-role': user.role
          },
          body: formData
        });
        const newPin = await res.json();
        setPins(prev => [newPin, ...prev]);
      } catch (e) {
        console.error("Upload failed", e);
        alert("Failed to upload to server.");
      }
    } else {
      // Client-side fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newPin: Pin = {
          id: tempId,
          title: title,
          imageUrl: result,
          author: user.username,
          userId: user.id,
          heightRatio: 1 + Math.random() * 0.5,
          likedBy: []
        };
        
        const updatedPins = [newPin, ...pins];
        setPins(updatedPins);
        localStorage.setItem('pinclone_pins', JSON.stringify(updatedPins));
      };
      reader.readAsDataURL(file);
    }
  };

  const deletePin = async (pinId: string, user: User) => {
    if (isBackendAvailable) {
      try {
        await fetch(`${API_URL}/pins/${pinId}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user.id,
            'x-user-role': user.role
          }
        });
        setPins(prev => prev.filter(p => p.id !== pinId));
      } catch (e) {
        console.error("Delete failed", e);
      }
    } else {
      const pinToDelete = pins.find(p => p.id === pinId);
      if (!pinToDelete) return;

      // Client-side permission check
      if (user.role !== 'admin' && pinToDelete.userId !== user.id) {
        alert("You are not authorized to delete this pin.");
        return;
      }

      const updatedPins = pins.filter(p => p.id !== pinId);
      setPins(updatedPins);
      localStorage.setItem('pinclone_pins', JSON.stringify(updatedPins));
    }
  };

  const updatePin = async (pinId: string, title: string, user: User) => {
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${API_URL}/pins/${pinId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': user.id,
              'x-user-role': user.role
            },
            body: JSON.stringify({ title })
          });
          if(res.ok) {
              const updatedPin = await res.json();
              setPins(prev => prev.map(p => p.id === pinId ? updatedPin : p));
          }
      } catch (e) {
          console.error("Update failed", e);
      }
    } else {
        const updatedPins = pins.map(p => {
            if (p.id === pinId) {
                return { ...p, title };
            }
            return p;
        });
        setPins(updatedPins);
        localStorage.setItem('pinclone_pins', JSON.stringify(updatedPins));
    }
  };

  const likePin = async (pinId: string, user: User) => {
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${API_URL}/pins/${pinId}/like`, {
          method: 'POST',
          headers: {
            'x-user-id': user.id,
            'x-user-role': user.role,
            'x-user-name': user.username
          }
        });
        if (res.ok) {
          const updatedPin = await res.json();
          setPins(prev => prev.map(p => p.id === pinId ? updatedPin : p));
        }
      } catch (e) {
        console.error("Like failed", e);
      }
    } else {
      // Local Storage Logic
      const updatedPins = pins.map(p => {
        if (p.id === pinId) {
          const likedBy = p.likedBy || [];
          const alreadyLiked = likedBy.includes(user.id);
          let newLikedBy;
          
          if (alreadyLiked) {
            newLikedBy = likedBy.filter(id => id !== user.id);
          } else {
            newLikedBy = [...likedBy, user.id];
            
            // Generate Notification locally
            if (p.userId && p.userId !== user.id) {
               const newNotification = {
                  id: Date.now().toString(),
                  recipientId: p.userId,
                  senderId: user.id,
                  senderName: user.username,
                  type: 'like',
                  pinId: p.id,
                  pinImage: p.imageUrl,
                  message: 'liked your pin',
                  isRead: false,
                  createdAt: Date.now()
               };
               
               const existingNotesStr = localStorage.getItem('pinclone_notifications');
               const existingNotes = existingNotesStr ? JSON.parse(existingNotesStr) : [];
               localStorage.setItem('pinclone_notifications', JSON.stringify([newNotification, ...existingNotes]));
               
               // Dispatch custom event to notify Navbar
               window.dispatchEvent(new Event('notificationUpdate'));
            }
          }
          return { ...p, likedBy: newLikedBy };
        }
        return p;
      });
      
      setPins(updatedPins);
      localStorage.setItem('pinclone_pins', JSON.stringify(updatedPins));
    }
  };

  return { pins, loading, addPin, deletePin, updatePin, likePin, isBackendAvailable };
};
