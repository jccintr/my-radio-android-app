import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { PlayerProvider } from "./src/context/PlayerContext";
import { RadioListScreen } from "./src/screens/RadioListScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import type { RootStackParamList } from "./src/navigation/types";
import { colors } from "./src/theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PlayerProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="RadioList" component={RadioListScreen} />
              <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PlayerProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
