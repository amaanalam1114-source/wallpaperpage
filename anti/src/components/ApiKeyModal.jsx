import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, validatePexelsApiKey } from '../services/pexelsApi';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  if (!isOpen) return null;

  const [keyInput, setKeyInput] = useState(getStoredApiKey());
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      saveStoredApiKey('');
      setFeedback({ type: 'success', message: 'Switched to offline Curated Master library!' });
      setTimeout(() => {
        onKeySaved(false);
        onClose();
      }, 900);
      return;
    }

    setLoading(true);
    setFeedback(null);

    const result = await validatePexelsApiKey(keyInput.trim());
    setLoading(false);

    if (result.valid) {
      saveStoredApiKey(keyInput.trim());
      setFeedback({ type: 'success', message: 'API key validated! Live Pexels API feed enabled.' });
      setTimeout(() => {
        onKeySaved(true);
        onClose();
      }, 1000);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  const handleClear = () => {
    saveStoredApiKey('');
    setKeyInput('');
    setFeedback({ type: 'success', message: 'Cleared key. Using Curated library.' });
    setTimeout(() => {
      onKeySaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="api-key-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '34px', height: '34px' }}>
              <Key size={18} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
              Pexels API Key
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
          Connect your free Pexels API key to unlock millions of live 4K wallpapers, real-time query searches, and direct high-speed CDN downloads.
        </p>

        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '13px',
          color: '#a5f3fc',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Need a free Pexels API Key?</span>
          <a
            href="https://www.pexels.com/api/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#38bdf8',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <span>Get Key Free</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <form onSubmit={handleSave}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Your API Key
          </label>
          <input
            type="password"
            className="api-key-input"
            placeholder="Paste your 56-character Pexels API Key..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            autoFocus
          />

          {feedback && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '18px',
              background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: feedback.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {feedback.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              className="search-submit-btn"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Validating...</span>
                </>
              ) : (
                <span>Validate & Save</span>
              )}
            </button>

            {keyInput && (
              <button
                type="button"
                className="icon-btn"
                onClick={handleClear}
                style={{ padding: '0 16px' }}
              >
                Clear Key
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
