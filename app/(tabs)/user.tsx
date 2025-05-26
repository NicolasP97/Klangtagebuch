import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudio } from "@/context/AudioContext";
import { useAudioPlayer } from "expo-audio";

export default function PlayRecording() {
  const { recordings, deleteRecording } = useAudio();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000", "#46B1E1"]} style={styles.background} />

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <RecordingItem
            uri={item.uri}
            name={item.name}
            onDelete={deleteRecording}
          />
        )}
      />
    </View>
  );
}

type RecordingItemProps = {
  uri: string;
  name: string;
  onDelete: (uri: string) => void;
};

function RecordingItem({ uri, name, onDelete }: RecordingItemProps) {
  const player = useAudioPlayer(uri);

  const handlePlay = async () => {
    await player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>{name}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.playButtonSmall} onPress={handlePlay}>
          <Ionicons name="play-circle-outline" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButtonSmall}
          onPress={() => onDelete(uri)}
        >
          <Ionicons name="trash-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  itemContainer: {
    backgroundColor: "#222",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  playButtonSmall: {
    padding: 10,
  },
  playButton: {
    top: "20%",
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 250,
    padding: 15,
    borderRadius: "50%",
    borderColor: "#fff",
    borderWidth: 2,
  },
  recordButtonBackground: {
    width: 247,
    height: 247,
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
  },
});
