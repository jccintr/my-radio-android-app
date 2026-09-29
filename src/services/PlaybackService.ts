import TrackPlayer, { Event } from "react-native-track-player";

// Este módulo roda dentro do serviço em segundo plano (foreground service no
// Android). É aqui que tratamos os controles vindos da notificação, da tela
// de bloqueio e de fones de ouvido, mesmo com o app minimizado.
export async function PlaybackService(): Promise<void> {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  // Fone de ouvido desconectado (ex.: usuário tira o fone) -> pausa o stream.
  TrackPlayer.addEventListener(Event.RemoteDuck, async (data) => {
    if (data.paused) {
      await TrackPlayer.pause();
    } else if (data.permanent) {
      await TrackPlayer.stop();
    } else {
      await TrackPlayer.play();
    }
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.warn("Erro na reprodução do stream:", error);
  });
}
