"use client";

import { useEffect, useRef } from 'react';

type Props = {
  userPrompt: string;
  response: string;
  streaming: boolean;
  followups: string[];
  execOutput: string;
  persona: string;
  onFollowupClick: (q: string) => void;
  onCopy: () => void;
  onPin: () => void;
  onRetry: () => void;
  onRate: (v: 1 | -1) => void;
};

export default function ChatArea({
  userPrompt,
  response,
  streaming,
  followups,
  execOutput,
  persona,
  onFollowupClick,
  onCopy,
  onPin,
  onRetry,
  onRate
}: Props) {
  const responseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <section className="chat-area">
      <div className="user-row">
        <div className="user-bubble">
          {userPrompt ? <span>{userPrompt}</span> : <i>Your question will appear here…</i>}
        </div>
      </div>
      <hr />
      <div className="ai-area">
        <div className="ai-head">
          <span>✦ Assistant · {persona} mode</span>
          <div>
            <button onClick={onCopy}>⎘</button>
            <button onClick={onPin}>⭐</button>
            <button onClick={onRetry}>🔄</button>
            <button onClick={() => onRate(1)}>👍</button>
            <button onClick={() => onRate(-1)}>👎</button>
          </div>
        </div>
        <div className="response-body" ref={responseRef}>
          <div dangerouslySetInnerHTML={{ __html: response || '<span style="color:#475569">Thinking…</span>' }} />
          {streaming && <span className="cursor" />}
        </div>
        <div className="progress" style={{ display: streaming ? 'block' : 'none' }} />
        {execOutput && <pre className="exec-output">{execOutput}</pre>}
        {!streaming && followups.length > 0 && (
          <div className="followups">
            {followups.map((q) => (
              <button key={q} onClick={() => onFollowupClick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
