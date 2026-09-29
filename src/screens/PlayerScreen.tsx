import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { usePlayer } from "../context/PlayerContext";
import { colors, radius, spacing, typography } from "../theme/theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Player">;

export function PlayerScreen({ navigation }: Props) {
  const { currentRadio, isPlaying, isBuffering, volume, togglePlayStop, setVolume } = usePlayer();

  if (!currentRadio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={typography.body}>Nenhuma rádio selecionada.</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Voltar para a lista</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const volumeIcon = volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-high";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color={colors.textPrimary} />
        </Pressable>
        <Text style={typography.body}>Tocando agora</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentRadio.imageUrl }} style={styles.artwork} resizeMode="cover" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.radioName} numberOfLines={2}>
          {currentRadio.name}
        </Text>
        <Text style={typography.body}>
          {currentRadio.city.name} · {currentRadio.city.state}
        </Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{isBuffering ? "CONECTANDO" : "AO VIVO"}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <Pressable
          onPress={togglePlayStop}
          style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
        >
          {isBuffering ? (
            <ActivityIndicator color={colors.background} size="large" />
          ) : (
            <Ionicons
              name={isPlaying ? "stop" : "play"}
              size={36}
              color={colors.background}
              style={!isPlaying ? styles.playIconOffset : undefined}
            />
          )}
        </Pressable>
      </View>

      {/*<View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={18} color={colors.textSecondary} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surfaceElevated}
          thumbTintColor={colors.primary}
        />
        <Ionicons name={volumeIcon} size={18} color={colors.textSecondary} />
      </View>*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backLink: {
    marginTop: spacing.md,
  },
  backLinkText: {
    color: colors.primary,
    fontWeight: "600",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  artworkContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    maxWidth: 340,
    maxHeight: 340,
  },
  infoContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  radioName: {
    ...typography.title,
    fontSize: 26,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  liveText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
  },
  controlsContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  playButton: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  playIconOffset: {
    marginLeft: 4,
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  slider: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
});
