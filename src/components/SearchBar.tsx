import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../theme/theme";

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Buscar rádio ou cidade" }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        selectionColor={colors.primary}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={10} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});
