import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Radio } from "../api/radios";
import { colors, radius, spacing, typography } from "../theme/theme";

interface Props {
  radio: Radio;
  isActive: boolean;
  onPress: (radio: Radio) => void;
}

function RadioListItemBase({ radio, isActive, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(radio)}
      style={({ pressed }) => [
        styles.container,
        isActive && styles.containerActive,
        pressed && styles.containerPressed,
      ]}
    >
      <Image source={{ uri: radio.imageUrl }} style={styles.logo} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={[typography.subtitle, isActive && styles.activeText]} numberOfLines={1}>
          {radio.name}
        </Text>
        <Text style={typography.caption} numberOfLines={1}>
          {radio.city.name} · {radio.city.state}
        </Text>
      </View>
    </Pressable>
  );
}

export const RadioListItem = React.memo(RadioListItemBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  containerActive: {
    backgroundColor: colors.surfaceElevated,
  },
  containerPressed: {
    opacity: 0.7,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  textContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  activeText: {
    color: colors.primary,
  },
});
