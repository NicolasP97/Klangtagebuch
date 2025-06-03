import React, { useRef, useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";
import { FlatList } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width * 0.9;

type DiaryEntry = {
  uri: string;
  name: string;
  date: Date;
  formattedDate: string;
};

export default function DiaryWithAnimation({
  entries,
  playing,
}: {
  entries: DiaryEntry[];
  playing: boolean;
}) {
  const flatListRef = useRef<FlatList<DiaryEntry>>(null);
  const lottieRef = useRef<LottieView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isplayer, setIsPlayer] = useState(false);

  console.log("DiaryWithAnimation entries:", entries);

  // Wenn playing=true, starte Lottie-Animation und scroll automatisch nach der Animation
  useEffect(() => {
    if (!playing || !lottieRef.current) return;

    lottieRef.current.play(0, 60); // z. B. Frames 0–60 für ein ganzes Page-Turn
  }, [playing]);

  const onAnimationFinish = () => {
    // Wenn wir noch weitere Einträge haben:
    if (currentIndex + 1 < entries.length) {
      // Nächste Seite in FlatList anzeigen:
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: false, // Lottie zeigt die Animation, wir scrollen „unsichtbar“
      });
      setCurrentIndex((idx) => idx + 1);
      // Lottie neu starten? Oder wir stoppen it until next step.
      setIsPlayer(false);
    } else {
      // Ende erreicht
      setIsPlayer(false);
    }
  };

  // Diese Funktion wird von eurem PlayAllWithCrossfade aufgerufen, wenn neuer Clip startet
  const triggerPageFlip = () => {
    if (currentIndex < entries.length) {
      setIsPlayer(true);
    }
  };

  return (
    <GestureHandlerRootView style={styles.outer}>
      <View style={styles.wrapper}>
        {/* 1. Lottie überlagert die gesamte Seite halbtransparent */}
        {playing && (
          <View style={styles.lottieContainer}>
            <LottieView
              ref={lottieRef}
              source={require("../../assets/page-turn.json")}
              loop={false}
              onAnimationFinish={onAnimationFinish}
              style={styles.lottie}
            />
          </View>
        )}

        {/* 2. FlatList / Scroll mit Einzelseiten */}
        <FlatList
          ref={flatListRef}
          data={entries}
          keyExtractor={(item) => item.name}
          horizontal
          pagingEnabled
          scrollEnabled={false} // Manuelles Wischen ggf. unterbinden, wenn die Automatik dominieren soll
          renderItem={({ item }) => (
            <View style={styles.pageContainer}>
              <Text style={styles.pageDate}>{item.formattedDate}</Text>
              {/* ggf. weitere Inhalte */}
            </View>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center", justifyContent: "center" },
  pageContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH * 1.4,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 12,
  },
  wrapper: {
    flex: 1,
  },
  pageDate: { fontSize: 18, fontWeight: "600" },
  lottieContainer: {
    position: "absolute",
    width: CONTAINER_WIDTH + 20,
    height: (CONTAINER_WIDTH + 20) * 1.4,
    top: "25%", // je nachdem, wo die FlatList liegt
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: CONTAINER_WIDTH + 20,
    height: (CONTAINER_WIDTH + 20) * 1.4,
  },
});
