import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type CountdownTimerProps = {
  initialSeconds?: number;
  startTimer: boolean;
  onFinish?: () => void;
};

const CountdownTimer = ({
  initialSeconds = 5,
  startTimer,
  onFinish,
}: CountdownTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const intervalRef = useRef<number | null>(null);

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setSecondsLeft(initialSeconds);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onFinish?.(); // optionales Callback auslösen
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSecondsLeft(initialSeconds);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (startTimer) {
      startCountdown();
    } else {
      resetCountdown();
    }
  }, [startTimer]);

  console.log("startTimer?:", startTimer);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{secondsLeft}</Text>
    </View>
  );
};

export default CountdownTimer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timer: {
    marginTop: 10,
    fontFamily: "Nunito",
    fontSize: 48,
    color: "#fff",
  },
});
