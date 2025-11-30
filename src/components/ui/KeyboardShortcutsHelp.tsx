import React, { useState } from 'react';

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'V', description: 'Select & Move' },
  { key: 'H / Space', description: 'Pan Canvas' },
  { key: 'P', description: 'Draw Panel' },
  { key: 'T', description: 'Add Text' },
  { key: 'B', description: 'Draw Freehand' },
  { key: 'A', description: 'Draw Arrow' },
  { key: 'Ctrl+Z', description: 'Undo' },
  { key: 'Ctrl+Y', description: 'Redo' },
  { key: 'Delete', description: 'Delete Selected' },
];

export const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="keyboard-shortcuts-help">
      <button
        className="tool-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Keyboard Shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="keyboard-shortcuts-backdrop" onClick={() => setIsOpen(false)} />
          <div className="keyboard-shortcuts-panel">
            <div className="keyboard-shortcuts-panel__header">
              <h4>Keyboard Shortcuts</h4>
              <button className="button-ghost btn-sm" onClick={() => setIsOpen(false)}>×</button>
            </div>
            <ul className="keyboard-shortcuts-list">
              {shortcuts.map((shortcut) => (
                <li key={shortcut.key} className="keyboard-shortcut-item">
                  <kbd className="keyboard-shortcut-key">{shortcut.key}</kbd>
                  <span className="keyboard-shortcut-desc">{shortcut.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
