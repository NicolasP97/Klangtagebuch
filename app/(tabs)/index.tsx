import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  useAudioRecorder,
  RecordingOptions,
  AudioModule,
  RecordingPresets,
} from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { useAudio } from "@/context/AudioContext";
import { useAudioPlayer } from "expo-audio";

import AnimatedCountdownCircle from "../components/animatedCountdownCircle";

// Typ für eine einzelne Tagebuch-Eintragung
type DiaryEntry = {
  uri: string; // Pfad zur Audiodatei (z. B. FileSystem-Dokumentverzeichnis)
  name: string; // Dateiname (z. B. "aufnahme-1685784320000.m4a")
  date: Date; // Exaktes Datum der Aufnahme
  formattedDate: string; // Schön formatierter String, z. B. "03. Juni 2025"
};
export default function App() {
  const [alreadySaved, setAlreadySaved] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [soundRecorded, setSoundRecorded] = useState<boolean>(false);
  const [startTimer, setStartTimer] = useState<boolean>(false);
  const [destinationURI, setDestinationURI] = useState<string | null>(null);
  const [filename, setFilename] = useState("");
  const [testRecording, setTestRecording] = useState<DiaryEntry[]>();

  const { addRecording } = useAudio();
  const { recordings, deleteRecording } = useAudio();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(destinationURI || undefined);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.log("Permission to access microphone was denied");
      }
    })();
  }, []);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    await audioRecorder.record();
    setIsRecording(true);
    setAlreadySaved(false);
    setStartTimer(true);
    console.log("Recording...");
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setIsRecording(false);
    setStartTimer(false);
    console.log("Stopped Recording!");
  };

  const handleFinish = async () => {
    setSoundRecorded(true);
    await stopRecording();
    const originalUri = audioRecorder.uri;
    const newFilename = `aufnahme-${Date.now()}.m4a`;
    const destURI = FileSystem.documentDirectory + "recordings/" + newFilename;

    try {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "recordings/",
        { intermediates: true }
      );

      await FileSystem.copyAsync({
        from: originalUri ?? "",
        to: destURI,
      });

      setDestinationURI(destURI);
      setFilename(newFilename);
      // addRecording({ uri: destURI, name: newFilename });

      console.log("Gespeichert:", destURI);
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }

    const newEntry: DiaryEntry = {
      uri: destURI,
      name: newFilename,
      date: new Date(),
      formattedDate: new Date().toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
    addRecording(newEntry);
    setTestRecording([newEntry]);

    console.log("newEntry: ", newEntry);
  };

  const handleRetry = async () => {
    await stopRecording();

    if (destinationURI) {
      await FileSystem.deleteAsync(destinationURI, { idempotent: true });
      deleteRecording(destinationURI);
      console.log("Letzte Aufnahme gelöscht:", destinationURI);
    }
    setDestinationURI(null);
    setSoundRecorded(false);
    console.log("Retry clicked!");
  };

  const handleAccept = async () => {
    setDestinationURI(null);
    setSoundRecorded(false);
    console.log("Accepted!");
  };

  const playSound = async () => {
    if (!player) return;
    console.log("Playing file: ", destinationURI);
    await player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#000", "rgba(54, 128, 162, 0.9)"]}
        locations={[0.7, 0.95]}
        style={styles.background}
      />
      <AnimatedCountdownCircle
        duration={7}
        start={startTimer}
        radius={120}
        onFinish={handleFinish}
      />

      <TouchableOpacity style={styles.recordButton} onPress={record}>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(54, 128, 162, 0.9)", "#000"]}
          locations={[0.05, 0.4]}
          style={styles.recordButtonBackground}
        >
          <FontAwesome
            name="microphone"
            size={70}
            color={isRecording ? "grey" : "white"}
          />
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.playButtonContainer}>
        <TouchableOpacity
          style={styles.confirmationButtons}
          onPress={soundRecorded ? playSound : () => {}}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={["rgba(54, 128, 162, 0.9)", "#000"]}
            locations={[0.05, 0.4]}
            style={styles.confirmationButtonsBackground}
          >
            <Ionicons
              name="musical-notes"
              size={32}
              color={soundRecorded ? "white" : "grey"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.confirmationButtonsContainer}>
        <TouchableOpacity
          style={styles.confirmationButtons}
          onPress={handleRetry}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={["rgba(54, 128, 162, 0.9)", "#000"]}
            locations={[0.05, 0.4]}
            style={styles.confirmationButtonsBackground}
          >
            <FontAwesome5 name="redo" size={32} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmationButtons}
          onPress={soundRecorded ? handleAccept : () => {}}
        >
          <LinearGradient
            // Background Linear Gradient
            colors={["rgba(54, 128, 162, 0.9)", "#000"]}
            locations={[0.05, 0.4]}
            style={styles.confirmationButtonsBackground}
          >
            <FontAwesome5
              name="check"
              size={32}
              color={soundRecorded ? "white" : "grey"}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  recordButton: {
    top: "20%",
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 250,
    padding: 15,
    // borderRadius: "50%",
    // borderColor: "#fff",
    // borderWidth: 2,
  },
  recordButtonBackground: {
    width: 247,
    height: 247,
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonContainer: {
    top: "25%",
  },
  confirmationButtonsContainer: {
    width: "70%",
    flexDirection: "row",
    top: "30%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confirmationButtons: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    padding: 15,
    borderRadius: "50%",
    borderColor: "#fff",
    borderWidth: 5,
  },
  confirmationButtonsBackground: {
    width: 95,
    height: 95,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: "#fff",
  },
});
