import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudio } from "@/context/AudioContext";
import { useAudioPlayer } from "expo-audio";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function PlayAllWithCrossfade() {
  const { recordings } = useAudio();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Hook lädt jeweils die URI des aktuellen Index
  const player = useAudioPlayer(
    currentIndex !== null ? recordings[currentIndex].uri : undefined
  );

  console.log("spiele alle clips ab...");
  useEffect(() => {
    // Wenn kein Clip aktiv ist, machen wir nichts
    if (currentIndex === null || !player) return;

    const clipDuration = 7000; // ms
    const fadeDuration = 2000; // ms
    const steps = 20;
    const stepTime = fadeDuration / steps;

    const playClip = async () => {
      // Clip von vorn starten
      player.seekTo(0);
      player.volume = 0;
      player.play();

      // Fade-In: 0 → 1
      for (let s = 0; s <= steps; s++) {
        player.volume = s / steps;
        // eslint-disable-next-line no-await-in-loop
        await delay(stepTime);
      }

      // Hauptteil (clipDuration – fadeIn – fadeOut)
      // eslint-disable-next-line no-await-in-loop
      await delay(clipDuration - 2 * fadeDuration);

      // Fade-Out: 1 → 0
      for (let s = steps; s >= 0; s--) {
        player.volume = s / steps;
        // eslint-disable-next-line no-await-in-loop
        await delay(stepTime);
      }

      // Nächsten Clip anstoßen oder beenden
      setCurrentIndex((i) =>
        i !== null && i + 1 < recordings.length ? i + 1 : null
      );
    };

    playClip();
  }, [currentIndex, player, recordings]);

  // Startet die Kette
  const playAllWithCrossfade = () => {
    if (recordings.length > 0) {
      setCurrentIndex(0);
    }
  };

  const listSongs = () => {
    console.log("recordings: ", recordings);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000", "#46B1E1"]} style={styles.background} />
      <TouchableOpacity style={styles.confirmationButtons} onPress={listSongs}>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(54, 128, 162, 0.9)", "#000"]}
          locations={[0.05, 0.4]}
          style={styles.confirmationButtonsBackground}
        >
          <Ionicons name="map" size={32} color={"white"} />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmationButtons}
        onPress={playAllWithCrossfade}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(54, 128, 162, 0.9)", "#000"]}
          locations={[0.05, 0.4]}
          style={styles.confirmationButtonsBackground}
        >
          <Ionicons name="musical-notes" size={32} color={"white"} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
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
});
