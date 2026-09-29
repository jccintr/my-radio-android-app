// Tema único do app, inspirado no visual escuro do Spotify.
export const colors = {
  background: "#121212",
  surface: "#181818",
  surfaceElevated: "#282828",
  border: "#2a2a2a",
  primary: "#1DB954", // verde característico
  primaryPressed: "#1AA34A",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textMuted: "#727272",
  danger: "#F15E6C",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

export const typography = {
  title: { fontSize: 22, fontWeight: "700" as const, color: colors.textPrimary },
  subtitle: { fontSize: 16, fontWeight: "600" as const, color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: "400" as const, color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: "400" as const, color: colors.textMuted },
};
