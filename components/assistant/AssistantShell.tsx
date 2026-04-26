"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './../../styles/assistant.css';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import BottomBar from './BottomBar';
import { getHealth, getPersonas, getSettings, getTemplates } from '@/lib/api';
import { useAssistant } from '@/hooks/useAssistant';
import { useMicrophone } from '@/hooks/useMicrophone';

type Item = { prompt: string; answer: string; ts: string };

type State = {
  userPrompt: string;
  response: string;
  streaming: boolean;
  tokens: number;
  status: { text: string; color: string };
  muted: boolean;
  recording: boolean;
  autoListen: boolean;
  history: Item[];
  pins: Item[];
  personas: string[];
  templates: string[];
  currentPersona: string;
  currentTemplate: string;
  followups: string[];
  execOutput: string;
  sidebarTab: 'history' | 'pins';
  searchQuery: string;
  inputValue: string;
  modelName: string;
  searchVisible: boolean;
};

type Action =
  | { type: 'set'; payload: Partial<State> }
  | { type: 'pushHistory'; payload: Item }
  | { type: 'resetConversation' }
  | { type: 'appendResponse'; payload: string };

const initialState: State = {
  userPrompt: '',
  response: '',
  streaming: false,
  tokens: 0,
  status: { text: 'Ready', color: '#00c864' },
  muted: false,
  recording: false,
  autoListen: false,
  history: [],
  pins: [],
  personas: [],
  templates: [],
  currentPersona: 'default',
  currentTemplate: '',
  followups: [],
  execOutput: '',
  sidebarTab: 'history',
  searchQuery: '',
  inputValue: '',
  modelName: 'assistant',
  searchVisible: false
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload };
    case 'pushHistory':
      return { ...state, history: [action.payload, ...state.history] };
    case 'appendResponse':
      return { ...state, response: state.response + action.payload };
    case 'resetConversation':
      return {
        ...state,
        userPrompt: '',
        response: '',
        followups: [],
        execOutput: '',
        inputValue: '',
        history: [],
        pins: []
      };
    default:
      return state;
  }
}

