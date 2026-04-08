import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MonthTheme } from '../../data/monthThemes';
import type { Note } from '../../hooks/useNotes';

interface NotesPanelProps {
  theme: MonthTheme;
  rangeLabel: string;
  hasRange: boolean;
  currentContent: string;
  generalContent: string;
  monthNotes: Note[];
  isSaving: boolean;
  lastSaved: Date | null;
  onSave: (content: string, label: string) => void;
  onSaveGeneral: (content: string) => void;
  onDeleteNote: (key: string) => void;
  onClear: () => void;
}

type NoteTab = 'range' | 'general' | 'history';

const NotesPanel: React.FC<NotesPanelProps> = ({
  theme,
  rangeLabel,
  hasRange,
  currentContent,
  generalContent,
  monthNotes,
  isSaving,
  lastSaved,
  onSave,
  onSaveGeneral,
  onDeleteNote,
  onClear,
}) => {
  const [activeTab, setActiveTab] = useState<NoteTab>('range');
  const [rangeText, setRangeText] = useState(currentContent);
  const [generalText, setGeneralText] = useState(generalContent);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setRangeText(currentContent); }, [currentContent]);
  useEffect(() => { setGeneralText(generalContent); }, [generalContent]);

  useEffect(() => {
    if (lastSaved) {
      setShowSavedToast(true);
      const t = setTimeout(() => setShowSavedToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [lastSaved]);

  const handleRangeChange = useCallback((val: string) => {
    setRangeText(val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (val.trim()) onSave(val, rangeLabel || 'No range selected');
    }, 800);
  }, [onSave, rangeLabel]);

  const handleGeneralChange = useCallback((val: string) => {
    setGeneralText(val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (val.trim()) onSaveGeneral(val);
    }, 800);
  }, [onSaveGeneral]);

  const MAX_CHARS = 500;

  return (
    <div
      className="notes-panel"
      style={{ '--accent': theme.accent, '--accent-glow': theme.accentGlow } as React.CSSProperties}
    >
      {/* Header */}
      <div className="notes-header">
        <div className="notes-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="notes-title-area">
          <h2 className="notes-title">Notes</h2>
          {hasRange && (
            <div className="range-badge" style={{ borderColor: theme.accent, color: theme.accent }}>
              <span className="range-dot" style={{ background: theme.accent }} />
              {rangeLabel}
            </div>
          )}
        </div>
        {hasRange && (
          <button className="clear-range-btn" onClick={onClear} title="Clear date selection" id="btn-clear-range">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="notes-tabs">
        {(['range', 'general', 'history'] as NoteTab[]).map(tab => (
          <button
            key={tab}
            className={`notes-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            id={`tab-notes-${tab}`}
            style={{ '--accent': theme.accent } as React.CSSProperties}
          >
            {tab === 'range' && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Range Note
              </>
            )}
            {tab === 'general' && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Month Memo
              </>
            )}
            {tab === 'history' && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="12 8 12 12 14 14" /><path d="M3.05 11a9 9 0 1 0 .5-4.5" /><polyline points="3 3 3 7 7 7" />
                </svg>
                History
                {monthNotes.length > 0 && (
                  <span className="tab-badge">{monthNotes.length}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="notes-content">
        {activeTab === 'range' && (
          <div className="tab-pane">
            {!hasRange && (
              <div className="notes-empty-state">
                <div className="empty-icon">📅</div>
                <p>Select a date range on the calendar to attach a note to it.</p>
              </div>
            )}
            {hasRange && (
              <>
                <textarea
                  id="textarea-range-note"
                  className="notes-textarea"
                  placeholder={`Write your notes for ${rangeLabel}...`}
                  value={rangeText}
                  onChange={e => handleRangeChange(e.target.value)}
                  maxLength={MAX_CHARS}
                  rows={5}
                  style={{ '--accent': theme.accent } as React.CSSProperties}
                />
                <div className="textarea-footer">
                  <span className={`char-count ${rangeText.length > MAX_CHARS * 0.9 ? 'warn' : ''}`}>
                    {rangeText.length}/{MAX_CHARS}
                  </span>
                  <div className="save-status">
                    {isSaving && <span className="saving-indicator">Saving...</span>}
                    {!isSaving && lastSaved && (
                      <span className="saved-indicator">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Saved
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="tab-pane">
            <p className="tab-hint">General notes for {theme.name}</p>
            <textarea
              id="textarea-general-note"
              className="notes-textarea"
              placeholder={`Write your ${theme.name} goals, plans, thoughts...`}
              value={generalText}
              onChange={e => handleGeneralChange(e.target.value)}
              maxLength={MAX_CHARS}
              rows={6}
              style={{ '--accent': theme.accent } as React.CSSProperties}
            />
            <div className="textarea-footer">
              <span className={`char-count ${generalText.length > MAX_CHARS * 0.9 ? 'warn' : ''}`}>
                {generalText.length}/{MAX_CHARS}
              </span>
              <div className="save-status">
                {isSaving && <span className="saving-indicator">Saving...</span>}
                {!isSaving && lastSaved && (
                  <span className="saved-indicator">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-pane history-pane">
            {monthNotes.length === 0 ? (
              <div className="notes-empty-state">
                <div className="empty-icon">📋</div>
                <p>No saved notes for {theme.name} yet.</p>
              </div>
            ) : (
              <div className="history-list">
                {monthNotes.map(note => (
                  <div key={note.id} className="history-item">
                    <div className="history-item-header">
                      <span className="history-range" style={{ color: theme.accent }}>
                        {note.rangeLabel}
                      </span>
                      <button
                        className="delete-note-btn"
                        onClick={() => onDeleteNote(note.rangeKey)}
                        title="Delete note"
                        id={`btn-delete-note-${note.id.slice(0, 8)}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                    <p className="history-content">{note.content}</p>
                    <span className="history-time">
                      {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Saved toast */}
      {showSavedToast && (
        <div className="saved-toast" style={{ background: theme.accent }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Note saved!
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
