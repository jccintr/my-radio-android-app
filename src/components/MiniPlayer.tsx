import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { usePlayer } from "../context/PlayerContext";
import { colors, radius, spacing, typography } from "../theme/theme";

interface Props {
  onPress: () => void;
}

// Barra fixa na parte inferior da lista, como no Spotify, mostrando a rádio
// em reprodução e permitindo tocar/parar sem abrir o player completo.
// Fica ancorada acima da barra de navegação/gestos do Android usando o
// safe-area inset inferior, em vez de um valor fixo.
export function MiniPlayer({ onPress }: Props) {
  const { currentRadio, isPlaying, isBuffering, togglePlayStop } = usePlayer();
  const insets = useSafeAreaInsets();

  if (!currentRadio) {
    return null;
  }

  return (
    <Pressable
      style={[styles.container, { bottom: insets.bottom + spacing.sm }]}
      onPress={onPress}
    >
      <View style={styles.artworkWrapper}>
        <Image source={{ uri: currentRadio.imageUrl }} style={styles.logo} />
        {isPlaying && !isBuffering && (
          <View style={styles.liveDot}>
            <View style={styles.liveDotInner} />
          </View>
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={typography.subtitle} numberOfLines={1}>
          {currentRadio.name}
        </Text>
        <Text
          style={[typography.caption, isPlaying && !isBuffering ? styles.liveCaption : null]}
          numberOfLines={1}
        >
          {isBuffering ? "Carregando..." : isPlaying ? "● Ao vivo" : "Parado"}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.controlButton, pressed && styles.controlButtonPressed]}
        onPress={(event) => {
          event.stopPropagation();
          togglePlayStop();
        }}
        hitSlop={12}
      >
        {isBuffering ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Ionicons
            name={isPlaying ? "stop" : "play"}
            size={20}
            color={colors.background}
            style={!isPlaying ? styles.playIconOffset : undefined}
          />
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.xs,
    paddingRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  artworkWrapper: {
    position: "relative",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  liveDot: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  liveCaption: {
    color: colors.primary,
  },
  controlButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  playIconOffset: {
    marginLeft: 2,
  },
});