export default function AssistantShell() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const responseRef = useRef('');
  const promptRef = useRef('');
  const [pendingFollowup, setPendingFollowup] = useState<{ p: string; a: string } | null>(null);
  const wakeTimerRef = useRef<number | null>(null);

  const setStatus = (status: State['status']) => {
    dispatch({ type: 'set', payload: { status } });
    if (status.color === '#ef4444') {
      window.setTimeout(() => {
        dispatch({ type: 'set', payload: { status: { text: 'Ready', color: '#00c864' } } });
      }, 3000);
    }
  };

  const { isRecording, level, startRecording, stopRecording } = useMicrophone();

  const assistant = useAssistant({
    onStart: () => {
      responseRef.current = '';
      dispatch({ type: 'set', payload: { response: '', streaming: true, followups: [], status: { text: 'Streaming…', color: '#a855f7' } } });
    },
    onToken: (token) => {
      responseRef.current += token;
      dispatch({ type: 'appendResponse', payload: token });
    },
    onDone: (full) => {
      const answer = full || responseRef.current;
      if (!answer && !state.streaming) {
        return;
      }
      dispatch({ type: 'set', payload: { streaming: false, status: { text: 'Ready', color: '#00c864' } } });
      if (promptRef.current && answer) {
        const item = { prompt: promptRef.current, answer, ts: new Date().toLocaleTimeString() };
        dispatch({ type: 'pushHistory', payload: item });
        setPendingFollowup({ p: promptRef.current, a: answer });
      }
    },
    onError: (message) => {
      dispatch({ type: 'set', payload: { streaming: false } });
      setStatus({ text: `Error — ${message}`, color: '#ef4444' });
    },
    onTokenEstimate: (amount) => {
      dispatch({ type: 'set', payload: { tokens: state.tokens + amount } });
    }
  });

  useEffect(() => {
    dispatch({ type: 'set', payload: { recording: isRecording } });
  }, [isRecording]);

  useEffect(() => {
    let alive = true;

    wakeTimerRef.current = window.setTimeout(() => {
      setStatus({ text: 'Waking up server…', color: '#f59e0b' });
    }, 3000);

    const load = async () => {
      try {
        const [health, personas, templates, settings] = await Promise.all([
          getHealth(),
          getPersonas(),
          getTemplates(),
          getSettings()
        ]);
        if (!alive) return;
        if (wakeTimerRef.current) window.clearTimeout(wakeTimerRef.current);
        dispatch({
          type: 'set',
          payload: {
            personas,
            templates,
            currentPersona: settings.persona || personas[0] || 'default',
            currentTemplate: templates[0] || '',
            modelName: settings.model || health.model || 'assistant',
            status: { text: 'Ready', color: '#00c864' }
          }
        });
      } catch (error) {
        setStatus({ text: `Error — ${error instanceof Error ? error.message : 'Load failed'}`, color: '#ef4444' });
      }
    };

    void load();

    return () => {
      alive = false;
      if (wakeTimerRef.current) window.clearTimeout(wakeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pendingFollowup) return;
    void assistant.fetchFollowups(pendingFollowup.p, pendingFollowup.a).then((f) => {
      dispatch({ type: 'set', payload: { followups: f } });
      setPendingFollowup(null);
    });
  }, [assistant, pendingFollowup]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        void onMicToggle();
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        dispatch({ type: 'set', payload: { muted: !state.muted } });
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'r' && !event.shiftKey) {
        event.preventDefault();
        onRetry();
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        void runExecOutput();
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        dispatch({ type: 'set', payload: { searchVisible: !state.searchVisible } });
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        dispatch({ type: 'resetConversation' });
      }
      if (event.key === 'Escape') {
        assistant.stopStreaming();
        dispatch({ type: 'set', payload: { streaming: false } });
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  });

  const onSend = useCallback((override?: string) => {
    const prompt = (override ?? state.inputValue).trim();
    if (!prompt || state.streaming) return;
    promptRef.current = prompt;
    dispatch({ type: 'set', payload: { userPrompt: prompt, inputValue: override ? state.inputValue : '' } });
    assistant.sendMessage(prompt, state.currentPersona, state.currentTemplate);
  }, [assistant, state.currentPersona, state.currentTemplate, state.inputValue, state.streaming]);

  useEffect(() => {
    if (!state.autoListen || state.streaming) return;
    let cancelled = false;

    const loop = async () => {
      if (cancelled || state.streaming || !state.autoListen) return;
      await startRecording();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const blob = await stopRecording();
      const heard = await assistant.transcribeAudio(blob);
      if (heard && heard.trim() && !cancelled) {
        dispatch({ type: 'set', payload: { inputValue: heard } });
        onSend(heard);
      }
      if (!cancelled) {
        setTimeout(loop, 250);
      }
    };

    void loop();
    return () => {
      cancelled = true;
    };
  }, [assistant, onSend, startRecording, state.autoListen, state.streaming, stopRecording]);

  const onRetry = () => {
    if (!state.userPrompt) return;
    promptRef.current = state.userPrompt;
    assistant.sendMessage(state.userPrompt, state.currentPersona, state.currentTemplate);
  };

  const onMicToggle = async () => {
    if (!isRecording) {
      await startRecording();
      return;
    }
    const blob = await stopRecording();
    const text = await assistant.transcribeAudio(blob);
    if (text) {
      dispatch({ type: 'set', payload: { inputValue: text } });
    }
  };

  const runExecOutput = async () => {
    try {
      const prompt = `/run ${state.userPrompt || state.inputValue}`.trim();
      if (!prompt || prompt === '/run') return;
      const out = await import('@/lib/api').then(({ ask }) => ask(prompt, state.currentPersona, state.currentTemplate));
      dispatch({ type: 'set', payload: { execOutput: out } });
    } catch (error) {
      setStatus({ text: `Error — ${error instanceof Error ? error.message : 'Exec failed'}`, color: '#ef4444' });
    }
  };

  const filteredTemplates = useMemo(() => (state.templates.length ? state.templates : ['default']), [state.templates]);

  return (
    <div className="assistant-window">
      <TitleBar
        status={state.status}
        tokens={state.tokens}
        muted={state.muted}
        streaming={state.streaming}
        modelName={state.modelName}
        persona={state.currentPersona}
        onStop={() => {
          assistant.stopStreaming();
          dispatch({ type: 'set', payload: { streaming: false, status: { text: 'Ready', color: '#00c864' } } });
        }}
        onMuteToggle={() => dispatch({ type: 'set', payload: { muted: !state.muted } })}
        onSearchToggle={() => dispatch({ type: 'set', payload: { searchVisible: !state.searchVisible } })}
      />
      <div className="body-row">
        <Sidebar
          history={state.history}
          pins={state.pins}
          sidebarTab={state.sidebarTab}
          searchQuery={state.searchQuery}
          searchVisible={state.searchVisible}
          onTabChange={(tab) => dispatch({ type: 'set', payload: { sidebarTab: tab } })}
          onSearchChange={(q) => dispatch({ type: 'set', payload: { searchQuery: q } })}
          onSelectHistory={(item) => dispatch({ type: 'set', payload: { userPrompt: item.prompt, response: item.answer } })}
          onSelectPin={(item) => dispatch({ type: 'set', payload: { userPrompt: item.prompt, response: item.answer } })}
          onNewConversation={() => dispatch({ type: 'set', payload: { userPrompt: '', response: '', inputValue: '', followups: [] } })}
          onExport={() => {
            const text = state.history
              .map((h) => `[${h.ts}]\nQ: ${h.prompt}\nA: ${h.answer}\n`)
              .join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'assistant-history.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}
          onClear={() => dispatch({ type: 'set', payload: { history: [], pins: [], response: '', userPrompt: '', followups: [] } })}
        />
        <div className="main-col">
          <ChatArea
            userPrompt={state.userPrompt}
            response={state.response}
            streaming={state.streaming}
            followups={state.followups}
            execOutput={state.execOutput}
            persona={state.currentPersona}
            onFollowupClick={(q) => dispatch({ type: 'set', payload: { inputValue: q } })}
            onCopy={() => navigator.clipboard.writeText(state.response)}
            onPin={() => {
              if (!state.userPrompt || !state.response) return;
              const pin = { prompt: state.userPrompt, answer: state.response, ts: new Date().toLocaleTimeString() };
              dispatch({ type: 'set', payload: { pins: [pin, ...state.pins] } });
            }}
            onRetry={onRetry}
            onRate={() => {}}
          />
          <BottomBar
            templates={filteredTemplates}
            currentTemplate={state.currentTemplate || filteredTemplates[0]}
            recording={state.recording}
            autoListen={state.autoListen}
            streaming={state.streaming}
            pttLevel={level}
            inputValue={state.inputValue}
            onTemplateChange={(template) => dispatch({ type: 'set', payload: { currentTemplate: template } })}
            onMicToggle={() => void onMicToggle()}
            onAutoListenToggle={() => dispatch({ type: 'set', payload: { autoListen: !state.autoListen } })}
            onSend={() => onSend()}
            onInputChange={(inputValue) => dispatch({ type: 'set', payload: { inputValue } })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
