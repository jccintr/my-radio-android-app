import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";

import App from "./App";
import { PlaybackService } from "./src/services/PlaybackService";

// Precisa ser registrado o quanto antes, fora do ciclo de vida de componentes,
// para que o serviço de segundo plano (foreground service) funcione mesmo
// com o app minimizado ou a tela bloqueada.
TrackPlayer.registerPlaybackService(() => PlaybackService);

registerRootComponent(App);
