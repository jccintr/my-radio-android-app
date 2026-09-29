import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  IOSCategory,
  IOSCategoryMode,
  State,
  TrackType,
  usePlaybackState,
} from "react-native-track-player";

import type { Radio } from "../api/radios";

interface PlayerContextValue {
  currentRadio: Radio | null;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isPlayerReady: boolean;
  playRadio: (radio: Radio) => Promise<void>;
  stop: () => Promise<void>;
  togglePlayStop: () => Promise<void>;
  setVolume: (value: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

let setupPromise: Promise<void> | null = null;

// Garante que o player nativo (e seu serviço em segundo plano) seja
// inicializado apenas uma vez durante o ciclo de vida do app.
async function setupTrackPlayerOnce(): Promise<void> {
  if (!setupPromise) {
    setupPromise = (async () => {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
        iosCategory: IOSCategory.Playback,
        iosCategoryMode: IOSCategoryMode.Default,
      });

      await TrackPlayer.updateOptions({
        // Mantém o serviço rodando (foreground service) mesmo com o app
        // fechado/minimizado, exibindo os controles na notificação.
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.ContinuePlayback,
        },
        capabilities: [Capability.Play, Capability.Stop],
        compactCapabilities: [Capability.Play, Capability.Stop],
        notificationCapabilities: [Capability.Play, Capability.Stop],
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        icon: require("../../assets/notification-icon.png"),
        color: 0xff1db954,
      });
    })();
  }

  return setupPromise;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentRadio, setCurrentRadio] = useState<Radio | null>(null);
  const [volume, setVolumeState] = useState(1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playbackState = usePlaybackState();
  const currentRadioRef = useRef<Radio | null>(null);

  useEffect(() => {
    let cancelled = false;

    setupTrackPlayerOnce()
      .then(async () => {
        if (cancelled) return;
        const currentVolume = await TrackPlayer.getVolume();
        setVolumeState(currentVolume);
        setIsPlayerReady(true);
      })
      .catch((error) => {
        console.warn("Erro ao inicializar o player:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const playRadio = useCallback(async (radio: Radio) => {
    await setupTrackPlayerOnce();

    const isSameRadio = currentRadioRef.current?.id === radio.id;

    if (!isSameRadio) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: String(radio.id),
        url: radio.streamUrl,
        title: radio.name,
        artist: "Rádio ao vivo",
        artwork: radio.imageUrl,
        type: radio.hsl ? TrackType.HLS : TrackType.Default,
        isLiveStream: true,
      });
      currentRadioRef.current = radio;
      setCurrentRadio(radio);
    }

    await TrackPlayer.play();
  }, []);

  const stop = useCallback(async () => {
    await TrackPlayer.stop();
  }, []);

  const togglePlayStop = useCallback(async () => {
    if (playbackState.state === State.Playing || playbackState.state === State.Buffering) {
      await TrackPlayer.stop();
    } else if (currentRadioRef.current) {
      await TrackPlayer.play();
    }
  }, [playbackState.state]);

  const setVolume = useCallback(async (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    await TrackPlayer.setVolume(clamped);
    setVolumeState(clamped);
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentRadio,
      isPlaying: playbackState.state === State.Playing,
      isBuffering:
        playbackState.state === State.Buffering || playbackState.state === State.Connecting,
      volume,
      isPlayerReady,
      playRadio,
      stop,
      togglePlayStop,
      setVolume,
    }),
    [currentRadio, playbackState.state, volume, isPlayerReady, playRadio, stop, togglePlayStop, setVolume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer precisa ser usado dentro de um PlayerProvider");
  }
  return context;
}
