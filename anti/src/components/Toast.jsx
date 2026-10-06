import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-pill">
          {toast.type === 'info' ? (
            <Info size={16} color="#06b6d4" />
          ) : (
            <CheckCircle size={16} color="#10b981" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
