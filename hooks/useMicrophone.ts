"use client";

import { useCallback, useRef, useState } from 'react';

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [level, setLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const meterTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const clearMeter = () => {
    if (meterTimerRef.current) {
      window.clearInterval(meterTimerRef.current);
      meterTimerRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setLevel(0);
  };

  const startRecording = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      meterTimerRef.current = window.setInterval(() => {
        analyser.getByteFrequencyData(data);
        const norm = Math.sqrt(data.reduce((sum, value) => sum + (value / 255) ** 2, 0) / data.length);
        setLevel(Math.max(0, Math.min(100, Math.round(norm * 130))));
      }, 100);

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone start failed', error);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob> => {
    try {
      clearMeter();
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        setIsRecording(false);
        return new Blob([], { type: 'audio/webm' });
      }

      if (recorder.state !== 'inactive') {
        await new Promise<void>((resolve) => {
          recorder.addEventListener('stop', () => resolve(), { once: true });
          recorder.stop();
        });
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      setIsRecording(false);

      return new Blob(chunksRef.current, { type: 'audio/webm' });
    } catch (error) {
      console.error('Microphone stop failed', error);
      setIsRecording(false);
      return new Blob([], { type: 'audio/webm' });
    }
  }, []);

  return {
    isRecording,
    level,
    startRecording,
    stopRecording
  };
}
