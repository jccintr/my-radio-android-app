import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { fetchRadios, type Radio } from "../api/radios";
import { MiniPlayer } from "../components/MiniPlayer";
import { RadioListItem } from "../components/RadioListItem";
import { SearchBar } from "../components/SearchBar";
import { usePlayer } from "../context/PlayerContext";
import { colors, spacing, typography } from "../theme/theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RadioList">;

// Remove acentos para permitir buscar "sao paulo" e encontrar "São Paulo".
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function RadioListScreen({ navigation }: Props) {
  const [radios, setRadios] = useState<Radio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentRadio, playRadio } = usePlayer();
  const insets = useSafeAreaInsets();

  const loadRadios = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      setErrorMessage(null);
      const data = await fetchRadios();
      setRadios(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Não foi possível carregar as rádios."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRadios();
  }, [loadRadios]);

  const filteredRadios = useMemo(() => {
    const query = normalize(searchTerm);
    if (!query) return radios;

    return radios.filter((radio) => {
      const haystack = normalize(`${radio.name} ${radio.city.name} ${radio.city.state}`);
      return haystack.includes(query);
    });
  }, [radios, searchTerm]);

  const handleSelectRadio = useCallback(
    async (radio: Radio) => {
      navigation.navigate("Player", { radioId: radio.id });
      await playRadio(radio);
    },
    [navigation, playRadio]
  );

  // Espaço reservado no fim da lista para o conteúdo não ficar escondido
  // atrás do MiniPlayer nem da barra de navegação/gestos do Android.
  const listBottomPadding =
    insets.bottom + (currentRadio ? 44 + spacing.xs * 2 + spacing.sm * 2 + spacing.sm : spacing.lg);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={typography.title}>MyRadio</Text>
        <Text style={styles.subtitle}>
          {isLoading ? "Carregando estações..." : `${filteredRadios.length} rádios disponíveis`}
        </Text>
        <View style={styles.searchWrapper}>
          <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.retryText} onPress={() => loadRadios()}>
            Toque para tentar novamente
          </Text>
        </View>
      ) : filteredRadios.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="radio-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nenhuma rádio encontrada para "{searchTerm}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRadios}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPadding }]}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <RadioListItem
              radio={item}
              isActive={currentRadio?.id === item.id}
              onPress={handleSelectRadio}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadRadios(true)}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <MiniPlayer onPress={() => navigation.navigate("Player", {})} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  searchWrapper: {
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  retryText: {
    color: colors.primary,
    fontWeight: "600",
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
