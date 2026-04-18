"use client";

type Props = {
  status: { text: string; color: string };
  tokens: number;
  muted: boolean;
  streaming: boolean;
  modelName: string;
  persona: string;
  onStop: () => void;
  onMuteToggle: () => void;
  onSearchToggle: () => void;
};

export default function TitleBar({
  status,
  tokens,
  muted,
  streaming,
  modelName,
  persona,
  onStop,
  onMuteToggle,
  onSearchToggle
}: Props) {
  return (
    <div className="titlebar">
      <div className="traffic-lights">
        <button aria-label="Close" className="light close" onClick={() => window.close()} />
        <button aria-label="Minimize" className="light min" />
        <button aria-label="Maximize" className="light max" />
      </div>
      <span className="avatar">✦</span>
      <div className="title-col">
        <strong>AI Interview Assistant</strong>
        <span>{modelName} · {persona}</span>
      </div>
      <div className="spacer" />
      <span className="token-count">{tokens.toLocaleString()} tokens</span>
      <span className="status-pill" style={{ color: status.color, borderColor: `${status.color}55` }}>
        <span className="dot" style={{ backgroundColor: status.color }} />
        {status.text}
      </span>
      {streaming && (
        <button className="stop-btn" onClick={onStop}>
          Stop
        </button>
      )}
      <button className="icon-btn" onClick={onSearchToggle} aria-label="Search">
        🔍
      </button>
      <button className="icon-btn" onClick={onMuteToggle} aria-label="Mute toggle">
        {muted ? '🔇' : '🔊'}
      </button>
      <button className="icon-btn" aria-label="Settings">
        ⚙
      </button>
    </div>
  );
}
