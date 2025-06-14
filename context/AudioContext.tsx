// context/AudioContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// Typ eines einzelnen Recordings
export type RecordingItem = {
  uri: string;
  name: string;
};
type DiaryEntry = {
  uri: string;
  name: string;
  date: Date;
  formattedDate: string;
};

// Typ für den Context
type AudioContextType = {
  recordings: DiaryEntry[];
  addRecording: (recording: DiaryEntry) => void;
  deleteRecording: (uri: string) => void;
};

// Default-Wert (initial leer)
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Provider-Komponente, die du in deiner App um die Navigation legst
export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [recordings, setRecordings] = useState<DiaryEntry[]>([]);

  const addRecording = (recording: DiaryEntry) => {
    setRecordings((prev) => [...prev, recording]);
  };

  const deleteRecording = (uri: string) => {
    setRecordings((prev) => prev.filter((item) => item.uri !== uri));
  };

  return (
    <AudioContext.Provider
      value={{ recordings, addRecording, deleteRecording }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// Custom Hook für einfacheren Zugriff
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
