// context/AudioContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// Typ eines einzelnen Recordings
export type RecordingItem = {
  uri: string;
  name: string;
};
// Typ für den Context
type AudioContextType = {
  recordings: RecordingItem[];
  addRecording: (recording: RecordingItem) => void;
  deleteRecording: (uri: string) => void;
};

// Default-Wert (initial leer)
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Provider-Komponente, die du in deiner App um die Navigation legst
export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  const addRecording = (recording: RecordingItem) => {
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
