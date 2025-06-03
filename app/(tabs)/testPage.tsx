import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import DiaryWithAnimation from "../components/diary";
import { useAudio } from "@/context/AudioContext";

export default function TestPage() {
  const { recordings } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000", "#46B1E1"]} style={styles.background} />
      <DiaryWithAnimation entries={recordings} playing={isPlaying} />
      <TouchableOpacity style={styles.confirmationButtons} onPress={playSound}>
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
