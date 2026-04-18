"use client";

import type { KeyboardEvent } from 'react';

type Props = {
  templates: string[];
  currentTemplate: string;
  recording: boolean;
  autoListen: boolean;
  streaming: boolean;
  pttLevel: number;
  inputValue: string;
  onTemplateChange: (t: string) => void;
  onMicToggle: () => void;
  onAutoListenToggle: () => void;
  onSend: () => void;
  onInputChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

export default function BottomBar({
  templates,
  currentTemplate,
  recording,
  autoListen,
  streaming,
  pttLevel,
  inputValue,
  onTemplateChange,
  onMicToggle,
  onAutoListenToggle,
  onSend,
  onInputChange,
  onKeyDown
}: Props) {
  return (
    <div className="bottom-bar">
      <div className="control-row">
        <span>Template:</span>
        <select value={currentTemplate} onChange={(e) => onTemplateChange(e.target.value)}>
          {templates.map((template) => (
            <option key={template} value={template}>
              {template}
            </option>
          ))}
        </select>
        <div className="spacer" />
        {['↖', '↗', '↙', '↘'].map((p) => (
          <button key={p} title={`Snap ${p}`}>
            {p}
          </button>
        ))}
      </div>

      {recording && (
        <div className="ptt-bar">
          <div style={{ width: `${pttLevel}%` }} />
        </div>
      )}

      <div className="input-pill">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type or speak your interview question, then press Enter…"
        />
        {inputValue.length > 100 && (
          <span className="char-count" style={{ color: inputValue.length > 1800 ? '#f97316' : undefined }}>
            {inputValue.length}
          </span>
        )}
        <button className={`mic-btn ${recording ? 'recording' : ''}`} onClick={onMicToggle}>
          🎙
        </button>
        <button className={`auto-btn ${autoListen ? 'on' : ''}`} onClick={onAutoListenToggle}>
          🔁
        </button>
        <button className="send-btn" disabled={!inputValue.trim() || streaming} onClick={onSend}>
          ↑
        </button>
      </div>
    </div>
  );
}
